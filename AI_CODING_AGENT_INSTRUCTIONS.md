# AI Coding Agent Instructions — Cloud E-Commerce Project

## Purpose

This file is for the AI coding agent working on our college Cloud E-Commerce project.

The main project architecture and feature specification are documented in:

```text
cloud_ecommerce_project_context.md
```

**Read that file first and treat it as the source of truth for the project's architecture and requirements.**

This file defines **how the AI should work on the project**.

---

# 1. Role of the AI Coding Agent

You are the hands-on coding agent for this project.

Your responsibilities are to:

- Inspect the existing codebase before making changes.
- Implement features incrementally.
- Create and modify files as needed.
- Run the application and tests/build commands.
- Diagnose and fix errors.
- Keep the architecture consistent.
- Avoid unnecessary complexity.
- Explain important changes.
- Preserve working functionality.

You are NOT expected to redesign the architecture without permission.

---

# 2. Project Architecture

The intended architecture is:

```text
                    CUSTOMER
                       |
                       v
              React + Vite Frontend
                       |
             +---------+---------+
             |                   |
             v                   v
         Supabase            AWS API Gateway
             |                   |
             |                   v
             |              AWS Lambda
             |                   |
             |                   v
             |                AWS S3
             |
             v
       PostgreSQL Database
```

### Frontend

```text
React
Vite
JavaScript
Tailwind CSS
React Router
Axios
Lucide React
```

### Backend / Data

```text
Supabase
├── PostgreSQL
└── Authentication
```

### AWS

```text
AWS S3
├── Product Images
└── Invoice PDFs

AWS Lambda
└── Invoice generation / server-side processing

AWS API Gateway
└── Public HTTPS endpoint for Lambda APIs
```

---

# 3. Non-Negotiable Technology Decisions

Unless explicitly instructed otherwise:

- Keep React + Vite.
- Keep JavaScript.
- Keep Tailwind CSS.
- Keep Supabase.
- Keep PostgreSQL through Supabase.
- Keep AWS S3.
- Keep AWS Lambda.
- Keep AWS API Gateway.
- Do not replace Supabase with Firebase.
- Do not replace AWS services with another cloud provider.
- Do not migrate the project to TypeScript unless explicitly requested.
- Do not introduce a new framework unnecessarily.

If you believe a technology change is necessary, explain why and ask before making the change.

---

# 4. Development Philosophy

This project has a short college-project deadline.

The priority is:

```text
Working Application
        +
Clean UI
        +
Cloud Database
        +
AWS Integration
        +
Invoice System
        +
Admin Dashboard
```

Do NOT overengineer.

Avoid introducing:

```text
Kubernetes
Kafka
Redis
Microservices
EC2
Complex CI/CD
Complex payment infrastructure
Recommendation engines
Unnecessary state-management frameworks
```

unless explicitly required.

Prefer the simplest implementation that is:

- Correct
- Maintainable
- Easy to demonstrate
- Easy to explain in a college viva

---

# 5. Before Making Any Changes

Always perform these steps:

## Step 1 — Inspect

Understand:

- Current files
- Current folder structure
- Existing dependencies
- Existing routes
- Existing components
- Existing contexts
- Existing services
- Existing Supabase integration
- Existing AWS integration

Do not assume that a file is empty or missing without checking.

## Step 2 — Plan

For a non-trivial feature, briefly state:

```text
What will change
Which files will change
Why they need to change
How the feature connects to the architecture
```

## Step 3 — Implement

Modify only the files necessary for the task.

## Step 4 — Verify

Run appropriate commands such as:

```bash
npm run dev
npm run build
```

and any available tests/lint commands.

## Step 5 — Report

At the end, tell the developer:

- What was implemented
- Files changed
- Commands run
- Whether verification passed
- Any remaining issue

---

# 6. Do Not Make Giant Changes

Never interpret a request such as:

> "Build the ecommerce website"

as permission to create the entire application in one operation.

Build in phases.

Recommended order:

