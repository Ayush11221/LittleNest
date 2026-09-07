# Cloud E-Commerce College Project — AI Project Context

## 1. Project Overview

We are building a college-level **Cloud E-Commerce Website** that must be submitted soon.

The goal is to create a functional, polished e-commerce application while clearly demonstrating the use of **cloud services and AWS**.

The project should be practical and demo-friendly rather than unnecessarily complex.

### Main goals

- Build a modern e-commerce frontend.
- Store product, customer, order, and billing data in a cloud database.
- Store product images and generated invoice PDFs using AWS S3.
- Use AWS Lambda for invoice generation / server-side processing.
- Use AWS API Gateway to expose Lambda APIs.
- Implement authentication.
- Implement cart and checkout.
- Implement billing and order management.
- Provide an admin dashboard.
- Keep the architecture simple enough to complete and explain in a college viva.

---

# 2. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

Potential libraries can be added only when actually needed.

## Backend / Database

We will use **Supabase**.

Supabase responsibilities:

- PostgreSQL database
- Authentication
- Product data
- Customer data
- Orders
- Order items
- Payment/order status
- Other application data

## AWS

We will use AWS for cloud-specific functionality:

### AWS S3

Used for:

- Product images
- Invoice PDF files

Suggested structure:

```text
ecommerce-project-bucket/
├── products/
│   ├── product-1.jpg
│   ├── product-2.jpg
│   └── ...
│
└── invoices/
    ├── INV-1001.pdf
    ├── INV-1002.pdf
    └── ...
```

### AWS Lambda

Used for:

- Invoice generation
- Server-side order/invoice processing where appropriate

### AWS API Gateway

Used to expose Lambda endpoints.

Example:

```text
POST /api/order
POST /api/invoice
GET  /api/orders/:id
```

---

# 3. High-Level Architecture

```text
                         CUSTOMER
                            |
                            v
                 +----------------------+
                 |   React + Vite       |
                 |   Tailwind CSS       |
                 +----------+-----------+
                            |
                 +----------+-----------+
                 |                      |
                 v                      v
        +----------------+      +----------------+
        |    Supabase    |      |  AWS API       |
        |                |      |  Gateway       |
        | PostgreSQL     |      +-------+--------+
        | Authentication|              |
        +-------+--------+              v
                |                +-------------+
                |                | AWS Lambda  |
                |                |             |
                |                | Invoice     |
                |                | Processing  |
                |                +------+------+
                |                       |
                |                       v
                |                +-------------+
                |                |   AWS S3    |
                |                |             |
                |                | Product     |
                |                | Images      |
                |                |             |
                |                | Invoice PDF |
                |                +-------------+
                |
                v
        Product / Order Data
```

---

# 4. User Roles

There are two main roles.

## Customer

A customer can:

1. Register
2. Login
3. Browse products
4. Search products
5. Filter products
6. View product details
7. Add products to cart
8. Change quantities
9. Remove products
10. Checkout
11. Enter billing/shipping information
12. Select a payment method
13. Place an order
14. View order confirmation
15. View previous orders
16. View/download invoice

## Admin

An admin can:

1. Login
2. View dashboard
3. View products
4. Add products
5. Edit products
6. Delete products
7. Upload product images
8. View orders
9. Update order status
10. View customers
11. View basic sales information

---

# 5. Customer Flow

The main customer flow is:

```text
Home
  |
  v
Products
  |
  v
Product Details
  |
  v
Add to Cart
  |
  v
Cart
  |
  v
Checkout
  |
  v
Billing Calculation
  |
  v
Payment Selection
  |
  v
Place Order
  |
  v
Order Created
  |
  v
Invoice Generated
  |
  v
Invoice Stored in S3
  |
  v
Order Success
```

---

# 6. Payment Approach

Because this is a college project with a short deadline, we should initially use a **simulated/demo payment flow** rather than spending the entire project implementing a real payment gateway.

Example:

```text
Payment Method

○ UPI
○ Credit/Debit Card
○ Cash on Delivery

        [ Place Order ]
```

For a successful demo:

```text
Payment Processing...
        |
        v
Payment Successful
        |
        v
Order Created
        |
        v
Invoice Generated
```

The UI should make it clear that this is a demo/simulated payment unless a real payment gateway is explicitly added later.

---

# 7. Database Design

We will use PostgreSQL through Supabase.

Initial tables:

```text
users
products
categories
orders
order_items
payments
```

---

# 8. Users Table

Conceptually:

```text
users
-------------------------
id
name
email
role
created_at
```

