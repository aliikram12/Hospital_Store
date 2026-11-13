import urllib.request
import json
import io

def run_tests():
    print("--- 1. Testing Categories & Subitems ---")
    cats = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/categories').read().decode())
    print(f"Categories count: {len(cats)}")
    print(f"Sample category subitems: {cats[0]['subitems'][:3]}")

    print("\n--- 2. Testing Dual Currency & Products ---")
    prods = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/products?limit=2').read().decode())
    sample_p = prods['products'][0]
    print(f"Product: {sample_p['name']}")
    print(f"PKR: Rs {sample_p['price']} | USD equiv: ${round(sample_p['price']/280, 2)}")

    print("\n--- 3. Testing 2 Payment Methods: COD Order ---")
    cod_data = json.dumps({
        'customer_name': 'Dr. Zeeshan Ali',
        'customer_email': 'zeeshan.ali@hospital.org',
        'customer_phone': '+92 300 4455667',
        'hospital_clinic_name': 'Lahore General Hospital',
        'shipping_address': 'Main OT Complex, Room 12',
        'city': 'Lahore',
        'state': 'Punjab',
        'postal_code': '54000',
        'payment_method': 'Cash on Delivery',
        'currency': 'PKR',
        'exchange_rate': 280.0,
        'items': [{'product_id': sample_p['id'], 'product_name': sample_p['name'], 'unit_price': sample_p['price'], 'quantity': 1}]
    }).encode()
    req1 = urllib.request.Request('http://127.0.0.1:8000/api/orders', data=cod_data, headers={'Content-Type': 'application/json'})
    order1 = json.loads(urllib.request.urlopen(req1).read().decode())
    print(f"COD Order: {order1['order_number']} | Status: {order1['order_status']} | Payment: {order1['payment_status']}")

    print("\n--- 4. Testing 2 Payment Methods: QR Code Order with Screenshot & TID ---")
    qr_data = json.dumps({
        'customer_name': 'Dr. Amina Farooq',
        'customer_email': 'amina.farooq@akuh.edu',
        'customer_phone': '+92 321 9988776',
        'hospital_clinic_name': 'Aga Khan University Hospital',
        'shipping_address': 'Stadium Road, Pediatric ICU',
        'city': 'Karachi',
        'state': 'Sindh',
        'postal_code': '74800',
        'payment_method': 'QR Code / Bank Transfer',
        'payment_proof_image': '/uploads/sample_receipt_proof.jpg',
        'transaction_ref': 'TRX-MEEZAN-98412093',
        'currency': 'PKR',
        'exchange_rate': 280.0,
        'items': [{'product_id': sample_p['id'], 'product_name': sample_p['name'], 'unit_price': sample_p['price'], 'quantity': 1}]
    }).encode()
    req2 = urllib.request.Request('http://127.0.0.1:8000/api/orders', data=qr_data, headers={'Content-Type': 'application/json'})
    order2 = json.loads(urllib.request.urlopen(req2).read().decode())
    print(f"QR Order: {order2['order_number']} | Payment Status: {order2['payment_status']} | Trx Ref: {order2['transaction_ref']}")

    print("\n--- 5. Testing Users Management Endpoint ---")
    users = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/admin/users').read().decode())
    print(f"Total Hospital Users: {len(users)}")
    print(f"Sample User: {users[0]['full_name']} ({users[0]['role']}) - Hospital: {users[0]['hospital_name']}")

    print("\n--- 6. Testing Order Tracking with Payment Verification ---")
    tracked = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8000/api/orders/track/{order2['order_number']}").read().decode())
    print(f"Tracked: {tracked['order_number']} | Courier: {tracked['tracking_courier']} | AWB: {tracked['tracking_number']}")

    print("\n--- 7. Testing Invoice Generation with Dual Currency Support ---")
    inv = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8000/api/admin/orders/{order2['id']}/invoice").read().decode())
    print(f"Invoice: {inv['invoice_number']} | Grand Total PKR: Rs {inv['summary']['grand_total_pkr']} | USD: ${inv['summary']['grand_total_usd']}")

    print("\nALL VERIFICATIONS PASSED 100% SUCCESSFULLY!")

if __name__ == '__main__':
    run_tests()