```text
Phase 1
Project setup
        ↓
Phase 2
Supabase database
        ↓
Phase 3
Product UI
        ↓
Phase 4
Cart
        ↓
Phase 5
Authentication
        ↓
Phase 6
Checkout
        ↓
Phase 7
Orders
        ↓
Phase 8
AWS S3
        ↓
Phase 9
AWS Lambda
        ↓
Phase 10
API Gateway
        ↓
Phase 11
Invoices
        ↓
Phase 12
Admin Dashboard
        ↓
Phase 13
Testing + Polish
        ↓
Phase 14
Deployment + Documentation
```

Complete and verify one meaningful stage before moving to the next.

---

# 7. React Folder Structure

The target structure is:

```text
ecommerce-cloud/
│
├── public/
│
├── src/
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

Do not create dozens of files that are not needed.

---

# 8. Code Organization Rules

## Components

Reusable UI components belong in:

```text
src/components/
```

Examples:

```text
Navbar
ProductCard
ProductGrid
Button
Loading
Modal
```

## Pages

Route-level screens belong in:

```text
src/pages/
```

## Context

Global client state belongs in:

```text
src/context/
```

Initially:

```text
AuthContext
CartContext
```

Do not add Redux or another state-management system unless explicitly requested.

## Services

Database/API operations belong in:

```text
src/services/
```

Avoid putting large amounts of Supabase/API logic directly inside UI components.

## Utilities

Reusable calculations and formatting belong in:

```text
src/utils/
```

Examples:

```text
formatCurrency.js
calculations.js
```

---

# 9. Supabase Rules

Supabase is the primary application database.

Expected tables:

```text
users
categories
products
orders
order_items
payments
```

Authentication should use Supabase Auth.

Never store plaintext passwords.

Never put the Supabase `service_role` key in frontend code.

Frontend should use environment variables such as:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=...
```

Never hardcode secrets.

---

# 10. Database Integrity

When creating orders:

- Do not blindly trust prices sent by the browser.
- Retrieve the current product information from the database.
- Recalculate totals.
- Save the purchased price into `order_items.price`.
- Preserve historical order pricing.

Example:

```text
Product current price = ₹1,199

Old order purchased it for = ₹999

Old order must continue showing = ₹999
```

---

# 11. Authentication Rules

There are two roles:

```text
customer
admin
```

Customers can:

- Browse products
- Manage cart
- Checkout
- View their orders

Admins can:

- Manage products
- View orders
- Manage order status
- View customers
- Access admin dashboard

Protected routes:

```text
/checkout
/orders
/orders/:id
/admin/*
```

Admin routes must verify admin authorization.

Do not rely only on hiding UI buttons for security.

---

# 12. Cart Rules

Cart functionality should be managed through:

```text
CartContext.jsx
```

It should support:

```text
addToCart()
removeFromCart()
updateQuantity()
clearCart()
```

It should calculate:

```text
subtotal
```

The cart UI should support:

- Empty cart state
- Quantity changes
- Product removal
- Total calculation
- Checkout navigation

---

# 13. Billing Rules

Centralize billing calculations.

Conceptually:

```text
Subtotal = sum(price × quantity)

Discount = applicable discount

Tax = calculated tax

Shipping = calculated/fixed shipping

Total = Subtotal - Discount + Tax + Shipping
```

Do not duplicate this logic in multiple React components.

Use:

```text
src/utils/calculations.js
```

Important totals should be recalculated on the server side before final order creation.

---

# 14. AWS S3 Rules

AWS S3 is used for large/static files.

### Product images

```text
products/
```

### Invoices

```text
invoices/
```

Product metadata stays in Supabase.

Example:

```text
Supabase:

name
description
price
image_url
stock

AWS S3:

actual image file
```

Do not store large binary files directly inside PostgreSQL unless there is a specific reason.

---

# 15. AWS Lambda Rules

Lambda will handle server-side functionality such as invoice generation.

Expected flow:

```text
React
  |
  v
API Gateway
  |
  v
Lambda
  |
  +----> Supabase
  |
  +----> Generate Invoice PDF
  |
  v
S3
```

Lambda code must never expose AWS credentials to the React frontend.

Use appropriate IAM permissions with least privilege.

---

# 16. API Gateway

API Gateway should expose Lambda functionality through HTTPS endpoints.

Potential endpoints:

```text
POST /api/invoice
POST /api/order
GET /api/orders/:id
```

Do not create fake endpoints.