Possible roles:

```text
customer
admin
```

Authentication should be handled using Supabase Auth.

Do not store plaintext passwords in our own table.

---

# 9. Products Table

```text
products
-------------------------
id
name
description
price
category_id
image_url
stock
rating
created_at
updated_at
```

Example:

```text
id: 101
name: Wireless Headphones
description: Noise cancelling wireless headphones
price: 2999
category_id: 1
image_url: <S3 image URL>
stock: 25
```

Important:

- Product metadata lives in Supabase PostgreSQL.
- Actual product image files live in AWS S3.
- The database stores the image URL/path.

---

# 10. Categories Table

```text
categories
-------------------------
id
name
description
created_at
```

Examples:

```text
Electronics
Fashion
Home
Books
Accessories
```

The exact categories can be changed later.

---

# 11. Orders Table

```text
orders
-------------------------
id
user_id
subtotal
discount
tax
shipping
total_amount
payment_status
order_status
shipping_name
shipping_email
shipping_phone
shipping_address
created_at
updated_at
```

Example:

```text
Order ID: ORD-1001

Subtotal:       ₹4,500
Discount:       ₹500
Tax:            ₹720
Shipping:       ₹50
---------------------
Total:          ₹4,770

Payment:        Paid
Order Status:   Processing
```

---

# 12. Order Items Table

```text
order_items
-------------------------
id
order_id
product_id
quantity
price
subtotal
```

Important:

The `price` should be saved at the time of purchase.

This means that if a product later changes from ₹999 to ₹1,199, an old order still shows the original purchased price.

Example:

```text
Order #1001

Wireless Mouse     ₹999 × 1
Keyboard           ₹1,499 × 1
Headphones         ₹2,999 × 1
```

---

# 13. Payments Table

```text
payments
-------------------------
id
order_id
payment_method
transaction_id
amount
status
created_at
```

For the initial demo, payment status can be:

```text
pending
paid
failed
```

Payment methods:

```text
UPI
CARD
COD
```

If a real payment gateway is added later, this table can store the real transaction/reference ID.

---

# 14. Invoice System

The invoice is generated after an order is successfully created.

Expected flow:

```text
React
  |
  | Place Order
  v
Supabase
  |
  | Create Order
  v
AWS API Gateway
  |
  v
AWS Lambda
  |
  | Generate Invoice PDF
  v
AWS S3
  |
  | Store invoice
  v
Return invoice URL
  |
  v
React
  |
  v
Download/View Invoice
```

Example invoice:

```text
-------------------------------------
             MY STORE
-------------------------------------

Invoice: INV-20260907-001
Order ID: ORD-1001

Customer:
Customer Name
customer@email.com

-------------------------------------
Product          Qty       Amount
-------------------------------------
Keyboard          1        ₹1,499
Mouse             2        ₹1,998
-------------------------------------

Subtotal                   ₹3,497
Tax                        ₹629
Shipping                   ₹50
-------------------------------------
TOTAL                      ₹4,176

Payment Status: PAID

-------------------------------------
        Thank you for shopping!
-------------------------------------
```

Invoice PDFs should be stored in:

```text
S3/invoices/
```

---

# 15. AWS S3 Product Image Flow

Admin uploads a product:

```text
Admin Dashboard
      |
      v
Select Product Image
      |
      v
Upload to AWS S3
      |
      v
Get S3 URL/path
      |
      v
Save product data in Supabase
```

Database:

```text
image_url = "S3 object URL/path"
```

The frontend then loads the image from S3.

---

# 16. Frontend Pages

The application should eventually contain:

```text
/
├── Home
├── Products
├── Product Details
├── Cart
├── Checkout
├── Order Success
├── Login
├── Register
├── My Orders
├── Order Details
├── Invoice
│
└── Admin
    ├── Dashboard
    ├── Products
    ├── Add Product
    ├── Edit Product
    ├── Orders
    └── Customers
```

---

# 17. Recommended React Folder Structure

Use this structure:

```text
ecommerce-cloud/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── Loading.jsx
│   │   ├── Button.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetails.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AddProduct.jsx
│   │       ├── EditProduct.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminCustomers.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── services/
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── invoiceService.js
│   │
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   └── calculations.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

Do not create every file immediately. Build the project incrementally.

---

# 18. Environment Variables

Never hardcode credentials.

Frontend environment variables should look like:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_api_gateway_url
```

Never expose:

```text
AWS Secret Access Key
AWS Access Key ID with excessive privileges
Supabase service_role key
Database password
```

