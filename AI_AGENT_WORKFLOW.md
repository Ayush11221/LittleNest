# AI Agent Workflow — How to Work on This Project

## Purpose

This file explains **how the coding agent should operate** while building our Cloud E-Commerce college project.

This project has a very short deadline, so the goal is to use the agent efficiently without allowing it to make uncontrolled, unnecessary changes.

There are two other important project files:

```text
cloud_ecommerce_project_context.md
AI_CODING_AGENT_INSTRUCTIONS.md
```

Read those files first.

- `cloud_ecommerce_project_context.md` = WHAT we are building.
- `AI_CODING_AGENT_INSTRUCTIONS.md` = HOW the coding agent should behave.
- This file = HOW we want to use the agent efficiently during development.

---

# 1. Primary Coding Model

For major implementation and architecture work, use:

## Claude Opus 4.6 (Thinking)

This should be the default/main agent for this project.

Use it especially for:

- Architecture
- Database design
- Authentication
- Cart architecture
- Checkout
- Order creation
- Supabase integration
- AWS S3 integration
- AWS Lambda
- API Gateway
- Invoice generation
- Multi-file changes
- Complex debugging
- Codebase-wide reasoning
- Understanding dependencies between features

The reason is that this project requires reasoning across multiple systems:

```text
React
  ↓
Supabase Auth
  ↓
Supabase PostgreSQL
  ↓
Orders
  ↓
AWS API Gateway
  ↓
AWS Lambda
  ↓
AWS S3
  ↓
Invoice
```

A change in one area may affect another.

---

# 2. Secondary Models

Other models can be used when appropriate.

## Claude Sonnet 4.6 (Thinking)

Use for faster implementation tasks such as:

- UI components
- Tailwind styling
- Simple CRUD
- Refactoring
- Straightforward bug fixes
- Repetitive implementation
- Responsive layout work

## Gemini 3.1 Pro High

Can be used for:

- UI ideas
- Frontend design
- Alternative implementation approaches
- Planning
- Visual/frontend review
- General coding assistance

## Gemini Flash models

Use for:

- Very small/simple changes
- Quick questions
- Simple formatting
- Small fixes

Do not use a weaker/faster model for a complicated architectural change merely to save time.

---

# 3. Important Rule: One Main Agent at a Time

Do not have multiple AI agents independently modifying the same codebase at the same time.

Bad workflow:

```text
Claude modifies project
        +
Gemini modifies project
        +
Another agent modifies project
        ↓
Conflicting changes
```

Preferred workflow:

```text
                  MAIN AGENT
               Claude Opus Thinking
                       |
                       v
                  Code changes
                       |
                       v
                    Test
                       |
                       v
                 Git commit
                       |
              +--------+--------+
              |                 |
              v                 v
        ChatGPT review     Secondary AI
        /architecture      if needed
```

Use one agent as the primary owner of the current implementation.

---

# 4. Role of ChatGPT

ChatGPT is the project's architecture/planning/debugging copilot.

Use ChatGPT for:

- Architecture decisions
- Reviewing agent plans
- Reviewing database design
- AWS architecture decisions
- Debugging difficult problems
- Explaining errors
- Reviewing code changes
- Creating prompts for the coding agent
- College viva explanations
- Project report/PPT preparation
- Deciding whether an implementation is correct
- Checking whether the coding agent is overengineering

The coding agent should not automatically override architectural decisions documented in the project files.

---

# 5. Agent Workflow

Every major feature should follow:

```text
PLAN
  ↓
APPROVE
  ↓
BUILD
  ↓
TEST
  ↓
REVIEW
  ↓
COMMIT
```

Do not skip directly from PLAN to building the entire application.

---

# 6. PLAN Phase

Before implementing a significant feature, ask the agent to inspect the codebase and create a plan.

Example:

```text
Analyze the existing project and create an implementation plan
for the shopping cart.

Do not modify any files yet.

Inspect:
- existing components
- routing
- context
- services
- Supabase integration
- current package dependencies

Explain:
1. Which files need to change
2. Which files need to be created
3. How the feature connects to the existing architecture
4. Any risks or dependencies

Wait for approval before implementing.
```

Then review the plan.

If the plan is good, approve it.

If the plan is bad, correct it before implementation.

---

# 7. BUILD Phase

After approving the plan:

```text
Implement the approved plan.

Follow:
- cloud_ecommerce_project_context.md
- AI_CODING_AGENT_INSTRUCTIONS.md

Modify only the files necessary for this feature.

Do not redesign unrelated parts of the application.

After implementation, run the appropriate build/test checks.
```

The agent can then edit files.

---

# 8. TEST Phase

After implementation, explicitly ask the agent to test.

Example:

```text
Now verify the implementation.

1. Run npm run build.
2. Start the application if needed.
3. Test the affected user flow.
4. Check the browser console for errors.
5. Check for obvious runtime/API/database errors.
6. Fix any issues you find.
7. Run the build again after fixing.

Do not add new features during this verification step.
```

This prevents the agent from continuously adding new functionality instead of stabilizing the current feature.

---

# 9. REVIEW Phase

After testing, review the result.

Ask the agent:

```text
Review the implementation against our project context.

Check:
- Architecture
- Security
- Code organization
- Reusability
- Error handling
- Environment variables
- Supabase usage
- AWS integration where applicable

Do not modify files yet.

Report any issues that should be fixed.
```

For important features, the implementation can also be reviewed by ChatGPT.

---

# 10. COMMIT Phase

Once a feature works:

```bash
git status
git add .
git commit -m "Add shopping cart"
```

Use meaningful commits.

Examples:

```text
Initial project setup
Configure Tailwind
Add Supabase connection
Add product listing
Add product details
Add authentication
Add shopping cart
Add checkout
Add order creation
Add AWS S3 integration
Add invoice generation
Add admin dashboard
```

If an AI agent makes a bad change, Git makes it much easier to recover.

---

# 11. Never Ask the Agent to Build Everything at Once

Avoid:

```text
Build the complete ecommerce website including:
React, Tailwind, Supabase, authentication, cart,
checkout, payment, AWS, Lambda, invoices, admin panel
and deployment.
```

This is too broad.

Instead:

```text
Build Phase 1 only.
```

Then:

```text
Build product listing.
```

Then:

```text
Build product details.
```

Then:

```text
Build cart.
```

And so on.

---

# 12. Recommended Build Order

Follow this order:

```text
1. React/Vite setup
       ↓
2. Tailwind setup
       ↓
3. Basic layout
       ↓
4. Supabase project
       ↓
5. Database schema
       ↓
6. Supabase connection
       ↓
7. Product data
       ↓
8. Product listing
       ↓
9. Product details
       ↓
10. Authentication
       ↓
11. Cart
       ↓
12. Checkout
       ↓
13. Orders
       ↓
14. Billing
       ↓
15. AWS S3
       ↓
16. AWS Lambda
       ↓
17. API Gateway
       ↓
18. Invoice generation
       ↓
19. Admin dashboard
       ↓
20. Testing
       ↓
21. Deployment
       ↓
22. Documentation/PPT
```

---

# 13. Deadline Strategy

This is a college project with a very short deadline.

If time becomes limited, prioritize the working MVP.

## Must work

```text
Product listing
Product details
Cart
Login/Register
Checkout
Billing
Order creation
Invoice
AWS S3
```

## Important if time allows

```text
Admin dashboard
AWS Lambda
API Gateway
Search
Filters
Order status
```

## Optional

```text
Wishlist
Reviews
Coupons
Recommendations
Email notifications
Real payment gateway
Advanced analytics
```

Do not sacrifice the core application for optional features.

---

# 14. When the Agent Gets Stuck