If an endpoint is not implemented, clearly state that it is not implemented.

---

# 17. Invoice System

Invoice generation should eventually work like this:

```text
Customer places order
        ↓
Order saved
        ↓
Invoice request
        ↓
API Gateway
        ↓
Lambda
        ↓
Generate PDF
        ↓
Upload PDF to S3
        ↓
Return invoice URL
        ↓
React displays download/view button
```

Example invoice information:

```text
Store Name
Invoice Number
Order ID
Customer Name
Customer Email
Billing/Shipping Address

Product
Quantity
Price
Subtotal

Tax
Shipping
Discount
Total

Payment Status
Order Date
```

---

# 18. Payment

Initially, use a simulated payment flow.

Supported UI options:

```text
UPI
Credit/Debit Card
Cash on Delivery
```

The project does not need a real payment gateway unless explicitly requested.

Do not claim that a payment was processed by a real financial provider when it was only simulated.

Use statuses such as:

```text
pending
paid
failed
```

---

# 19. UI/UX Requirements

The website should look like a modern e-commerce application.

Requirements:

- Responsive
- Clean spacing
- Consistent typography
- Consistent buttons
- Clear navigation
- Good product cards
- Good empty states
- Loading indicators
- Error messages
- Mobile-friendly layouts

Use Tailwind CSS.

Avoid creating a different visual style on every page.

---

# 20. Required Customer Pages

Eventually implement:

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
```

---

# 21. Required Admin Pages

Eventually implement:

```text
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/orders
/admin/customers
```

---

# 22. Error Handling

Every important async operation should have:

```text
Loading state
Success state
Error state
Empty state where appropriate
```

Do not leave users with a blank page if an API/database call fails.

Use meaningful error messages.

Avoid exposing internal stack traces or secrets to users.

---

# 23. Environment Variables and Secrets

Never commit secrets.

Use:

```text
.env
```

and ensure `.env` is included in `.gitignore`.

Never put these into frontend source code:

```text
AWS_SECRET_ACCESS_KEY
AWS_ACCESS_KEY_ID
Supabase service_role key
Database password
Private API keys
```

Public frontend configuration such as the Supabase URL and anon key may be exposed when appropriate, but database policies/RLS must still be correctly configured.

---

# 24. Git Workflow

Use Git frequently.

Recommended:

```bash
git status
git add .
git commit -m "meaningful message"
```

Create commits after stable milestones.

Examples:

```text
Initial React setup
Add Tailwind configuration
Add Supabase connection
Add product listing
Add shopping cart
Add authentication
Add checkout
Add AWS S3 integration
Add invoice generation
Add admin dashboard
```

Do not make one enormous commit after the entire project is complete.

---

# 25. Testing Strategy

At every stage:

### Frontend

Verify:

- Page loads
- Navigation works
- No console errors
- Responsive layout works

### Database

Verify:

- Insert
- Select
- Update
- Delete
- Relationships
- Authentication
- Permissions

### AWS

Verify:

- S3 upload
- S3 retrieval
- Lambda invocation
- API Gateway request
- Invoice generation

### End-to-end customer flow

```text
Register
↓
Login
↓
Browse
↓
Product details
↓
Add to cart
↓
Checkout
↓
Place order
↓
Order created
↓
Invoice generated
↓
Invoice available
```

### Admin flow

```text
Admin login
↓
Dashboard
↓
Add product
↓
Upload image
↓
Product appears
↓
View orders
↓
Update order status
```

---

# 26. How to Work on a Task

When the developer gives a task, follow this pattern:

## A. Understand

Determine:

```text
What is being requested?
Which existing functionality is involved?
Which files are relevant?
Does this affect the architecture?
```

## B. Inspect

Read relevant existing files before editing.

## C. Plan

Provide a short plan for non-trivial tasks.

## D. Implement

Make the smallest appropriate set of changes.

## E. Run

Use available commands:

```bash
npm run build
```

and/or:

```bash
npm run dev
```

plus any available test/lint commands.

## F. Fix

If something breaks, debug it.

Do not hide errors.

## G. Summarize

Report:

```text
Implemented:
- ...

Changed:
- ...

Verified:
- ...

