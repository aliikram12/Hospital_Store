import json
import datetime
from database import engine, SessionLocal, Base
from models import Category, Product, Order, OrderItem, QuoteRequest, CustomerInquiry, Setting

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if products already exist
    if db.query(Category).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with authentic HospitalStore data...")

    # 1. Categories
    categories_data = [
        {
            "name": "ICU & Critical Care",
            "slug": "icu-critical-care",
            "description": "Advanced multi-parameter patient monitors, ventilators, defibrillators & critical care life-support units.",
            "icon_name": "HeartPulse",
            "banner_image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 1
        },
        {
            "name": "Operation Theatre (OT)",
            "slug": "operation-theatre",
            "description": "LED surgical shadowless lights, motorized OT tables, electrosurgical cautery & anesthesia workstations.",
            "icon_name": "Sparkles",
            "banner_image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 2
        },
        {
            "name": "Diagnostic & Imaging",
            "slug": "diagnostic-imaging",
            "description": "High resolution Color Doppler ultrasound scanners, digital ECG machines & portable X-ray systems.",
            "icon_name": "ScanLine",
            "banner_image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 3
        },
        {
            "name": "Hospital Furniture",
            "slug": "hospital-furniture",
            "description": "Motorized 5-function ICU beds, hydraulic patient stretchers, examination couches and crash carts.",
            "icon_name": "BedDouble",
            "banner_image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 4
        },
        {
            "name": "Respiratory & Home Care",
            "slug": "respiratory-care",
            "description": "Medical grade oxygen concentrators (5L & 10L), BiPAP / CPAP machines and portable mesh nebulizers.",
            "icon_name": "Wind",
            "banner_image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 5
        },
        {
            "name": "Emergency & Defibrillators",
            "slug": "emergency-defibrillators",
            "description": "Biphasic manual defibrillators with pacing, Automated External Defibrillators (AED) & resuscitation kits.",
            "icon_name": "Zap",
            "banner_image": "https://images.unsplash.com/photo-1583912267550-d47d6368d712?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 6
        },
        {
            "name": "Laboratory & Sterilization",
            "slug": "laboratory-sterilization",
            "description": "Class B autoclaves, hematology cell counters, digital clinical centrifuges & laboratory microscopes.",
            "icon_name": "FlaskConical",
            "banner_image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 7
        },
        {
            "name": "Infusion & Syringe Pumps",
            "slug": "infusion-syringe-pumps",
            "description": "Micro-infusion volumetric pumps, dual-channel syringe drivers with drug library and occlusion alarms.",
            "icon_name": "Activity",
            "banner_image": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
            "is_featured": True,
            "display_order": 8
        }
    ]

    cat_map = {}
    for c in categories_data:
        cat_obj = Category(**c)
        db.add(cat_obj)
        db.flush()
        cat_map[c["slug"]] = cat_obj.id

    # 2. Products
    products_data = [
        # ICU & Critical Care
        {
            "name": "Mindray uMEC 12 High-Precision Multi-Parameter Patient Monitor",
            "slug": "mindray-umec-12-patient-monitor",
            "brand": "Mindray Healthcare",
            "model_number": "uMEC-12",
            "sku": "HS-ICU-MN12",
            "category_id": cat_map["icu-critical-care"],
            "price": 68500.0,
            "original_price": 89000.0,
            "discount_percent": 23,
            "stock_quantity": 18,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 42,
            "warranty": "2 Years On-Site Comprehensive Warranty",
            "lead_time": "In Stock • Ships within 24 Hours",
            "short_desc": "12.1-inch LED high-resolution touch screen with 5-parameter monitoring (ECG, SpO2, NIBP, TEMP, RESP) & 4-hour Li-ion battery.",
            "full_desc": "The Mindray uMEC 12 is engineered for ICUs, emergency departments, and post-operative recovery rooms. Featuring ultra-durable medical-grade engineering, power-efficient architecture, and anti-interference SpO2 and NIBP technology. Offers massive 120-hour trend review and seamless central monitoring station (CMS) network connectivity via LAN or optional Wi-Fi.",
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
            "additional_images": [
                "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            ],
            "specifications": {
                "Screen Size": "12.1 inch High-Definition Color TFT LED (800x600)",
                "Standard Parameters": "3/5-Lead ECG, Mindray SpO2, NIBP, Dual Temp, Respiration",
                "Optional Modules": "Masimo/Nellcor SpO2, Microstream/Mainstream EtCO2, Dual IBP",
                "Battery Type": "Rechargeable Lithium-ion, Up to 4.5 hours continuous use",
                "Data Storage": "120 Hours Trend Graphs & Tables, 1000 NIBP Measurements, 100 Alarm Events",
                "Certifications": "CE Marked, ISO 13485, FDA Cleared"
            },
            "features": [
                "Advanced arrhythmia detection & ST-segment analysis algorithm",
                "Fanless design for quiet ICU environment and reduced hospital pathogen circulation",
                "Waterproof grade IPX1 protects against accidental fluid ingress",
                "Drop-tested to 0.75m for rugged emergency transport reliability",
                "Direct connection to Hospital Central Nursing Monitoring System"
            ]
        },
        {
            "name": "GE Healthcare Carescape V100 Vital Signs Vitality Monitor",
            "slug": "ge-carescape-v100-vital-signs-monitor",
            "brand": "GE Healthcare",
            "model_number": "V100-DINAMAP",
            "sku": "HS-ICU-GE100",
            "category_id": cat_map["icu-critical-care"],
            "price": 84000.0,
            "original_price": 105000.0,
            "discount_percent": 20,
            "stock_quantity": 9,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": False,
            "rating": 4.8,
            "reviews_count": 29,
            "warranty": "2 Years GE Authorized Service Warranty",
            "lead_time": "Ready in Stock • Same Day Dispatch",
            "short_desc": "Gold standard DINAMAP blood pressure technology for adult, pediatric, and neonatal patients with Nellcor SpO2.",
            "full_desc": "The GE Carescape V100 provides quick, reliable spot-checks and continuous monitoring across hospital wards. Built with legendary DINAMAP blood pressure precision that reads accurately even during hypothermia or weak pulse conditions.",
            "image_url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            "additional_images": [
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            ],
            "specifications": {
                "Parameters": "DINAMAP SuperSTAT NIBP, Nellcor OxiMax SpO2, Alaris Turbo Temp",
                "NIBP Cycle Time": "Fastest read in 20-30 seconds",
                "Battery Run Time": "Up to 11 hours heavy clinical duty",
                "Weight": "2.4 kg (ultra-portable for ward rounds)",
                "Display": "High contrast LED digital readout"
            },
            "features": [
                "Patented DINAMAP non-invasive blood pressure algorithm",
                "Proven to withstand harsh hospital disinfectants",
                "Rolling mobile stand compatibility with utility basket",
                "Audible and visual clinical threshold alarms"
            ]
        },
        {
            "name": "Dräger Savina 300 Classic Turbine-Driven ICU Ventilator",
            "slug": "drager-savina-300-icu-ventilator",
            "brand": "Dräger Medical",
            "model_number": "Savina-300",
            "sku": "HS-ICU-DR300",
            "category_id": cat_map["icu-critical-care"],
            "price": 680000.0,
            "original_price": 795000.0,
            "discount_percent": 14,
            "stock_quantity": 4,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 5.0,
            "reviews_count": 16,
            "warranty": "3 Years On-Site Comprehensive AMC",
            "lead_time": "Express Biomedical Logistics (2-3 Days)",
            "short_desc": "Independent turbine-driven critical care ventilator for adult & pediatric patients. No central compressed air line required.",
            "full_desc": "The Dräger Savina 300 delivers uncompromising ventilation therapy regardless of infrastructure constraints. Its integrated high-performance turbine ensures uninterrupted high-flow therapy, invasive and non-invasive ventilation (NIV), even during intra-hospital patient transfers.",
            "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
            "additional_images": [
                "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
            ],
            "specifications": {
                "Patient Profile": "Adult, Pediatric (tidal volume 50 mL to 2000 mL)",
                "Ventilation Modes": "VC-CMV, VC-AC, VC-SIMV, PC-BIPAP, SPN-CPAP/PS, High-Flow O2",
                "Air Supply": "Integrated internal turbine with 5-year guarantee",
                "Screen": "12-inch Color TFT display with touch & rotary dial",
                "Internal Battery": "Up to 5 hours independent operation"
            },
            "features": [
                "AutoFlow automatic regulation of inspiratory pressure",
                "Seamless non-invasive mask ventilation with dynamic leak compensation",
                "Smart open breathing concept allowing spontaneous breathing anytime",
                "Integrated nebulizer synchronization"
            ]
        },

        # Operation Theatre (OT)
        {
            "name": "Meditech Luxura 700/500 Twin Arm LED OT Surgical Shadowless Light",
            "slug": "meditech-luxura-twin-arm-led-surgical-light",
            "brand": "Meditech Surgical",
            "model_number": "LUX-700/500",
            "sku": "HS-OT-MED700",
            "category_id": cat_map["operation-theatre"],
            "price": 145000.0,
            "original_price": 195000.0,
            "discount_percent": 25,
            "stock_quantity": 7,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 31,
            "warranty": "3 Years Comprehensive OT Warranty + German Spring Arms",
            "lead_time": "Ready for Installation • Dispatches in 48h",
            "short_desc": "Dual dome surgical operating theatre lamp with 160,000 + 120,000 Lux illumination, CRI 96 and color temperature adjustment.",
            "full_desc": "Engineered for deep-cavity surgical procedures, cardiovascular surgeries, and neurosurgeries. Equipped with Osram Germany medical LEDs offering 60,000+ hours lifespan, negligible heat emission, and laminar air flow aerodynamic dome structure.",
            "image_url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Illuminance (Lux)": "Dome 1: 160,000 Lux | Dome 2: 120,000 Lux",
                "Color Temperature": "3,800K to 5,000K adjustable in 5 levels",
                "Color Rendering Index (Ra)": "> 96 (Superb tissue differentiation)",
                "Focus Depth": "> 1,200 mm",
                "LED Lifespan": "> 60,000 operational hours (Osram Germany)"
            },
            "features": [
                "Endoscopy low-light mood mode for laparoscopic surgeries",
                "Sterilizable detachable quick-click handle for surgeons",
                "Independent digital control touch keypad on each arm",
                "Laminar flow compatible streamlined dome profile"
            ]
        },
        {
            "name": "ValleyLab Force FX-C High Frequency Electrosurgical Cautery Generator",
            "slug": "valleylab-force-fx-c-electrosurgical-unit",
            "brand": "Medtronic ValleyLab",
            "model_number": "Force FX-C",
            "sku": "HS-OT-VL300",
            "category_id": cat_map["operation-theatre"],
            "price": 285000.0,
            "original_price": 340000.0,
            "discount_percent": 16,
            "stock_quantity": 6,
            "is_in_stock": True,
            "is_featured": False,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 27,
            "warranty": "2 Years Warranty + Complete Cable & Bipolar Forceps Set",
            "lead_time": "In Stock • Ships in 24h",
            "short_desc": "300W Isolated electrosurgical unit with Instant Response technology for precision cutting and coagulation across general and laparoscopic surgeries.",
            "full_desc": "The worldwide benchmark for OT cautery. Instant Response technology senses tissue impedance changes 200 times per second and automatically modulates power delivery, minimizing thermal collateral damage and neuromuscular stimulation.",
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Pure Cut": "300 Watts at 300 Ohms",
                "Blend Mode": "200 Watts at 300 Ohms",
                "Coagulation Modes": "Desiccate (120W), Fulgurate (120W), Spray (120W)",
                "Bipolar Output": "70 Watts at 100 Ohms",
                "Safety System": "REM (Return Electrode Monitoring) Contact Quality System"
            },
            "features": [
                "Patented REM safety system eliminates patient return pad burns",
                "Separate monopolar handswitch, footswitch, and bipolar ports",
                "Waterproof dual pedal footswitch included",
                "Simultaneous coagulation capability"
            ]
        },
        {
            "name": "Magnus Elite 5-Function Electro-Hydraulic Operating Table",
            "slug": "magnus-elite-5-function-ot-table",
            "brand": "Magnus Surgical",
            "model_number": "ME-5000H",
            "sku": "HS-OT-TB500",
            "category_id": cat_map["operation-theatre"],
            "price": 225000.0,
            "original_price": 290000.0,
            "discount_percent": 22,
            "stock_quantity": 5,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": False,
            "rating": 4.8,
            "reviews_count": 18,
            "warranty": "3 Years Comprehensive Hydraulic & Structure Warranty",
            "lead_time": "Direct Hospital Logistics (3 Days)",
            "short_desc": "C-Arm compatible radiolucent table top with remote control motorized Height, Trendelenburg, Lateral Tilt and Kidney Bridge.",
            "full_desc": "Engineered for versatility across orthopedic, neuro, cardiac, gynecological and urology procedures. Constructed of 304 surgical-grade stainless steel with anti-static memory foam cushions for supreme patient decubitus ulcer prevention.",
            "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Weight Capacity": "250 kg (550 lbs) dynamic clinical load",
                "Table Dimensions": "2050 mm Length x 520 mm Width",
                "Elevation Range": "700 mm to 1000 mm stroke",
                "Trendelenburg / Reverse": "±25 degrees",
                "Lateral Tilt": "±20 degrees left & right",
                "Battery Backup": "Integrated emergency battery backup for 80 cycles"
            },
            "features": [
                "Full length 360-degree C-Arm fluoroscopy radiolucent top",
                "Detachable split leg plates with gas spring adjustment",
                "Central floor locking brake with single pedal activation",
                "Antistatic seamless hygienic mattress"
            ]
        },

        # Diagnostic & Imaging
        {
            "name": "Sonoscape E2 Portable Color Doppler Diagnostic Ultrasound System",
            "slug": "sonoscape-e2-color-doppler-ultrasound",
            "brand": "SonoScape Medical",
            "model_number": "E2-Doppler",
            "sku": "HS-DIAG-SS-E2",
            "category_id": cat_map["diagnostic-imaging"],
            "price": 420000.0,
            "original_price": 540000.0,
            "discount_percent": 22,
            "stock_quantity": 5,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 38,
            "warranty": "2 Years Official Warranty + Convex & Linear Probes",
            "lead_time": "In Stock • Ships in 24 Hours",
            "short_desc": "Full digital color Doppler with 15.6-inch anti-glare monitor, 2 active probe ports, tissue harmonic imaging and DICOM 3.0.",
            "full_desc": "The SonoScape E2 is a lightweight portable powerhouse for abdominal, OB/GYN, small parts, vascular, and MSK imaging. Features Auto IMT, Panoramic imaging, dynamic multi-beam forming, and high-frequency transducer support.",
            "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Display": "15.6 inch Medical Anti-Glare LED with 50-degree tilt",
                "Transducer Ports": "2 Active Swappable Transducer Sockets",
                "Modes": "B, 2B, 4B, M, Color M, CFM, PDI, DirPDI, PW",
                "Storage": "500 GB Internal Solid State Medical Drive",
                "Probes Included": "Broadband Convex Probe 3C-A + High Frequency Linear Probe L741V"
            },
            "features": [
                "Auto IMT (Intima-Media Thickness) for rapid cardiovascular risk assessment",
                "Spatial Compound Imaging and Speckle Reduction Technology (μ-Scan)",
                "DICOM 3.0 worklist ready for hospital PACS integration",
                "Ultra-slim magnesium alloy chassis weighing only 6.5 kg"
            ]
        },
        {
            "name": "BPL Cardiart 9108D 12-Channel Diagnostic ECG Machine",
            "slug": "bpl-cardiart-9108d-12-channel-ecg",
            "brand": "BPL Medical Technologies",
            "model_number": "Cardiart 9108D",
            "sku": "HS-DIAG-BPL9108",
            "category_id": cat_map["diagnostic-imaging"],
            "price": 54500.0,
            "original_price": 68000.0,
            "discount_percent": 19,
            "stock_quantity": 22,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.8,
            "reviews_count": 56,
            "warranty": "2 Years Manufacturer Warranty with Glasgow Algorithm",
            "lead_time": "Ready in Stock • Same Day Dispatch",
            "short_desc": "7-inch color touch display with simultaneous 12-lead acquisition, Glasgow ECG interpretation, and internal thermal A4 printer.",
            "full_desc": "Trusted by cardiologists across the nation. Features world-renowned University of Glasgow ECG interpretation algorithm that takes patient age, gender, and clinical history into account for pinpoint rhythm diagnostic accuracy.",
            "image_url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Channels": "12-Channel Simultaneous Recording & Printout",
                "Screen": "7.0 inch High-Resolution Color Touch Screen",
                "Printer": "Built-in 210mm / 216mm Thermal Paper Roll or Z-fold",
                "Analysis Algorithm": "Glasgow University Diagnostic Interpretation",
                "Memory": "Up to 800 ECG records in internal flash memory",
                "Connectivity": "USB, SD Card, LAN & optional Wi-Fi PDF export"
            },
            "features": [
                "Automatic pacemaker pulse detection and measurement",
                "Freeze and review ECG waveform up to 10 seconds before recording",
                "Direct PDF and XML export to USB pendrive",
                "Alphanumeric QWERTY keyboard for rapid patient entry"
            ]
        },
        {
            "name": "Contec CMS50D Finger Pulse Oximeter (Bulk Hospital Pack of 10)",
            "slug": "contec-cms50d-pulse-oximeter-pack-of-10",
            "brand": "Contec Medical",
            "model_number": "CMS50D-10PK",
            "sku": "HS-DIAG-OX10",
            "category_id": cat_map["diagnostic-imaging"],
            "price": 6200.0,
            "original_price": 9500.0,
            "discount_percent": 34,
            "stock_quantity": 40,
            "is_in_stock": True,
            "is_featured": False,
            "is_trending": True,
            "rating": 4.7,
            "reviews_count": 110,
            "warranty": "1 Year Replacement Warranty",
            "lead_time": "Ready in Stock • Dispatches immediately",
            "short_desc": "Pack of 10 clinical grade dual-color OLED finger pulse oximeters with plethysmograph waveform and SpO2 accuracy ±2%.",
            "full_desc": "Essential diagnostic supply for OPD clinics, emergency triage, nursing stations, and home care. Displays SpO2, PR (Pulse Rate), pulse bar graph, and photoplethysmogram wave with four-directional auto-rotating screen.",
            "image_url": "https://images.unsplash.com/photo-1583912267550-d47d6368d712?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Pack Quantity": "10 Units Individually Boxed with Lanyard & Batteries",
                "SpO2 Range": "0% ~ 100% (Resolution 1%, Accuracy ±2% between 70%-100%)",
                "Pulse Range": "30 bpm ~ 250 bpm",
                "Display": "0.96 inch Dual-Color OLED with 6 display modes",
                "Power": "2x AAA Alkaline Batteries per unit (20+ hrs continuous)"
            },
            "features": [
                "Low perfusion algorithm accurately reads SpO2 under low blood flow",
                "Automatic power shutoff after 5 seconds of finger removal",
                "CE marked and US FDA 510(k) certified"
            ]
        },

        # Hospital Furniture
        {
            "name": "Paramount Medline 5-Function Fully Motorized Electric ICU Bed",
            "slug": "paramount-medline-5-function-electric-icu-bed",
            "brand": "Paramount Medline",
            "model_number": "PM-500E",
            "sku": "HS-FURN-BED5",
            "category_id": cat_map["hospital-furniture"],
            "price": 118000.0,
            "original_price": 165000.0,
            "discount_percent": 28,
            "stock_quantity": 12,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 34,
            "warranty": "3 Years Linak Motors & Frame Warranty",
            "lead_time": "Hospital Logistics (2-3 Business Days)",
            "short_desc": "Equipped with genuine Linak Denmark medical actuators, embedded nurse control panel, CPR quick release, and central locking castors.",
            "full_desc": "Engineered for intensive care units and deluxe cardiac wards. Provides seamless motorized control for Backrest elevation, Knee-rest elevation, Height adjustment (450mm-750mm), Trendelenburg, and Reverse Trendelenburg with single-touch cardiac chair position.",
            "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Actuators": "4x Linak (Denmark) IPX4 Medical Electric Actuators",
                "Safe Working Load": "250 kg (550 lbs)",
                "Overall Dimensions": "2180 mm (L) x 1020 mm (W) x 480-780 mm (H)",
                "Side Rails": "4 Split ABS tuck-away drop down safety side rails with angle indicators",
                "Emergency CPR": "Bilateral mechanical rapid CPR release lever for instant flat positioning",
                "Braking System": "150mm Central locking castors with directional steering"
            },
            "features": [
                "Nurse control panel with supervisor lockout functions for patient safety",
                "One-button Cardiac Chair position and Trendelenburg shock recovery",
                "X-Ray permeable radiolucent backrest with cassette holder tunnel",
                "Anti-microbial epoxy powder coated steel chassis"
            ]
        },
        {
            "name": "Apex Emergency Crash Cart Trolley with Defibrillator Shelf & CPR Board",
            "slug": "apex-emergency-crash-cart-trolley",
            "brand": "Apex Medical Furniture",
            "model_number": "CC-900E",
            "sku": "HS-FURN-CC900",
            "category_id": cat_map["hospital-furniture"],
            "price": 38500.0,
            "original_price": 49000.0,
            "discount_percent": 21,
            "stock_quantity": 15,
            "is_in_stock": True,
            "is_featured": False,
            "is_trending": False,
            "rating": 4.7,
            "reviews_count": 22,
            "warranty": "2 Years Construction Warranty",
            "lead_time": "In Stock • Ships in 24 Hours",
            "short_desc": "5-drawer modular ABS resuscitation trolley complete with 360-degree rotating defibrillator shelf, IV pole, oxygen tank holder, and central security lock.",
            "full_desc": "Organizes life-saving emergency medications, intubation kits, and resuscitation instruments in high-stress trauma situations. Equipped with smooth ball-bearing drawers and color-coded dividers.",
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Material": "High-density ABS top board with raised rims + Aluminum alloy uprights",
                "Drawers": "2 Small, 2 Medium, 1 Large deep drawer with internal dividers",
                "Accessories": "Defibrillator shelf, Cardiac CPR Board, Telescopic IV pole, Waste bins",
                "Castors": "4x 100mm noiseless medical castors with 2 cross-wheel brakes",
                "Locking": "Disposable breakaway numbered seal lock + Key central lock"
            },
            "features": [
                "Pull-out auxiliary writing tablet for physician notes",
                "Transparent soft glass mat on work surface for easy decontamination",
                "Oxygen cylinder bracket at the rear with security belt",
                "Impact-resistant wrap-around bumper protection"
            ]
        },

        # Respiratory & Home Care
        {
            "name": "Philips Respironics EverFlo 5 Litre Medical Oxygen Concentrator",
            "slug": "philips-respironics-everflo-5l-oxygen-concentrator",
            "brand": "Philips Healthcare",
            "model_number": "EverFlo-1020014",
            "sku": "HS-RESP-PH5L",
            "category_id": cat_map["respiratory-care"],
            "price": 54000.0,
            "original_price": 68000.0,
            "discount_percent": 20,
            "stock_quantity": 25,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 92,
            "warranty": "3 Years On-Site Philips India Warranty",
            "lead_time": "Ready in Stock • Same Day Dispatch",
            "short_desc": "Ultra-quiet (43 dBA), lightweight 14 kg 5-litre continuous flow oxygen concentrator with integrated OPI (Oxygen Percentage Indicator).",
            "full_desc": "The most celebrated oxygen concentrator in medical history. The Philips EverFlo delivers up to 5 LPM continuous medical-grade oxygen purity (93% ± 3%) with lower power consumption and minimal heat generation. Designed for 24x7 heavy-duty home and hospital clinic use.",
            "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Flow Rate": "0.5 to 5 Litres Per Minute continuous adjustable",
                "Oxygen Concentration": "93% ± 3% at all flow levels",
                "Sound Level": "43 dBA (whisper quiet)",
                "Weight": "14 kg (compact ergonomic recessed handle design)",
                "Power Consumption": "< 300 Watts",
                "Alarms": "Low Oxygen Purity (<82%), Low Flow, Power Failure, High Pressure"
            },
            "features": [
                "Maintenance-free Thomas dual-cylinder compressor",
                "Recessed flow meter protected against accidental impact",
                "Metal cannula connection durable against frequent tube changing",
                "Energy efficient design saves up to 35% electricity"
            ]
        },
        {
            "name": "ResMed AirSense 10 AutoSet Automatic CPAP Machine with HumidAir",
            "slug": "resmed-airsense-10-autoset-cpap-machine",
            "brand": "ResMed",
            "model_number": "AirSense-10-Auto",
            "sku": "HS-RESP-RM10",
            "category_id": cat_map["respiratory-care"],
            "price": 62500.0,
            "original_price": 78000.0,
            "discount_percent": 19,
            "stock_quantity": 14,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": False,
            "rating": 4.9,
            "reviews_count": 64,
            "warranty": "3 Years ResMed India Replacement Warranty",
            "lead_time": "In Stock • Ships in 24 Hours",
            "short_desc": "Premier auto-adjusting sleep apnea therapy device with integrated HumidAir heated humidifier, ClimateLineAir heated tubing & AutoRamp.",
            "full_desc": "The global gold-standard in Obstructive Sleep Apnea (OSA) management. AirSense 10 AutoSet continuously modulates pressure breath-by-breath to match changing patient requirements, preventing airway collapse with unmatched silent comfort.",
            "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Pressure Range": "4 to 20 cm H2O auto-titrating",
                "Sound Level": "26.6 dBA (virtually inaudible)",
                "Humidification": "Integrated HumidAir Heated Humidifier with Climate Control",
                "Data Connectivity": "Built-in Wireless cellular modem + SD card cloud telemetry",
                "Ramp Mode": "AutoRamp with sleep onset detection"
            },
            "features": [
                "EPR (Expiratory Pressure Relief) lowers pressure upon exhalation",
                "SmartStart starts therapy automatically as soon as patient breathes into mask",
                "Ambient light sensor dims screen brightness automatically in dark bedroom",
                "Includes ClimateLineAir heated tube and deluxe carry case"
            ]
        },

        # Emergency & Defibrillators
        {
            "name": "Mindray BeneHeart D3 Biphasic Manual Defibrillator & Monitor",
            "slug": "mindray-beneheart-d3-biphasic-defibrillator",
            "brand": "Mindray Healthcare",
            "model_number": "BeneHeart D3",
            "sku": "HS-EMRG-MD-D3",
            "category_id": cat_map["emergency-defibrillators"],
            "price": 245000.0,
            "original_price": 310000.0,
            "discount_percent": 21,
            "stock_quantity": 8,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 5.0,
            "reviews_count": 28,
            "warranty": "2 Years Mindray Authorized AMC & Warranty",
            "lead_time": "Priority Dispatch • Ready in Stock",
            "short_desc": "4-in-1 integrated clinical life-saver: Manual Defibrillation, Automated AED, Non-invasive Pacing, and Multi-parameter Monitoring with 7-inch TFT.",
            "full_desc": "BeneHeart D3 is designed for rapid resuscitation in crash situations. Charges to 200 Joules in under 3 seconds, delivering 360J biphasic truncated exponential (BTE) waveform shock for maximum cardioversion success.",
            "image_url": "https://images.unsplash.com/photo-1583912267550-d47d6368d712?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Defibrillation Energy": "1J to 360 Joules biphasic truncated exponential (BTE)",
                "Charge Time": "Less than 3 seconds to 200J, less than 5 seconds to 360J",
                "Display": "7.0 inch color TFT display with 3 waveforms",
                "Operating Modes": "Manual Defibrillator, AED, Demand / Fixed Pacer, Monitor",
                "Monitoring Parameters": "3/5 Lead ECG, Resp, Mindray SpO2, NIBP",
                "Battery Capacity": "Up to 100 shocks at 360J or 4.5 hours continuous monitoring"
            },
            "features": [
                "Universal external adult/pediatric switchable paddle set included",
                "Built-in 50mm thermal paper recorder for shock verification printouts",
                "Rugged IP44 water and dust resistance, passes 0.75m drop test",
                "Daily and weekly automatic self-test reports"
            ]
        },
        {
            "name": "Philips HeartStart FRx Public Access & Clinical AED Defibrillator",
            "slug": "philips-heartstart-frx-aed-defibrillator",
            "brand": "Philips Healthcare",
            "model_number": "FRx-861304",
            "sku": "HS-EMRG-PH-FRX",
            "category_id": cat_map["emergency-defibrillators"],
            "price": 125000.0,
            "original_price": 155000.0,
            "discount_percent": 19,
            "stock_quantity": 11,
            "is_in_stock": True,
            "is_featured": False,
            "is_trending": True,
            "rating": 4.9,
            "reviews_count": 39,
            "warranty": "8 Years Philips Global AED Manufacturer Warranty",
            "lead_time": "Ready in Stock • Ships in 24 Hours",
            "short_desc": "Ultra-rugged IP55 all-weather AED with SMART Biphasic therapy, CPR voice coaching, and Infant/Child smart key.",
            "full_desc": "Built for demanding hospital wards, ambulances, airports, corporate headquarters and sports arenas. Withstands drops of up to 1 meter onto concrete and jetting water. SMART Biphasic technology tailors therapy to each individual patient's chest impedance.",
            "image_url": "https://images.unsplash.com/photo-1583912267550-d47d6368d712?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Therapy Waveform": "SMART Biphasic truncated exponential (150J nominal)",
                "CPR Coaching": "Step-by-step audible voice guidance with CPR metronome cadence",
                "Water/Dust Ingress": "IP55 rating (highest in class)",
                "Drop Tolerance": "1 meter drop onto concrete",
                "Battery Shelf Life": "4 Years standby installed life with 200+ shocks capacity"
            },
            "features": [
                "Optional Infant/Child key converts pads to pediatric mode without buying separate pediatric pads",
                "Daily automated self-tests check pads readiness, circuitry, and battery",
                "Flashing green Ready indicator gives instant visual peace of mind",
                "Quick Shock technology delivers shock in less than 8 seconds after CPR pauses"
            ]
        },

        # Infusion & Syringe Pumps
        {
            "name": "BPL Acura S Pro Micro-Step Dual Channel Syringe Infusion Pump",
            "slug": "bpl-acura-s-pro-syringe-pump",
            "brand": "BPL Medical Technologies",
            "model_number": "Acura S Pro",
            "sku": "HS-PUMP-BPL-SP",
            "category_id": cat_map["infusion-syringe-pumps"],
            "price": 28500.0,
            "original_price": 36000.0,
            "discount_percent": 20,
            "stock_quantity": 30,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": True,
            "rating": 4.8,
            "reviews_count": 47,
            "warranty": "2 Years Comprehensive BPL Warranty",
            "lead_time": "Ready in Stock • Same Day Dispatch",
            "short_desc": "High precision stepper motor compatible with 5ml, 10ml, 20ml, 30ml, 50/60ml syringes with anti-bolus system & comprehensive drug library.",
            "full_desc": "Engineered for critical neonatal, pediatric, and adult medication deliveries where precision dosing is imperative (vasopressors, inotropes, anesthesia). Automatic recognition of major syringe brands with ±2% flow rate mechanical accuracy.",
            "image_url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Syringe Sizes": "5ml, 10ml, 20ml, 30ml, 50/60ml all standard medical brands",
                "Flow Rate Range": "0.1 to 1500 ml/h (in 0.01 ml/h micro increments)",
                "Infusion Accuracy": "Mechanical accuracy ≤ ±2%",
                "Bolus Rate": "100 to 1500 ml/h manual and programmable",
                "KVO Rate": "0.1 to 5.0 ml/h adjustable",
                "Battery Backup": "Rechargeable Li-ion, up to 6 hours at 5 ml/h"
            },
            "features": [
                "Anti-bolus technology drastically reduces unintended bolus after occlusion release",
                "Color LCD display with real-time pressure bar indicator",
                "Stackable interlocking design allows mounting multiple pumps on one IV pole",
                "Dual CPU redundancy for fail-safe clinical safety"
            ]
        },
        {
            "name": "Fresenius Kabi Volumat MC Agilia Volumetric Infusion Pump",
            "slug": "fresenius-kabi-volumat-mc-agilia-infusion-pump",
            "brand": "Fresenius Kabi",
            "model_number": "Agilia-VP-MC",
            "sku": "HS-PUMP-FK-AG",
            "category_id": cat_map["infusion-syringe-pumps"],
            "price": 39500.0,
            "original_price": 49000.0,
            "discount_percent": 19,
            "stock_quantity": 20,
            "is_in_stock": True,
            "is_featured": False,
            "is_trending": False,
            "rating": 4.9,
            "reviews_count": 31,
            "warranty": "2 Years Official Warranty",
            "lead_time": "In Stock • Ships in 24h",
            "short_desc": "Advanced volumetric IV infusion pump with DoseGuard dose error reduction system, ultrasonic air bubble sensor and drop counter.",
            "full_desc": "The benchmark for large-volume intravenous fluid, antibiotic, and nutritional therapy. Provides broad flow rates from 0.1 to 1200 ml/h with ultrasonic air detection and multiple occlusion alarm levels.",
            "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Flow Rate": "0.1 to 1200 ml/h (0.1 ml/h increments)",
                "Volume to be Infused": "0.1 to 9999 ml",
                "Occlusion Pressure": "3 selectable levels from 100 to 900 mmHg",
                "Air-in-line Sensor": "Ultrasonic detection sensitive to 50 microliters",
                "Battery Run Time": "Minimum 8 hours at 125 ml/h"
            },
            "features": [
                "Integrated pole clamp for horizontal or vertical IV stands",
                "DoseGuard drug error reduction prevents accidental medication overdoses",
                "Flow rate titration during infusion without stopping pump"
            ]
        },

        # Laboratory & Sterilization
        {
            "name": "Tuttnauer 2540M Manual Tabletop Hospital Autoclave Sterilizer (23 Litre)",
            "slug": "tuttnauer-2540m-tabletop-autoclave-23l",
            "brand": "Tuttnauer",
            "model_number": "2540M",
            "sku": "HS-LAB-TUT23",
            "category_id": cat_map["laboratory-sterilization"],
            "price": 185000.0,
            "original_price": 235000.0,
            "discount_percent": 21,
            "stock_quantity": 7,
            "is_in_stock": True,
            "is_featured": True,
            "is_trending": False,
            "rating": 4.9,
            "reviews_count": 19,
            "warranty": "2 Years Tuttnauer Global Warranty & 10 Years Chamber Warranty",
            "lead_time": "Hospital Logistics (2-3 Days)",
            "short_desc": "Heavy-duty 316L stainless steel sterilization chamber (23L capacity) with dual safety locking door and drying cycle.",
            "full_desc": "Designed to sterilize wrapped and unwrapped surgical instruments, hollowware, glassware, and packs in private clinics, dental practices, and hospital OT scrub rooms. Operates between 121°C and 134°C with automatic shut-off safety.",
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            "additional_images": [],
            "specifications": {
                "Chamber Dimensions": "254 mm (10\") Diameter x 475 mm (19\") Depth",
                "Chamber Volume": "23 Litres (6 Gallons)",
                "Material": "Electro-polished 316L Surgical Grade Stainless Steel",
                "Trays Included": "4 Heavy Gauge Stainless Steel Instrument Trays",
                "Sterilization Temperature": "121°C (250°F) or 134°C (273°F) adjustable",
                "Cycle Time": "Unwrapped cold: 30 min | Warm: 20 min"
            },
            "features": [
                "Double safety locking device prevents door opening under internal pressure",
                "Drain valve located conveniently on front panel for rapid water drainage",
                "Overheat safety cutoff thermostat and pressure relief valve",
                "UL, CE, and ASME certified pressure vessel"
            ]
        }
    ]

    for p in products_data:
        add_imgs = p.pop("additional_images", [])
        specs = p.pop("specifications", {})
        feats = p.pop("features", [])

        prod_obj = Product(**p)
        prod_obj.additional_images = add_imgs
        prod_obj.specifications = specs
        prod_obj.features = feats
        db.add(prod_obj)
        db.flush()

    # 3. Sample Orders
    sample_orders = [
        {
            "order_number": "HS-2026-8941",
            "customer_name": "Dr. Rajesh Sharma, MD",
            "customer_email": "dr.sharma@apollohealth.org",
            "customer_phone": "+91 98210 44892",
            "hospital_clinic_name": "Apollo Multispeciality Clinic",
            "shipping_address": "Suite 402, Medical Enclave, Sector 14",
            "city": "Gurugram",
            "state": "Haryana",
            "postal_code": "122001",
            "country": "India",
            "gstin": "07AAAAA0000A1Z5",
            "subtotal": 123000.0,
            "tax_amount": 14760.0, # 12% GST
            "shipping_fee": 0.0, # Free shipping over 5k
            "discount_amount": 5000.0,
            "total_amount": 132760.0,
            "order_status": "Dispatched",
            "payment_status": "Paid",
            "payment_method": "Credit Card (Visa Platinum)",
            "tracking_courier": "BlueDart Health Express",
            "tracking_number": "BD-MED-99482102",
            "notes": "Urgent delivery requested for new OPD wing opening.",
            "items": [
                {
                    "product_name": "Mindray uMEC 12 High-Precision Multi-Parameter Patient Monitor",
                    "product_image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80",
                    "unit_price": 68500.0,
                    "quantity": 1,
                    "total_price": 68500.0
                },
                {
                    "product_name": "BPL Cardiart 9108D 12-Channel Diagnostic ECG Machine",
                    "product_image": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",
                    "unit_price": 54500.0,
                    "quantity": 1,
                    "total_price": 54500.0
                }
            ]
        },
        {
            "order_number": "HS-2026-7822",
            "customer_name": "Kavita Singhania (Procurement Head)",
            "customer_email": "kavita.singhania@fortiscare.in",
            "customer_phone": "+91 99100 23481",
            "hospital_clinic_name": "Fortis Escorts Heart Institute",
            "shipping_address": "Okhla Road, New Friends Colony",
            "city": "New Delhi",
            "state": "Delhi",
            "postal_code": "110025",
            "country": "India",
            "gstin": "07AAACF2341M1Z2",
            "subtotal": 118000.0,
            "tax_amount": 14160.0,
            "shipping_fee": 0.0,
            "discount_amount": 0.0,
            "total_amount": 132160.0,
            "order_status": "Processing",
            "payment_status": "Paid",
            "payment_method": "Hospital PO / RTGS Transfer",
            "tracking_courier": "Gati KWE Medical Freight",
            "tracking_number": "GT-DEL-441092",
            "notes": "Installation demo required by biomedical engineering team on arrival.",
            "items": [
                {
                    "product_name": "Paramount Medline 5-Function Fully Motorized Electric ICU Bed",
                    "product_image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80",
                    "unit_price": 118000.0,
                    "quantity": 1,
                    "total_price": 118000.0
                }
            ]
        },
        {
            "order_number": "HS-2026-9014",
            "customer_name": "Dr. Aniruddh Roy",
            "customer_email": "roy.aniruddh@gmail.com",
            "customer_phone": "+91 98301 98822",
            "hospital_clinic_name": "Roy Pulmonary & Sleep Center",
            "shipping_address": "Park Street, 3rd Floor",
            "city": "Kolkata",
            "state": "West Bengal",
            "postal_code": "700016",
            "country": "India",
            "gstin": "",
            "subtotal": 116500.0,
            "tax_amount": 13980.0,
            "shipping_fee": 0.0,
            "discount_amount": 2500.0,
            "total_amount": 127980.0,
            "order_status": "Delivered",
            "payment_status": "Paid",
            "payment_method": "UPI / Instant QR",
            "tracking_courier": "BlueDart Express",
            "tracking_number": "BD-CCU-887192",
            "notes": "Delivered and verified in pristine condition.",
            "items": [
                {
                    "product_name": "Philips Respironics EverFlo 5 Litre Medical Oxygen Concentrator",
                    "product_image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
                    "unit_price": 54000.0,
                    "quantity": 1,
                    "total_price": 54000.0
                },
                {
                    "product_name": "ResMed AirSense 10 AutoSet Automatic CPAP Machine with HumidAir",
                    "product_image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
                    "unit_price": 62500.0,
                    "quantity": 1,
                    "total_price": 62500.0
                }
            ]
        }
    ]

    for ord_info in sample_orders:
        items_data = ord_info.pop("items", [])
        order_obj = Order(**ord_info)
        db.add(order_obj)
        db.flush()

        for item in items_data:
            item_obj = OrderItem(order_id=order_obj.id, **item)
            db.add(item_obj)

    # 4. Sample Quote Requests (RFQ)
    sample_quotes = [
        {
            "product_name": "Dräger Savina 300 Classic Turbine-Driven ICU Ventilator",
            "customer_name": "Dr. Prateek Mehta",
            "email": "p.mehta@cityhospital.com",
            "phone": "+91 98112 34567",
            "hospital_name": "City Life Hospital (150-Bed ICU Expansion)",
            "city": "Mumbai",
            "quantity": 4,
            "target_timeline": "Within 15 days",
            "message": "We need complete turnkey quotation for 4 units of Dräger Savina 300 ventilators with pediatric kit, humidifier and 3-year AMC.",
            "status": "Quotation Sent"
        },
        {
            "product_name": "Sonoscape E2 Portable Color Doppler Diagnostic Ultrasound System",
            "customer_name": "Dr. Meenakshi Sundaram",
            "email": "dr.meenakshi@sundaramscan.in",
            "phone": "+91 94440 12890",
            "hospital_name": "Sundaram Diagnostic & Imaging Center",
            "city": "Chennai",
            "quantity": 2,
            "target_timeline": "Immediate (within 7 days)",
            "message": "Looking for price breakdown including convex probe, linear probe, transvaginal probe and thermal video printer.",
            "status": "Contacted"
        },
        {
            "product_name": "Meditech Luxura 700/500 Twin Arm LED OT Surgical Shadowless Light",
            "customer_name": "Vikram Sethi (Director)",
            "email": "procurement@aarogyahospital.org",
            "phone": "+91 98765 43210",
            "hospital_name": "Aarogya Super Specialty Hospital",
            "city": "Bengaluru",
            "quantity": 3,
            "target_timeline": "Within 30 days",
            "message": "We are setting up 3 new modular operation theatres. Kindly share formal institutional quotation with ceiling height mounting specifications.",
            "status": "New"
        }
    ]

    for q in sample_quotes:
        db.add(QuoteRequest(**q))

    # 5. Customer Inquiries
    sample_inquiries = [
        {
            "name": "Dr. Arshad Warsi",
            "email": "arshad.w@lifecare.co.in",
            "phone": "+91 98200 12345",
            "subject": "Bulk purchase inquiry for 25 Semi-Fowler Beds",
            "department": "Biomedical Sales",
            "message": "Hello, we are expanding our secondary care facility and require 25 semi-fowler hospital beds with mattresses. Can you provide wholesale institutional tier discount?",
            "status": "Pending"
        },
        {
            "name": "Sunita Patil (Bio-Medical Engineer)",
            "email": "patil.sunita@rubyhall.com",
            "phone": "+91 98900 98765",
            "subject": "AMC support for Mindray Patient Monitors",
            "department": "Service & Maintenance",
            "message": "Do you provide annual maintenance contracts (AMC/CMC) and OEM calibration certificates for existing Mindray monitors in Pune?",
            "status": "Responded"
        }
    ]

    for inq in sample_inquiries:
        db.add(CustomerInquiry(**inq))

    # 6. Settings
    settings_data = [
        {"key": "store_name", "value": "Hospital Store - Medical Equipment & Supplies Superstore", "description": "Official store brand name"},
        {"key": "support_phone", "value": "+91 8000 467 786 / 011 4987 6543", "description": "Customer care & Toll-free helpline"},
        {"key": "support_email", "value": "support@hospitalstore.com", "description": "Primary support email"},
        {"key": "whatsapp_number", "value": "+919811234567", "description": "WhatsApp Instant Quote Chat"},
        {"key": "gstin", "value": "07AAECH7890M1Z8", "description": "Company GSTIN for B2B billing"},
        {"key": "tax_rate", "value": "12", "description": "Medical equipment GST percentage"},
        {"key": "free_shipping_threshold", "value": "5000", "description": "Free shipping order threshold"},
        {"key": "announcement_banner", "value": "🌟 Pan-India Hospital Supply & Doorstep Delivery | 100% Genuine Certified Medical Equipment | Official GST Invoice with Input Credit", "description": "Top announcement ticker"},
        {"key": "address", "value": "Plot 42, Okhla Industrial Area, Phase III, New Delhi, 110020, India", "description": "Corporate headquarters"}
    ]

    for s in settings_data:
        db.add(Setting(**s))

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()

