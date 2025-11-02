🛒✨ E-Commerce Backend API
⚡ Built with Node.js + Express + MongoDB + JWT Auth
🌈 Overview

This backend powers a complete e-commerce application featuring secure authentication, role-based admin control, cart and order management, and product CRUD with MongoDB integration.

🧠 Tech Stack:

Node.js + Express.js → Server and REST APIs

MongoDB + Mongoose → Database and ODM

JWT + bcrypt.js → Secure authentication

dotenv + CORS + nodemon → Environment & Dev Setup

DummyJSON API → Product seeding source

🗂️ Project Folder Structure
📦 ecommerce_backend
 ┣ 📁 controllers
 ┃ ┣ adminController.js
 ┃ ┣ authController.js
 ┃ ┣ orderController.js
 ┃ ┣ productController.js
 ┃ ┗ userController.js
 ┣ 📁 middleware
 ┃ ┣ admin.js
 ┃ ┗ auth.js
 ┣ 📁 models
 ┃ ┣ Order.js
 ┃ ┣ Product.js
 ┃ ┗ User.js
 ┣ 📁 routes
 ┃ ┣ admin.js
 ┃ ┣ auth.js
 ┃ ┣ orders.js
 ┃ ┣ products.js
 ┃ ┗ users.js
 ┣ 📜 server.js
 ┣ 📜 seed.js
 ┣ 📜 package.json
 ┗ 📜 .env

⚙️ Environment Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/ecommerce_backend.git
cd ecommerce_backend

2️⃣ Install Dependencies
npm install

3️⃣ Create a .env File

Create a .env file in the root directory and add the following:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommercewebsite
JWT_SECRET=<your_jwt_secret>
ADMIN_SECRET_CODE=anand@1
PORT=5000


✅ Example:

MONGO_URI=mongodb+srv://AnandKumar:root@cluster0.4ndn0f.mongodb.net/ecommercewebsite
JWT_SECRET=e41a144c711f2919a3d230e8130e1ecf5faccdec24431d10d63bd10cf660379...
ADMIN_SECRET_CODE=anand@1
PORT=5000

💾 Database Configuration

Uses MongoDB Atlas as the cloud database.

Auto-seeding feature fetches real products from DummyJSON API
.

You can manually run seeding:

node seed.js


This will delete old products and insert fresh ones.

🚀 Running the Server
🧩 Development Mode (with live reload)
npm run dev

⚡ Production Mode
npm start


After start, open:
👉 http://localhost:5000

🌐 API Routes Overview
🔐 Auth Routes → /api/auth
Method	Endpoint	Description
POST	/register	Register new user or admin
POST	/login	User/Admin login
👤 User Routes → /api/users
Method	Endpoint	Description
PUT	/profile	Update user profile
GET	/cart	Get user cart
POST	/cart	Add item to cart
PUT	/cart	Update cart item quantity
DELETE	/cart/:productId	Remove item from cart
🛍️ Product Routes → /api/products
Method	Endpoint	Description
GET	/	Fetch all products (with filters)
GET	/:id	Get product by ID
POST	/	Add new product (Admin only)
PUT	/:id	Update product (Admin only)
DELETE	/:id	Delete product (Admin only)
📦 Order Routes → /api/orders
Method	Endpoint	Description
POST	/	Create new order
GET	/	Get logged-in user’s orders
🛠️ Admin Routes → /api/admin
Method	Endpoint	Description
GET	/products	View all products
GET	/orders	View all user orders
GET	/carts	View all user carts

🔒 All admin routes require a valid JWT and admin privileges.

🧠 Authentication Flow

User registers → system validates if admin secret is provided.

JWT token is generated and returned on successful login/register.

Token is required in Authorization: Bearer <token> header for protected routes.

Middleware (auth.js, admin.js) verifies token and permissions.

🧺 Cart Flow

🪄 Add to Cart → Update → Remove → Order

Add → POST /api/users/cart
Update Quantity → PUT /api/users/cart
Remove Item → DELETE /api/users/cart/:id
Place Order → POST /api/orders

💰 Order Flow

User places an order with their cart items.

Order is stored in orders collection.

Admin can view all orders in /api/admin/orders.

Status can be tracked as pending, shipped, or delivered.

🌱 Seeding Products
node seed.js


✨ This script fetches real products from DummyJSON and inserts them into MongoDB with all details — name, price, rating, brand, discount, category, and images.

📦 Models Overview
Model	Description
User.js	User data, password hash, role (Admin/User), cart
Product.js	Product details (price, stock, category, brand, etc.)
Order.js	Order details, linked user & product references
🧱 Middleware
File	Purpose
auth.js	Verifies JWT tokens and attaches user info
admin.js	Checks if req.isAdmin is true before allowing access
🧑‍💻 Development Notes

✨ Auto-refresh using nodemon

🧠 Uses lean() for optimized MongoDB queries

⚡ Secure password hashing with bcrypt

🔐 Token expiry → 1 day

🧭 Project Flow (Step-by-Step)

🧱 Setup your MongoDB Atlas cluster.

📁 Clone the repo → create .env.

⚙️ Run npm install.

🌱 Seed products → node seed.js.

🚀 Start server → npm run dev.

🔐 Register & login via Postman or frontend.

🛍️ Add items to cart, place orders.

🛠️ Admin can manage products & orders.

🧰 Tools & Utilities
Tool	Use
bcryptjs	Password hashing
jsonwebtoken	Authentication tokens
dotenv	Secure environment variables
cors	Cross-origin resource sharing
node-fetch	External API requests
mongoose	MongoDB ORM
nodemon	Auto restart for dev
🌎 Deployment Steps

Create a new repository on GitHub.

Run:

git init
git add .
git commit -m "E-Commerce Backend Setup"
git branch -M main
git remote add origin https://github.com/<your-username>/ecommerce_backend.git
git push -u origin main


Deploy to Render, Vercel, or Railway with MONGO_URI + JWT_SECRET in environment settings.

🏁 Testing with Postman
🔑 Auth Flow

POST /api/auth/register

POST /api/auth/login

🛒 Cart Flow

GET /api/users/cart

POST /api/users/cart

PUT /api/users/cart

DELETE /api/users/cart/:productId

📦 Orders

POST /api/orders

GET /api/orders

🧑‍🚀 Author

👨‍💻 Anand Kumar
📍 QSpiders | Dilsukhnagar | Full-Stack Developer
📧 anandkumar@example.com

🧡 Future Enhancements

🧾 Invoice PDF generation

💳 Payment Gateway Integration

🧮 Product Recommendations

📊 Admin Dashboard Analytics

🌐 Docker Deployment