in frontend code.

AWS secrets should remain server-side / in Lambda environment configuration where appropriate.

---

# 19. React Routing

Expected routing:

```text
/
/products
/products/:id
/cart
/checkout
/order-success/:id
/orders
/orders/:id
/login
/register

/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/orders
/admin/customers
```

Protected routes should be used for:

```text
/orders
/checkout
/admin/*
```

Admin routes must additionally check the user's admin role.

---

# 20. State Management

Initially, avoid Redux unless it becomes necessary.

Use React Context:

```text
AuthContext
    |
    ├── current user
    ├── login
    ├── logout
    └── register

CartContext
    |
    ├── cart items
    ├── addToCart
    ├── removeFromCart
    ├── updateQuantity
    ├── clearCart
    └── cart total
```

---

# 21. Billing Calculation

Centralize billing calculations.

Example:

```text
Subtotal = sum(product price × quantity)

Discount = applicable discount

Tax = calculated tax amount

Shipping = fixed/calculated shipping charge

Total = Subtotal - Discount + Tax + Shipping
```

Do not duplicate billing formulas across multiple components.

Create a utility such as:

```text
src/utils/calculations.js
```

---

# 22. UI Direction

The website should look like a modern e-commerce website.

Suggested visual structure:

```text
Navbar
--------------------------------
Logo | Home | Products | Cart | Login
--------------------------------

Hero Section

Featured Products

Categories

Popular Products

Footer
```

Product cards should contain:

```text
+----------------------+
|                      |
|     PRODUCT IMAGE    |
|                      |
+----------------------+
| Product Name         |
| Description          |
| ★★★★★               |
| ₹2,999               |
| [Add to Cart]        |
+----------------------+
```

Use Tailwind CSS for responsive design.

The website should work on:

- Desktop
- Tablet
- Mobile

---

# 23. Admin Dashboard

The admin dashboard should have a professional layout.

Example:

```text
------------------------------------------------
Admin Dashboard

Revenue          Orders          Products
₹1,25,000        124             48

------------------------------------------------

Recent Orders

Order ID     Customer       Amount      Status
ORD-1001     John           ₹2,999      Paid
ORD-1002     Alex           ₹4,299      Processing
ORD-1003     Sam            ₹999        Shipped

------------------------------------------------

Sales Overview
[Chart]

------------------------------------------------
```

A simple chart can be implemented later using Recharts if time permits.

---

# 24. Security Requirements

Important:

- Use Supabase Auth for authentication.
- Do not store plaintext passwords.
- Do not put AWS secret keys in React.
- Do not put Supabase service-role keys in React.
- Use Supabase Row Level Security where appropriate.
- Customers should only be able to access their own orders.
- Admin-only operations must require admin authorization.
- Validate data on the server side for important operations.
- Do not trust prices sent from the browser when creating final orders.
- Recalculate order totals server-side where possible.

For the college MVP, keep security understandable and demonstrable rather than overengineering it.

---

# 25. Development Plan

Build in this exact order.

## Phase 1 — Project Setup

```text
[ ] Install/check Node.js
[ ] Create Vite React project
[ ] Install dependencies
[ ] Configure Tailwind
[ ] Create basic folder structure
[ ] Run application
```

## Phase 2 — Supabase

```text
[ ] Create Supabase project
[ ] Create database tables
[ ] Configure authentication
[ ] Add sample products
[ ] Connect React to Supabase
```

## Phase 3 — Frontend

```text
[ ] Navbar
[ ] Footer
[ ] Home page
[ ] Product listing
[ ] Product cards
[ ] Product details
[ ] Search
[ ] Filters
```

## Phase 4 — Cart

```text
[ ] Cart context
[ ] Add product
[ ] Remove product
[ ] Quantity update
[ ] Cart totals
```

## Phase 5 — Authentication

```text
[ ] Register
[ ] Login
[ ] Logout
[ ] Protected routes
[ ] Customer/admin role
```

## Phase 6 — Checkout

```text
[ ] Customer information
[ ] Shipping information
[ ] Billing calculation
[ ] Payment selection
[ ] Demo payment
[ ] Create order
```

## Phase 7 — Orders

```text
[ ] Order confirmation
[ ] My orders
[ ] Order details
[ ] Order status
```

## Phase 8 — AWS S3

```text
[ ] Create S3 bucket
[ ] Configure appropriate permissions
[ ] Upload product images
[ ] Store image paths/URLs in Supabase
[ ] Display images in React
```

## Phase 9 — AWS Lambda + API Gateway

