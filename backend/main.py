import datetime
import random
import json
import os
import shutil
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Query, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    version="2.1.0"
)

# Enable CORS for local dev and frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


# ==========================================
# FILE UPLOAD API (Device Upload Support)
# ==========================================

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload product image, category icon, or payment proof screenshot."""
    try:
        ext = os.path.splitext(file.filename)[1].lower()
        if not ext:
            ext = ".jpg"
        allowed_exts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"]
        if ext not in allowed_exts:
            raise HTTPException(status_code=400, detail=f"Unsupported file extension {ext}. Allowed: {allowed_exts}")

        filename = f"{uuid.uuid4().hex[:12]}_{int(datetime.datetime.utcnow().timestamp())}{ext}"
        destination = os.path.join(UPLOADS_DIR, filename)

        with open(destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "success": True,
            "filename": filename,
            "url": f"/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


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
    # Provide defaults if not found
    if "currency_rate_usd" not in settings_dict:
        settings_dict["currency_rate_usd"] = "280"
    if "bank_account_title" not in settings_dict:
        settings_dict["bank_account_title"] = "Hospital Store Official"
    if "bank_account_no" not in settings_dict:
        settings_dict["bank_account_no"] = "0201-0105492819 (Meezan Bank)"
    if "easypaisa_jazzcash" not in settings_dict:
        settings_dict["easypaisa_jazzcash"] = "0300-1234567 (Hospital Store)"
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
        # Fetch up to 6 product titles to serve as mega-menu subcategories/highlights
        sample_prods = db.query(models.Product.name).filter(models.Product.category_id == c.id).limit(8).all()
        subitems = [p[0] for p in sample_prods]
        res.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "icon_name": c.icon_name,
            "banner_image": c.banner_image,
            "is_featured": c.is_featured,
            "display_order": c.display_order,
            "product_count": prod_count,
            "subitems": subitems
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
    prod_dict = product_data.dict()
    if not prod_dict.get("sku"):
        prod_dict["sku"] = f"HS-{random.randint(1000, 9999)}"
    if not prod_dict.get("slug"):
        prod_dict["slug"] = prod_dict["name"].lower().replace(" ", "-").replace("/", "-")[:250]

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
# ORDERS & BILLING API (2 PAYMENT MODES ONLY: COD & QR)
# ==========================================

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    # Validate payment method: ONLY Cash on Delivery OR QR Code / Bank Transfer
    pm = order_data.payment_method
    if "QR" not in pm and "Cash" not in pm and "COD" not in pm:
        pm = "Cash on Delivery"

    # Calculate subtotal from items (all calculations done in base PKR)
    subtotal = sum(item.unit_price * item.quantity for item in order_data.items)
    
    tax_rate = 0.12 # 12% standard medical GST
    tax_amount = round(subtotal * tax_rate, 2)
    
    # Free shipping on >= 5000 PKR
    shipping_fee = 0.0 if subtotal >= 5000 else 250.0
    discount_amount = order_data.discount_amount or 0.0
    total_amount = round(subtotal + tax_amount + shipping_fee - discount_amount, 2)

    rand_suffix = random.randint(1000, 9999)
    order_num = f"HS-2026-{rand_suffix}"

    courier = "TCS Express Medical Cargo"
    tracking_no = f"TCS-MED-{random.randint(10000000, 99999999)}"

    # Payment Status
    if "QR" in pm:
        payment_status = "Pending Verification (SS Uploaded)" if order_data.payment_proof_image else "Awaiting Bank Transfer"
    else:
        payment_status = "Pay on Delivery (COD)"

    order_status = "Processing"

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
        country=order_data.country or "Pakistan",
        gstin=order_data.gstin or "",
        currency=order_data.currency or "PKR",
        exchange_rate=order_data.exchange_rate or 280.0,
        subtotal=subtotal,
        tax_amount=tax_amount,
        shipping_fee=shipping_fee,
        discount_amount=discount_amount,
        total_amount=total_amount,
        order_status=order_status,
        payment_status=payment_status,
        payment_method=pm,
        payment_proof_image=order_data.payment_proof_image or "",
        transaction_ref=order_data.transaction_ref or "",
        tracking_courier=courier,
        tracking_number=tracking_no,
        notes=order_data.notes or ""
    )

    db.add(new_order)
    db.flush()

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

        if item.product_id:
            db_p = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if db_p:
                db_p.stock_quantity = max(0, db_p.stock_quantity - item.quantity)
                if db_p.stock_quantity == 0:
                    db_p.is_in_stock = False

    # Also record or increment customer order count
    existing_user = db.query(models.User).filter(models.User.email == order_data.customer_email).first()
    if existing_user:
        existing_user.total_orders += 1
    else:
        new_user = models.User(
            full_name=order_data.customer_name,
            email=order_data.customer_email,
            phone=order_data.customer_phone,
            hospital_name=order_data.hospital_clinic_name or "Individual Buyer",
            role="Purchaser",
            status="Active",
            total_orders=1
        )
        db.add(new_user)

    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/api/orders/track/{order_number}")
def track_order(order_number: str, db: Session = Depends(get_db)):
    clean_num = order_number.strip().upper()
    order = db.query(models.Order).filter(models.Order.order_number == clean_num).first()
    if not order:
        # Also allow search by phone or tracking number
        order = db.query(models.Order).filter(
            or_(
                models.Order.customer_phone.ilike(f"%{clean_num}%"),
                models.Order.tracking_number.ilike(f"%{clean_num}%")
            )
        ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Shipment not found. Please verify your order number (e.g. HS-2026-XXXX)")
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
                models.Order.tracking_number.ilike(s_fmt),
                models.Order.transaction_ref.ilike(s_fmt)
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
    if payload.payment_proof_image is not None:
        order.payment_proof_image = payload.payment_proof_image
    if payload.transaction_ref is not None:
        order.transaction_ref = payload.transaction_ref
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

    half_tax = round(order.tax_amount / 2, 2)
    rate = order.exchange_rate or 280.0

    invoice_data = {
        "invoice_number": f"INV-{order.order_number.replace('HS-', '')}",
        "invoice_date": order.created_at.strftime("%d-%b-%Y"),
        "currency": order.currency or "PKR",
        "exchange_rate": rate,
        "seller": {
            "name": "Hospital Store Pvt. Ltd.",
            "address": "Main Commercial Medical Boulevard, Shahrah-e-Faisal, Karachi 75350",
            "gstin": "PK-HST-982104-M",
            "pan": "NTN-4921049-1",
            "phone": "+92 300 1234567 / 021 34567890",
            "email": "billing@hospitalstore.com"
        },
        "buyer": {
            "name": order.customer_name,
            "hospital": order.hospital_clinic_name or "Individual Healthcare Provider",
            "address": f"{order.shipping_address}, {order.city}, {order.state} - {order.postal_code}",
            "phone": order.customer_phone,
            "email": order.customer_email,
            "gstin": order.gstin or "NTN / General Consumer"
        },
        "order_details": {
            "order_number": order.order_number,
            "order_date": order.created_at.strftime("%d-%b-%Y %I:%M %p"),
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "dispatch_status": order.order_status,
            "payment_proof_image": order.payment_proof_image,
            "transaction_ref": order.transaction_ref,
            "courier": order.tracking_courier,
            "tracking_number": order.tracking_number
        },
        "items": [
            {
                "id": it.id,
                "name": it.product_name,
                "hsn": "9018",
                "qty": it.quantity,
                "unit_price_pkr": it.unit_price,
                "unit_price_usd": round(it.unit_price / rate, 2),
                "total_price_pkr": it.total_price,
                "total_price_usd": round(it.total_price / rate, 2),
                "taxable_value": it.total_price,
                "cgst_amount": round(it.total_price * 0.06, 2),
                "sgst_amount": round(it.total_price * 0.06, 2),
                "total": round(it.total_price * 1.12, 2)
            }
            for it in order.items
        ],
        "summary": {
            "subtotal_pkr": order.subtotal,
            "subtotal_usd": round(order.subtotal / rate, 2),
            "cgst_pkr": half_tax,
            "sgst_pkr": half_tax,
            "total_tax_pkr": order.tax_amount,
            "total_tax_usd": round(order.tax_amount / rate, 2),
            "shipping_fee_pkr": order.shipping_fee,
            "discount_pkr": order.discount_amount,
            "grand_total_pkr": order.total_amount,
            "grand_total_usd": round(order.total_amount / rate, 2)
        }
    }
    return invoice_data


# ==========================================
# USER MANAGEMENT API (Admin Console)
# ==========================================

@app.get("/api/admin/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return users

@app.post("/api/admin/users", status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.patch("/api/admin/users/{id}/status")
def toggle_user_status(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = "Suspended" if user.status == "Active" else "Active"
    db.commit()
    return user

@app.delete("/api/admin/users/{id}")
def delete_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


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
    total_rev = db.query(func.sum(models.Order.total_amount)).filter(models.Order.payment_status.ilike("%paid%")).scalar() or 0.0
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(models.Order.order_status.in_(["Pending", "Processing", "Pending Confirmation"])).count()
    active_products = db.query(models.Product).count()
    total_users = db.query(models.User).count()
    low_stock_count = db.query(models.Product).filter(models.Product.stock_quantity <= 10).count()
    total_inquiries = db.query(models.CustomerInquiry).count() + db.query(models.QuoteRequest).count()

    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(6).all()

    status_counts = {}
    for st in ["Processing", "Dispatched", "Delivered", "Cancelled"]:
        cnt = db.query(models.Order).filter(models.Order.order_status.ilike(f"%{st}%")).count()
        status_counts[st] = cnt

    top_cats = []
    cats = db.query(models.Category).all()
    for c in cats:
        cnt = db.query(models.Product).filter(models.Product.category_id == c.id).count()
        top_cats.append({
            "name": c.name,
            "product_count": cnt,
            "icon": c.icon_name
        })
    top_cats = sorted(top_cats, key=lambda x: x["product_count"], reverse=True)[:6]

    return {
        "total_revenue": round(total_rev, 2),
        "total_revenue_usd": round(total_rev / 280.0, 2),
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "active_products": active_products,
        "total_users": total_users,
        "low_stock_count": low_stock_count,
        "total_inquiries": total_inquiries,
        "recent_orders": recent_orders,
        "sales_by_status": status_counts,
        "top_categories": top_cats,
        "monthly_growth_rate": "+22.8%"
    }


# ==========================================
# SERVE REACT FRONTEND (SPA)
# ==========================================

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("uploads"):
            raise HTTPException(status_code=404, detail="Resource not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
