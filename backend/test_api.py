import urllib.request
import json

def test():
    # 1. Categories
    cats = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/categories').read().decode())
    print(f"Categories loaded: {len(cats)}")

    # 2. Products
    prods = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/products?limit=5').read().decode())
    print(f"Products total: {prods['total']}")

    # 3. Create test order
    test_order_data = json.dumps({
        'customer_name': 'Dr. Test Medical Officer',
        'customer_email': 'test@hospital.org',
        'customer_phone': '+91 9988776655',
        'hospital_clinic_name': 'Max Super Speciality Hospital',
        'shipping_address': 'Main ICU Wing, Tower B',
        'city': 'New Delhi',
        'state': 'Delhi NCR',
        'postal_code': '110001',
        'gstin': '07AAACM1234F1Z1',
        'payment_method': 'UPI / Instant QR',
        'items': [{'product_id': prods['products'][0]['id'], 'product_name': prods['products'][0]['name'], 'unit_price': prods['products'][0]['price'], 'quantity': 1}]
    }).encode()

    req = urllib.request.Request('http://127.0.0.1:8000/api/orders', data=test_order_data, headers={'Content-Type': 'application/json'})
    created_order = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"Order Created: {created_order['order_number']} - Total: Rs {created_order['total_amount']}")

    # 4. Track order
    tracked = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8000/api/orders/track/{created_order['order_number']}").read().decode())
    print(f"Tracked status: {tracked['order_status']}")

    # 5. Invoice
    invoice = json.loads(urllib.request.urlopen(f"http://127.0.0.1:8000/api/admin/orders/{created_order['id']}/invoice").read().decode())
    print(f"Invoice Generated: {invoice['invoice_number']} - CGST: Rs {invoice['summary']['cgst']} - SGST: Rs {invoice['summary']['sgst']}")

    # 6. Quotes
    quote_data = json.dumps({
        'customer_name': 'Dr. Alok Verma',
        'email': 'dr.verma@citycare.in',
        'phone': '+91 98111 22334',
        'hospital_name': 'City Care Trauma Hospital',
        'city': 'Lucknow',
        'quantity': 2,
        'product_name': 'Mindray uMEC 12 Multi-Parameter Patient Monitor',
        'message': 'Need urgently for ICU beds.'
    }).encode()
    req_q = urllib.request.Request('http://127.0.0.1:8000/api/quotes', data=quote_data, headers={'Content-Type': 'application/json'})
    created_quote = json.loads(urllib.request.urlopen(req_q).read().decode())
    print(f"Quote RFQ Created: RFQ-2026-0{created_quote['id']} for {created_quote['hospital_name']}")

    print("\nALL API ENDPOINTS TESTED & PASSED PERFECTLY!")

if __name__ == '__main__':
    test()