```text
[ ] Create Lambda function
[ ] Create invoice generation logic
[ ] Connect API Gateway
[ ] Generate invoice PDF
[ ] Upload PDF to S3
[ ] Return invoice URL
```

## Phase 10 — Admin

```text
[ ] Dashboard
[ ] Product CRUD
[ ] Image upload
[ ] Order management
[ ] Customer list
[ ] Basic sales statistics
```

## Phase 11 — Final Polish

```text
[ ] Responsive design
[ ] Loading states
[ ] Error states
[ ] Empty states
[ ] Form validation
[ ] UI polish
[ ] Test complete customer flow
[ ] Test admin flow
[ ] Test invoice flow
```

## Phase 12 — College Submission

```text
[ ] README
[ ] Architecture diagram
[ ] Database schema diagram
[ ] AWS architecture explanation
[ ] Screenshots
[ ] PPT
[ ] Project report
[ ] Demo script
```

---

# 26. Important Development Rule

Because the deadline is close:

**Do not overengineer.**

Avoid unless specifically required:

```text
Kubernetes
Docker
Microservices
Kafka
Redis
EC2
Complex CI/CD
Real-time recommendation engines
Complex payment systems
```

The priority is:

```text
WORKING APPLICATION
        +
GOOD UI
        +
CLOUD DATABASE
        +
AWS S3
        +
AWS LAMBDA
        +
INVOICE
        +
ADMIN DASHBOARD
```

---

# 27. Definition of Done

The project is considered complete when a demo user can:

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Open Product
   ↓
Add to Cart
   ↓
Checkout
   ↓
See Billing
   ↓
Choose Demo Payment
   ↓
Place Order
   ↓
Order Created
   ↓
Invoice Generated
   ↓
Invoice Stored in AWS S3
   ↓
View/Download Invoice
```

And an admin can:

```text
Login
   ↓
Open Admin Dashboard
   ↓
Add Product
   ↓
Upload Product Image
   ↓
Image Stored in S3
   ↓
Product Metadata Stored in Supabase
   ↓
Product Appears on Website
   ↓
View Orders
   ↓
Update Order Status
```

---

# 28. Instructions for Any AI Working on This Project

When an AI assistant is given this project context:

1. Understand the existing architecture before changing it.
2. Do not replace Supabase with Firebase unless explicitly requested.
3. Do not replace AWS S3/Lambda/API Gateway unless explicitly requested.
4. Keep React + Vite + Tailwind as the frontend stack.
5. Use JavaScript unless the project is explicitly migrated to TypeScript.
6. Follow the folder structure above.
7. Reuse existing components and services instead of duplicating code.
8. Keep business logic in services/utils where appropriate.
9. Do not hardcode secrets or API credentials.
10. Do not create unnecessary libraries.
11. Do not introduce complicated architecture without a clear reason.
12. When changing code, consider how the change affects Supabase, AWS, authentication, cart, orders, and invoices.
13. Preserve working functionality.
14. Explain exactly which files need to be created or modified.
15. Give commands that can be copied directly into the terminal.
16. If an error occurs, debug the existing implementation instead of rebuilding the project from scratch.
17. Prefer the simplest working implementation suitable for a college project.
18. Keep the UI professional, responsive, and consistent.
19. Use environment variables for secrets/configuration.
20. Before implementing a major feature, explain where it fits in the architecture.

---

# 29. Current Development Status

At the beginning of development:

```text
React/Vite:        NOT STARTED
Tailwind:          NOT STARTED
Supabase:          NOT STARTED
Database:          NOT STARTED
Authentication:    NOT STARTED
Products:          NOT STARTED
Cart:              NOT STARTED
Checkout:          NOT STARTED
Orders:            NOT STARTED
AWS S3:            NOT STARTED
AWS Lambda:        NOT STARTED
API Gateway:       NOT STARTED
Invoices:          NOT STARTED
Admin Dashboard:   NOT STARTED
Deployment:        NOT STARTED
```

Update this section as the project progresses.

---

# 30. Immediate Next Step

Start with **Phase 1 — Project Setup**.

Commands:

```bash
npm create vite@latest ecommerce-cloud -- --template react
cd ecommerce-cloud
npm install
npm install react-router-dom axios lucide-react
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Then create/configure the Supabase project.

Do not jump directly to AWS.

First establish:

```text
React + Vite
      ↓
Tailwind
      ↓
Supabase
      ↓
Database
      ↓
Products
```

Then integrate AWS after the core application is functional.
