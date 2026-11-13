import datetime
import random
import json
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc, asc

from database import engine, get_db, Base
import models
import schemas

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HospitalStore Healthcare & Medical Equipment API",
    description="High-performance backend API for HospitalStore e-commerce, quotations, B2B hospital billing, and admin management.",
    version="2.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HEALTH & SETTINGS
# ==========================================

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "HospitalStore Core Medical Backend",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)):
    settings_rows = db.query(models.Setting).all()
    settings_dict = {s.key: s.value for s in settings_rows}
    return settings_dict

@app.put("/api/settings")
def update_settings(payload: Dict[str, str], db: Session = Depends(get_db)):
    for key, value in payload.items():
        setting = db.query(models.Setting).filter(models.Setting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            db.add(models.Setting(key=key, value=str(value)))
    db.commit()
    return {"message": "Settings updated successfully", "updated": list(payload.keys())}


# ==========================================
# CATEGORIES API
# ==========================================

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).order_by(models.Category.display_order.asc(), models.Category.name.asc()).all()
    res = []
    for c in categories:
        prod_count = db.query(models.Product).filter(models.Product.category_id == c.id).count()
        res.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "icon_name": c.icon_name,
            "banner_image": c.banner_image,
            "is_featured": c.is_featured,
            "display_order": c.display_order,
            "product_count": prod_count
        })
    return res

