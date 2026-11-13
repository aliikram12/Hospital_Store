from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = ""
    icon_name: Optional[str] = "Activity"
    banner_image: Optional[str] = ""
    is_featured: Optional[bool] = True
    display_order: Optional[int] = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon_name: Optional[str] = None
    banner_image: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: int
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    brand: Optional[str] = "HospitalStore Elite"
    model_number: Optional[str] = ""
    sku: Optional[str] = ""
    category_id: int
    price: float
    original_price: float
    discount_percent: Optional[int] = 0
    stock_quantity: Optional[int] = 10
    is_in_stock: Optional[bool] = True
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    rating: Optional[float] = 4.8
    reviews_count: Optional[int] = 12
    warranty: Optional[str] = "1 Year Official Manufacturer Warranty"
    lead_time: Optional[str] = "In Stock - Dispatches in 24h"
    short_desc: Optional[str] = ""
    full_desc: Optional[str] = ""
    image_url: Optional[str] = ""
    additional_images: Optional[List[str]] = []
    specifications: Optional[Dict[str, Any]] = {}
    features: Optional[List[str]] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    discount_percent: Optional[int] = None
    stock_quantity: Optional[int] = None
    is_in_stock: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    warranty: Optional[str] = None
    lead_time: Optional[str] = None
    short_desc: Optional[str] = None
    full_desc: Optional[str] = None
    image_url: Optional[str] = None
    additional_images: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    features: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
    category_name: Optional[str] = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    product_image: Optional[str] = ""
    unit_price: float
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    product_name: str
    product_image: Optional[str] = ""
    unit_price: float
    quantity: int
    total_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    hospital_clinic_name: Optional[str] = ""
    shipping_address: str
    city: str
    state: str
    postal_code: str
    country: Optional[str] = "India"
    gstin: Optional[str] = ""
    payment_method: Optional[str] = "Credit/Debit Card"
    notes: Optional[str] = ""
    items: List[OrderItemCreate]
    discount_amount: Optional[float] = 0.0

class OrderStatusUpdate(BaseModel):
    order_status: Optional[str] = None
    payment_status: Optional[str] = None
    tracking_courier: Optional[str] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    hospital_clinic_name: Optional[str] = ""
    shipping_address: str
    city: str
    state: str
    postal_code: str
    country: str
    gstin: Optional[str] = ""
    subtotal: float
    tax_amount: float
    shipping_fee: float
    discount_amount: float
    total_amount: float
    order_status: str
    payment_status: str
    payment_method: str
    tracking_courier: Optional[str] = ""
    tracking_number: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


# Quote Request Schemas
class QuoteRequestCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: Optional[str] = ""
    customer_name: str
    email: str
    phone: str
    hospital_name: Optional[str] = ""
    city: Optional[str] = ""
    quantity: Optional[int] = 1
    target_timeline: Optional[str] = "Immediate (within 7 days)"
    message: Optional[str] = ""

class QuoteRequestResponse(QuoteRequestCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class QuoteStatusUpdate(BaseModel):
    status: str


# Customer Inquiry Schemas
class CustomerInquiryCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    department: Optional[str] = "Biomedical Sales"
    message: str

class CustomerInquiryResponse(CustomerInquiryCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Analytics & Dashboard Schemas
class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    pending_orders: int
    active_products: int
    total_inquiries: int
    low_stock_count: int
    recent_orders: List[OrderResponse]
    sales_by_status: Dict[str, int]
    top_categories: List[Dict[str, Any]]