If the coding agent reports an error it cannot solve:

Do not immediately tell it to rewrite the entire project.

Instead:

```text
Stop making changes.

Explain:
1. The exact error
2. The likely root cause
3. Which file caused it
4. What you have already tried
5. The smallest possible fix
```

Then bring the error to ChatGPT for diagnosis if necessary.

---

# 15. When the Agent Starts Overengineering

If the agent proposes:

```text
microservices
Redis
Kafka
Kubernetes
EC2
complex authentication service
multiple backend frameworks
```

stop it.

Tell it:

```text
This is a college MVP with a short deadline.

Do not introduce additional infrastructure.

Follow the existing architecture:
React + Supabase + AWS S3 + Lambda + API Gateway.

Use the simplest implementation that satisfies the requirement.
```

---

# 16. When the Agent Wants to Replace Technologies

If the agent says:

> Firebase would be better than Supabase.

or:

> We should use Next.js instead of Vite.

or:

> We should use MongoDB instead of PostgreSQL.

Do not allow the change automatically.

The current architecture is intentional.

Ask:

```text
Explain why this change is necessary and what parts of the
existing project it would affect.

Do not make the change yet.
```

Only change the architecture if explicitly approved.

---

# 17. Prompt Pattern for Every Feature

Use this structure:

```text
FEATURE:
[Name of feature]

CONTEXT:
[Why we need it]

CURRENT STATE:
[What already exists]

TASK:
[Exactly what to implement]

CONSTRAINTS:
[What must not change]

FILES:
[Relevant files if known]

VERIFICATION:
[How the feature should be tested]

Do not implement unrelated features.
```

Example:

```text
FEATURE:
Shopping Cart

CONTEXT:
We need customers to add products and modify quantities.

CURRENT STATE:
Product listing and product details are already working.

TASK:
Implement CartContext and the cart page.

CONSTRAINTS:
- Use React Context.
- Do not add Redux.
- Do not modify Supabase yet.
- Reuse ProductCard styling where appropriate.

VERIFICATION:
- Add a product.
- Increase quantity.
- Decrease quantity.
- Remove product.
- Verify subtotal.
- Verify empty cart state.
- Run npm run build.

Do not implement checkout yet.
```

---

# 18. Prompt for Codebase Inspection

When starting a new session:

```text
Read these project instruction files first:

1. cloud_ecommerce_project_context.md
2. AI_CODING_AGENT_INSTRUCTIONS.md
3. AI_AGENT_WORKFLOW.md

Then inspect the entire current project structure.

Do not modify files yet.

Report:
- Current project state
- Completed features
- Incomplete features
- Existing errors
- Relevant dependencies
- Current architecture
- Next recommended step

Wait for approval before implementing changes.
```

---

# 19. Prompt for UI Work

For UI tasks:

```text
Focus only on the UI implementation.

Use:
- React
- Tailwind CSS
- Existing design system/components
- Lucide React where icons are needed

Keep the design:
- modern
- clean
- responsive
- consistent with the existing website

Do not modify database logic unless required.

After implementation:
1. Run the build.
2. Check the affected page.
3. Fix visual/runtime errors.
```

---

# 20. Prompt for Backend/Supabase Work

For database tasks:

```text
Before changing the database:

1. Inspect the current schema.
2. Check existing relationships.
3. Check existing Supabase queries.
4. Identify affected frontend services/components.

Do not delete existing data or tables unless explicitly approved.

Use proper foreign keys and constraints.

Consider Row Level Security.

After the database change, verify the application queries still work.
```

---

# 21. Prompt for AWS Work

AWS should be added after the core application works.

Before creating AWS infrastructure:

```text
Explain:
1. Which AWS service we are adding.
2. Why the project needs it.
3. What data flows through it.
4. What permissions are required.
5. What frontend/backend files will interact with it.
6. How we will test it.

Do not create unrelated AWS resources.
```