@app.get("/api/categories/{slug_or_id}")
def get_category(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        cat = db.query(models.Category).filter(models.Category.id == int(slug_or_id)).first()
    else:
        cat = db.query(models.Category).filter(models.Category.slug == slug_or_id).first()
    
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    prod_count = db.query(models.Product).filter(models.Product.category_id == cat.id).count()
    return {
        "id": cat.id,
        "name": cat.name,
        "slug": cat.slug,
        "description": cat.description,
        "icon_name": cat.icon_name,
        "banner_image": cat.banner_image,
        "is_featured": cat.is_featured,
        "display_order": cat.display_order,
        "product_count": prod_count
    }

@app.post("/api/categories", status_code=status.HTTP_201_CREATED)
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(
        or_(models.Category.name == cat.name, models.Category.slug == cat.slug)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name or slug already exists")
    
    new_cat = models.Category(**cat.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@app.put("/api/categories/{id}")
def update_category(id: int, cat: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, val in cat.dict(exclude_unset=True).items():
        setattr(db_cat, key, val)
    
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/api/categories/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted successfully"}


# ==========================================
# PRODUCTS API
# ==========================================

def format_product_response(p: models.Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "slug": p.slug,
        "brand": p.brand,
        "model_number": p.model_number,
        "sku": p.sku,
        "category_id": p.category_id,
        "category_name": p.category.name if p.category else "",
        "price": p.price,
        "original_price": p.original_price,
        "discount_percent": p.discount_percent,
        "stock_quantity": p.stock_quantity,
        "is_in_stock": p.is_in_stock,
        "is_featured": p.is_featured,
        "is_trending": p.is_trending,
        "rating": p.rating,
        "reviews_count": p.reviews_count,
        "warranty": p.warranty,
        "lead_time": p.lead_time,
        "short_desc": p.short_desc,
        "full_desc": p.full_desc,
        "image_url": p.image_url,
        "additional_images": p.additional_images,
        "specifications": p.specifications,
        "features": p.features,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

@app.get("/api/products")
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: Optional[bool] = False,
    featured_only: Optional[bool] = False,
    trending_only: Optional[bool] = False,
    sort_by: Optional[str] = "featured", # featured, price_asc, price_desc, rating, newest
    limit: Optional[int] = 50,
    offset: Optional[int] = 0,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    # Filter Category (by id or slug)
    if category:
        if category.isdigit():
            query = query.filter(models.Product.category_id == int(category))
        else:
            cat_obj = db.query(models.Category).filter(models.Category.slug == category).first()
            if cat_obj:
                query = query.filter(models.Product.category_id == cat_obj.id)

    # Filter Brand
    if brand:
        query = query.filter(models.Product.brand.ilike(f"%{brand}%"))

    # Search keyword
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.name.ilike(search_fmt),
                models.Product.brand.ilike(search_fmt),
                models.Product.model_number.ilike(search_fmt),
                models.Product.short_desc.ilike(search_fmt),
                models.Product.sku.ilike(search_fmt)
            )
        )

    # Price range
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)

    # Stock & flags
    if in_stock_only:
        query = query.filter(models.Product.is_in_stock == True, models.Product.stock_quantity > 0)
    if featured_only:
        query = query.filter(models.Product.is_featured == True)
    if trending_only:
        query = query.filter(models.Product.is_trending == True)

    total_count = query.count()

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(models.Product.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(models.Product.created_at.desc())
    else: # featured default
        query = query.order_by(models.Product.is_featured.desc(), models.Product.id.asc())

    products = query.offset(offset).limit(limit).all()

    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "products": [format_product_response(p) for p in products]
    }

@app.get("/api/products/brands")
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(models.Product.brand).distinct().all()
    return [b[0] for b in brands if b[0]]

@app.get("/api/products/{slug_or_id}")
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        prod = db.query(models.Product).filter(models.Product.id == int(slug_or_id)).first()
    else:
        prod = db.query(models.Product).filter(models.Product.slug == slug_or_id).first()
    
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Related products from same category
    related = db.query(models.Product).filter(
        models.Product.category_id == prod.category_id,
        models.Product.id != prod.id
    ).limit(4).all()

    resp = format_product_response(prod)
    resp["related_products"] = [format_product_response(r) for r in related]
    return resp

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product_data: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Auto generate SKU if empty
    prod_dict = product_data.dict()
    if not prod_dict.get("sku"):
        prod_dict["sku"] = f"HS-{random.randint(1000, 9999)}"
    if not prod_dict.get("slug"):
        prod_dict["slug"] = prod_dict["name"].lower().replace(" ", "-").replace("/", "-")[:250]

    # Calculate discount percent
    orig_p = prod_dict.get("original_price") or prod_dict["price"]
    price = prod_dict["price"]
    if orig_p > price:
        prod_dict["discount_percent"] = int(((orig_p - price) / orig_p) * 100)

    add_images = prod_dict.pop("additional_images", [])
    specs = prod_dict.pop("specifications", {})
    feats = prod_dict.pop("features", [])

    new_prod = models.Product(**prod_dict)
    new_prod.additional_images = add_images
    new_prod.specifications = specs
    new_prod.features = feats

    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return format_product_response(new_prod)

@app.put("/api/products/{id}")
def update_product(id: int, product_data: schemas.ProductUpdate, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    update_dict = product_data.dict(exclude_unset=True)

    if "additional_images" in update_dict:
        prod.additional_images = update_dict.pop("additional_images")
    if "specifications" in update_dict:
        prod.specifications = update_dict.pop("specifications")
    if "features" in update_dict:
        prod.features = update_dict.pop("features")

    for k, v in update_dict.items():
        setattr(prod, k, v)

    # Recalculate discount if prices modified
    if prod.original_price and prod.price and prod.original_price > prod.price:
        prod.discount_percent = int(((prod.original_price - prod.price) / prod.original_price) * 100)

    db.commit()
    db.refresh(prod)
    return format_product_response(prod)

@app.delete("/api/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.patch("/api/products/{id}/toggle-stock")
def toggle_product_stock(id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    prod.is_in_stock = not prod.is_in_stock
    db.commit()
    return {"id": prod.id, "is_in_stock": prod.is_in_stock}

@app.patch("/api/products/{id}/toggle-featured")
def toggle_product_featured(id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    prod.is_featured = not prod.is_featured
    db.commit()
    return {"id": prod.id, "is_featured": prod.is_featured}


# ==========================================
# ORDERS & BILLING API
# ==========================================

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    # Calculate subtotal from items
    subtotal = sum(item.unit_price * item.quantity for item in order_data.items)
    
    # 12% GST on medical equipment
    tax_rate = 0.12
    tax_amount = round(subtotal * tax_rate, 2)
    
    # Free shipping on >= 5000
    shipping_fee = 0.0 if subtotal >= 5000 else 250.0
    discount_amount = order_data.discount_amount or 0.0
    total_amount = round(subtotal + tax_amount + shipping_fee - discount_amount, 2)

    # Generate unique Hospital Store order number
    rand_suffix = random.randint(1000, 9999)
    order_num = f"HS-2026-{rand_suffix}"

    # Auto assign tracking courier based on payment method
    courier = "BlueDart Health Express" if order_data.payment_method != "Hospital PO / RTGS Transfer" else "Gati KWE Heavy Logistics"
    tracking_no = f"BD-HS-{random.randint(10000000, 99999999)}"

    # Determine initial status
    payment_status = "Paid" if "COD" not in order_data.payment_method else "Pending (Pay on Delivery)"
    order_status = "Processing" if payment_status == "Paid" else "Pending Confirmation"

    new_order = models.Order(
        order_number=order_num,
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        hospital_clinic_name=order_data.hospital_clinic_name or "",
        shipping_address=order_data.shipping_address,
        city=order_data.city,
        state=order_data.state,
        postal_code=order_data.postal_code,
        country=order_data.country or "India",
        gstin=order_data.gstin or "",
        subtotal=subtotal,
        tax_amount=tax_amount,
        shipping_fee=shipping_fee,
        discount_amount=discount_amount,
        total_amount=total_amount,
        order_status=order_status,
        payment_status=payment_status,
        payment_method=order_data.payment_method,
        tracking_courier=courier,
        tracking_number=tracking_no,
        notes=order_data.notes or ""
    )

    db.add(new_order)
    db.flush()

    # Add items
    for item in order_data.items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_image=item.product_image or "",
            unit_price=item.unit_price,
            quantity=item.quantity,
            total_price=item.unit_price * item.quantity
        )
        db.add(order_item)

        # Update product stock if matched
        if item.product_id:
            db_p = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if db_p:
                db_p.stock_quantity = max(0, db_p.stock_quantity - item.quantity)
                if db_p.stock_quantity == 0:
                    db_p.is_in_stock = False

    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/api/orders/track/{order_number}")
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.order_number == order_number.strip().upper()).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found. Please verify your order number (e.g. HS-2026-XXXX)")
    return order

@app.get("/api/admin/orders")
def get_admin_orders(
    status: Optional[str] = None,
    payment: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Order)

    if status and status != "All":
        query = query.filter(models.Order.order_status.ilike(status))

    if payment and payment != "All":
        query = query.filter(models.Order.payment_status.ilike(payment))

    if search:
        s_fmt = f"%{search}%"
        query = query.filter(
            or_(
                models.Order.order_number.ilike(s_fmt),
                models.Order.customer_name.ilike(s_fmt),
                models.Order.customer_email.ilike(s_fmt),
                models.Order.hospital_clinic_name.ilike(s_fmt),
                models.Order.city.ilike(s_fmt),
                models.Order.tracking_number.ilike(s_fmt)
            )
        )

    orders = query.order_by(models.Order.created_at.desc()).all()
    return orders

@app.get("/api/admin/orders/{id}")
def get_order_details(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/api/admin/orders/{id}/status")
def update_order_status(id: int, payload: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if payload.order_status is not None:
        order.order_status = payload.order_status
    if payload.payment_status is not None:
        order.payment_status = payload.payment_status
    if payload.tracking_courier is not None:
        order.tracking_courier = payload.tracking_courier
    if payload.tracking_number is not None:
        order.tracking_number = payload.tracking_number
    if payload.notes is not None:
        order.notes = payload.notes

    order.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(order)
    return order

@app.delete("/api/admin/orders/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}

@app.get("/api/admin/orders/{id}/invoice")
def get_order_invoice(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Build GST Breakdown (CGST 6% + SGST 6% or IGST 12%)
    half_tax = round(order.tax_amount / 2, 2)

    invoice_data = {
        "invoice_number": f"INV-{order.order_number.replace('HS-', '')}",
        "invoice_date": order.created_at.strftime("%d-%b-%Y"),
        "seller": {
            "name": "Hospital Store Pvt. Ltd.",
            "address": "Plot 42, Okhla Industrial Area, Phase III, New Delhi 110020",
            "gstin": "07AAECH7890M1Z8",
            "pan": "AAECH7890M",
            "phone": "+91 8000 467 786",
            "email": "billing@hospitalstore.com"
        },
        "buyer": {
            "name": order.customer_name,
            "hospital": order.hospital_clinic_name or "Individual Healthcare Provider",
            "address": f"{order.shipping_address}, {order.city}, {order.state} - {order.postal_code}",
            "phone": order.customer_phone,
            "email": order.customer_email,
            "gstin": order.gstin or "Unregistered / Consumer"
        },
        "order_details": {
            "order_number": order.order_number,
            "order_date": order.created_at.strftime("%d-%b-%Y %I:%M %p"),
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "dispatch_status": order.order_status,
            "courier": order.tracking_courier,
            "tracking_number": order.tracking_number
        },
        "items": [
            {
                "id": it.id,
                "name": it.product_name,
                "hsn": "9018", # Medical instruments HSN code
                "qty": it.quantity,
                "unit_price": it.unit_price,
                "taxable_value": it.total_price,
                "cgst_rate": "6%",
                "cgst_amount": round(it.total_price * 0.06, 2),
                "sgst_rate": "6%",
                "sgst_amount": round(it.total_price * 0.06, 2),
                "total": round(it.total_price * 1.12, 2)
            }
            for it in order.items
        ],
        "summary": {
            "subtotal": order.subtotal,
            "cgst": half_tax,
            "sgst": half_tax,
            "total_tax": order.tax_amount,
            "shipping_fee": order.shipping_fee,
            "discount": order.discount_amount,
            "grand_total": order.total_amount
        }
    }
    return invoice_data


# ==========================================
# QUOTATION REQUESTS (RFQ)
# ==========================================

@app.post("/api/quotes", status_code=status.HTTP_201_CREATED)
def submit_quote_request(quote: schemas.QuoteRequestCreate, db: Session = Depends(get_db)):
    new_quote = models.QuoteRequest(**quote.dict())
    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    return new_quote

@app.get("/api/admin/quotes")
def get_quote_requests(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.QuoteRequest)
    if status and status != "All":
        q = q.filter(models.QuoteRequest.status.ilike(status))
    return q.order_by(models.QuoteRequest.created_at.desc()).all()

@app.patch("/api/admin/quotes/{id}/status")
def update_quote_status(id: int, payload: schemas.QuoteStatusUpdate, db: Session = Depends(get_db)):
    quote = db.query(models.QuoteRequest).filter(models.QuoteRequest.id == id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote request not found")
    quote.status = payload.status
    db.commit()
    db.refresh(quote)
    return quote

@app.delete("/api/admin/quotes/{id}")
def delete_quote_request(id: int, db: Session = Depends(get_db)):
    quote = db.query(models.QuoteRequest).filter(models.QuoteRequest.id == id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote request not found")
    db.delete(quote)
    db.commit()
    return {"message": "Quote request deleted"}


# ==========================================
# CUSTOMER INQUIRIES
# ==========================================

@app.post("/api/inquiries", status_code=status.HTTP_201_CREATED)
def submit_inquiry(inquiry: schemas.CustomerInquiryCreate, db: Session = Depends(get_db)):
    new_inq = models.CustomerInquiry(**inquiry.dict())
    db.add(new_inq)
    db.commit()
    db.refresh(new_inq)
    return new_inq

@app.get("/api/admin/inquiries")
def get_inquiries(db: Session = Depends(get_db)):
    return db.query(models.CustomerInquiry).order_by(models.CustomerInquiry.created_at.desc()).all()

@app.patch("/api/admin/inquiries/{id}/status")
def update_inquiry_status(id: int, status: str = Query(...), db: Session = Depends(get_db)):
    inq = db.query(models.CustomerInquiry).filter(models.CustomerInquiry.id == id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inq.status = status
    db.commit()
    return inq

@app.delete("/api/admin/inquiries/{id}")
def delete_inquiry(id: int, db: Session = Depends(get_db)):
    inq = db.query(models.CustomerInquiry).filter(models.CustomerInquiry.id == id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inq)
    db.commit()
    return {"message": "Inquiry deleted"}


# ==========================================
# ADMIN ANALYTICS & DASHBOARD
# ==========================================

@app.get("/api/admin/analytics/dashboard")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    total_rev = db.query(func.sum(models.Order.total_amount)).filter(models.Order.payment_status == "Paid").scalar() or 0.0
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(models.Order.order_status.in_(["Pending", "Processing", "Pending Confirmation"])).count()
    active_products = db.query(models.Product).count()
    low_stock_count = db.query(models.Product).filter(models.Product.stock_quantity <= 10).count()
    total_inquiries = db.query(models.CustomerInquiry).count() + db.query(models.QuoteRequest).count()

    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(6).all()

    # Sales by status
    status_counts = {}
    for st in ["Processing", "Dispatched", "Delivered", "Cancelled"]:
        cnt = db.query(models.Order).filter(models.Order.order_status.ilike(f"%{st}%")).count()
        status_counts[st] = cnt

    # Top categories by products
    top_cats = []
    cats = db.query(models.Category).all()
    for c in cats:
        cnt = db.query(models.Product).filter(models.Product.category_id == c.id).count()
        top_cats.append({
            "name": c.name,
            "product_count": cnt,
            "icon": c.icon_name
        })
    top_cats = sorted(top_cats, key=lambda x: x["product_count"], reverse=True)[:5]

    return {
        "total_revenue": round(total_rev, 2),
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "active_products": active_products,
        "low_stock_count": low_stock_count,
        "total_inquiries": total_inquiries,
        "recent_orders": recent_orders,
        "sales_by_status": status_counts,
        "top_categories": top_cats,
        "monthly_growth_rate": "+18.4%"
    }


# ==========================================
# SERVE REACT FRONTEND (SPA)
# ==========================================
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