Remaining:
- ...
```

---

# 27. Browser Testing

When browser automation or browser inspection is available:

1. Start the application.
2. Open the relevant page.
3. Test the actual user flow.
4. Check browser console errors.
5. Check network/API failures when relevant.
6. Verify responsive behavior where possible.

Do not assume the UI works simply because the code compiles.

---

# 28. If You Encounter an Error

Follow this order:

```text
Read error
   ↓
Identify source file
   ↓
Inspect surrounding code
   ↓
Understand root cause
   ↓
Make minimal fix
   ↓
Run build/test
   ↓
Verify again
```

Do not randomly rewrite the project.

Do not delete working functionality to hide an error.

---

# 29. If the Developer Gives a Screenshot

Use the screenshot as evidence of the current issue.

Before changing the UI:

- Identify the exact problem.
- Inspect the relevant component.
- Make the smallest appropriate change.
- Preserve existing design language.

---

# 30. If the Developer Gives an Existing Code File

Do not immediately replace the entire file.

First determine:

- What already works
- What is broken
- What needs modification
- What dependencies the file has

Then modify only the relevant parts unless a complete rewrite is genuinely necessary.

---

# 31. Do Not Invent Infrastructure

Never pretend that:

```text
AWS S3 exists
Lambda exists
API Gateway exists
Supabase table exists
Environment variable exists
API endpoint exists
```

unless it has actually been configured or confirmed.

If something is missing, say:

```text
This part has not been configured yet.
```

Then provide the next step.

---

# 32. Avoid Fake Data in Production Logic

Sample/mock data is acceptable during UI development.

However, clearly separate:

```text
mock/demo data
```

from:

```text
real Supabase data
```

Do not accidentally leave hardcoded products in the final application when the requirement is to use Supabase.

---

# 33. Do Not Break Existing Features

Before changing shared components such as:

```text
Navbar
CartContext
AuthContext
ProductCard
supabase.js
calculations.js
```

inspect their current usage.

A change to a shared component can affect many pages.

After changing shared functionality, test the relevant existing flows.

---

# 34. AI Communication Style

When explaining technical decisions:

- Be concise.
- Be specific.
- Mention affected files.
- Explain why the change is needed.
- Avoid unnecessary theory.
- Give copy-pasteable commands when appropriate.

For example:

```text
Implemented Supabase product fetching.

Changed:
- src/services/productService.js
- src/pages/Products.jsx

Why:
Product data now comes from PostgreSQL instead of hardcoded mock data.

Verified:
- npm run build passed.
```

---

# 35. Priority Rules

When requirements conflict, prioritize:

```text
1. Correctness
2. Security
3. Existing architecture
4. Working functionality
5. Simplicity
6. UI polish
7. Extra features
```

Do not sacrifice working core functionality for optional features.

---

# 36. MVP Priority

If time becomes limited, prioritize:

```text
1. Product listing
2. Product details
3. Cart
4. Authentication
5. Checkout
6. Order creation
7. Billing
8. Invoice
9. AWS S3
10. Admin dashboard
```

Optional features should only be added after these work.

---

# 37. Current Project Status

At project start:

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

Update this section when major milestones are completed.

---

# 38. First Task

The first task should be:

```text
Set up the React/Vite project.

Do NOT implement:
- Supabase
- AWS
- Authentication
- Cart
- Checkout
- Payments
- Invoices
- Admin dashboard

yet.

Only establish the basic project structure and frontend tooling.
```

Expected initial commands:

```bash
npm create vite@latest ecommerce-cloud -- --template react
cd ecommerce-cloud
npm install
npm install react-router-dom axios lucide-react
npm install tailwindcss @tailwindcss/vite
npm run dev
```

After setup, verify the app loads successfully.

---

# 39. Important Final Instruction

Always remember:

**This is a college project being built under a tight deadline.**

The objective is not to create a billion-user production platform.

The objective is to create a:

```text
Professional-looking
        +
Functional
        +
Cloud-connected
        +
AWS-integrated
        +
Easy-to-demonstrate
        +
Easy-to-explain
```

e-commerce application.

Follow the architecture in:

```text
cloud_ecommerce_project_context.md
```

and use this file as the coding-agent operating procedure.

Do not make major architectural changes without explicit approval from the developer.
