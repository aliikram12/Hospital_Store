import datetime
import json
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, default="")
    icon_name = Column(String(50), default="Activity") # Lucide icon name
    banner_image = Column(String(500), default="")
    is_featured = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    slug = Column(String(280), unique=True, index=True, nullable=False)
    brand = Column(String(100), index=True, default="HospitalStore Elite")
    model_number = Column(String(100), default="")
    sku = Column(String(100), unique=True, index=True)
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category", back_populates="products")

    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    discount_percent = Column(Integer, default=0)

    stock_quantity = Column(Integer, default=15)
    is_in_stock = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)

    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=24)
    warranty = Column(String(100), default="1 Year Official Manufacturer Warranty")
    lead_time = Column(String(100), default="Ready in Stock • Dispatches in 24 hrs")

    short_desc = Column(Text, default="")
    full_desc = Column(Text, default="")
    image_url = Column(String(500), default="")
    additional_images_json = Column(Text, default="[]")
    specifications_json = Column(Text, default="{}")
    features_json = Column(Text, default="[]")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    @property
    def additional_images(self):
        try:
            return json.loads(self.additional_images_json or "[]")
        except:
            return []

    @additional_images.setter
    def additional_images(self, val):
        self.additional_images_json = json.dumps(val or [])

    @property
    def specifications(self):
        try:
            return json.loads(self.specifications_json or "{}")
        except:
            return {}

    @specifications.setter
    def specifications(self, val):
        self.specifications_json = json.dumps(val or {})

    @property
    def features(self):
        try:
            return json.loads(self.features_json or "[]")
        except:
            return []

    @features.setter
    def features(self, val):
        self.features_json = json.dumps(val or [])


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    customer_name = Column(String(150), nullable=False)
    customer_email = Column(String(150), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    hospital_clinic_name = Column(String(200), default="")
    
    shipping_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(30), nullable=False)
    country = Column(String(50), default="Pakistan")
    gstin = Column(String(50), default="")

    currency = Column(String(10), default="PKR") # PKR or USD
    exchange_rate = Column(Float, default=280.0) # PKR per USD

    subtotal = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    shipping_fee = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)

    order_status = Column(String(50), default="Processing")  # Pending, Processing, Dispatched, Delivered, Cancelled
    payment_status = Column(String(50), default="Pending Verification")  # Paid, Pending Verification, Failed, Refunded
    payment_method = Column(String(100), default="Cash on Delivery") # Cash on Delivery (COD) OR QR Code / Bank Transfer
    
    payment_proof_image = Column(String(500), default="") # Receipt Screenshot URL
    transaction_ref = Column(String(100), default="")    # Bank TID / JazzCash / EasyPaisa Trx ID

    tracking_courier = Column(String(100), default="TCS Express Medical Cargo")
    tracking_number = Column(String(100), default="")
    notes = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name = Column(String(255), nullable=False)
    product_image = Column(String(500), default="")
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name = Column(String(255), default="")
    customer_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    hospital_name = Column(String(200), default="")
    city = Column(String(100), default="")
    quantity = Column(Integer, default=1)
    target_timeline = Column(String(100), default="Immediate (within 7 days)")
    message = Column(Text, default="")
    status = Column(String(50), default="New") # New, Contacted, Quote Sent, Won, Closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class CustomerInquiry(Base):
    __tablename__ = "customer_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50), default="")
    subject = Column(String(255), default="")
    department = Column(String(100), default="Biomedical Sales")
    message = Column(Text, nullable=False)
    status = Column(String(50), default="Pending") # Pending, Responded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(50), default="")
    hospital_name = Column(String(200), default="")
    role = Column(String(50), default="Hospital Admin") # Hospital Admin, Procurement Officer, Doctor, Store Manager
    status = Column(String(50), default="Active")       # Active, Suspended
    total_orders = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, default="")
    description = Column(String(255), default="")