Expected AWS architecture:

```text
React
  |
  v
API Gateway
  |
  v
Lambda
  |
  +---- Supabase
  |
  +---- S3
```

S3:

```text
products/
invoices/
```

---

# 22. Security Rules for AI Agents

Never ask the agent to put secrets into source code.

Never expose:

```text
AWS_SECRET_ACCESS_KEY
AWS_ACCESS_KEY_ID
Supabase service_role key
Database password
Private API keys
```

Never commit `.env`.

Use environment variables.

If credentials are accidentally exposed:

```text
STOP
```

and tell the developer immediately.

Do not continue using leaked credentials.

---

# 23. Browser Testing

When browser tools are available, use them.

For important flows:

```text
Home
 ↓
Products
 ↓
Product Details
 ↓
Cart
 ↓
Checkout
 ↓
Order Success
 ↓
Invoice
```

Also test:

```text
Admin Login
 ↓
Admin Dashboard
 ↓
Add Product
 ↓
Upload Image
 ↓
View Product
```

Do not consider a feature complete simply because `npm run build` passes.

---

# 24. Use Git as a Safety Net

Before major AI changes:

```bash
git status
```

If the current state is stable:

```bash
git add .
git commit -m "Stable checkpoint"
```

After AI changes:

```bash
git diff
git status
```

Review what changed.

Do not blindly accept hundreds of unrelated changes.

---

# 25. Definition of a Good Agent Response

A good response from the coding agent should look like:

```text
Implemented: Product listing

Files changed:
- src/pages/Products.jsx
- src/components/ProductCard.jsx
- src/services/productService.js

What changed:
- Products are now loaded from Supabase.
- Added loading state.
- Added empty state.
- Added error handling.

Verification:
- npm run build: PASSED
- Browser test: PASSED

Remaining:
- Product filtering will be implemented separately.
```

A bad response would be:

```text
Done! I built the whole ecommerce application.
```

without explaining what actually changed or verifying it.

---

# 26. Current Working Strategy

The current recommended setup is:

```text
                    YOU
                     |
        +------------+------------+
        |                         |
        v                         v
   ChatGPT                  Antigravity IDE
 Architecture               Main Coding Agent
 Debugging                  Claude Opus Thinking
 Planning                         |
 Prompts                           |
 Viva/PPT                          v
                            Write / Test Code
                                  |
                                  v
                               GitHub
```

Optional:

```text
Gemini Pro
    |
    +-- UI ideas
    +-- Alternative approaches
    +-- Additional review
```

Do not use multiple agents to simultaneously edit the same project.

---

# 27. First Prompt to Give the Agent

Paste this into the main coding agent:

```text
Read these files completely before doing anything:

1. cloud_ecommerce_project_context.md
2. AI_CODING_AGENT_INSTRUCTIONS.md
3. AI_AGENT_WORKFLOW.md

These files define the project requirements, architecture,
coding rules, and agent workflow.

Do not modify any files yet.

First inspect the current workspace and determine:

1. Is this already a React/Vite project?
2. What files currently exist?
3. What dependencies are installed?
4. Is Tailwind configured?
5. Is Supabase configured?
6. Is AWS configured?
7. What parts of the project are already implemented?
8. Are there any current build/runtime errors?

Compare the current state against Phase 1 of the project plan.

Then provide:
- Current status
- Problems found
- Recommended next step
- Exact files that would need to change

Do NOT implement anything yet.

Wait for approval before making changes.
```

---

# 28. Final Rule

The AI is the **developer**, but it is not the **architectural authority**.

The project owner decides whether major changes are acceptable.

Always:

```text
Understand
   ↓
Plan
   ↓
Review
   ↓
Build
   ↓
Test
   ↓
Review
   ↓
Commit
```

The goal is not maximum code generation.

The goal is:

```text
Maximum useful progress
with minimum unnecessary risk.
```
