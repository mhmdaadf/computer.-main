# Custom Computer Parts Store

Production-ready full-stack e-commerce platform built with Django REST Framework, Next.js, PostgreSQL, JWT authentication, Tailwind CSS, and React Query.

## 1) Full Folder Structure

```text
.
├── backend
│   ├── .env.example
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── apps
│   │   ├── core
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── exceptions.py
│   │   │   ├── models.py
│   │   │   ├── renderers.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── users
│   │   │   ├── admin.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── products
│   │   │   ├── admin.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── cart
│   │   │   ├── admin.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── services.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   └── orders
│   │       ├── admin.py
│   │       ├── models.py
│   │       ├── serializers.py
│   │       ├── services.py
│   │       ├── urls.py
│   │       └── views.py
│   ├── config
│   │   ├── settings.py
│   │   └── urls.py
│   └── templates
│       └── admin
│           └── orders
│               └── order
│                   └── change_list.html
├── frontend
│   ├── .env.local.example
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products
│   │   │   ├── page.tsx
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── cart
│   │   │   └── page.tsx
│   │   ├── checkout
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components
│   │   ├── FilterSidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks
│   │   └── useAuth.ts
│   ├── lib
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types
│       └── index.ts
├── docker-compose.yml
└── README.md
```

## 2) Key Backend Files (Implemented)

### Domain models
- `backend/apps/users/models.py`
- `backend/apps/products/models.py`
- `backend/apps/cart/models.py`
- `backend/apps/orders/models.py`
- `backend/apps/core/models.py`

### API layer
- `backend/apps/*/serializers.py`
- `backend/apps/*/views.py`
- `backend/apps/*/urls.py`

### Core infrastructure
- `backend/config/settings.py`
- `backend/apps/core/exceptions.py` (global error handling)
- `backend/apps/core/renderers.py` (standard API response envelope)

### Admin
- CRUD for users/products/categories/orders/cart/contact
- Order analytics in admin changelist: total sales + orders count

## 3) Key Frontend Files (Implemented)

### App routes/pages
- Home, Products, Product Details, Cart, Checkout, Login, Register, Dashboard, Contact

### Shared logic
- `frontend/lib/api.ts` (JWT + refresh interceptor)
- `frontend/lib/auth.ts` (token/user persistence)
- `frontend/app/providers.tsx` (React Query provider)

### UI components
- `frontend/components/Navbar.tsx`
- `frontend/components/ProductCard.tsx`
- `frontend/components/FilterSidebar.tsx`
- `frontend/components/ProtectedRoute.tsx`

## 4) Step-by-Step Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+

### Backend setup
1. `cd backend`
2. Create virtual environment:
   - Windows: `python -m venv .venv && .venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy env file:
   - `copy .env.example .env` (Windows)
5. Update database credentials in `.env`
6. Run migrations:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
7. Create admin user: `python manage.py createsuperuser`
8. Start backend: `python manage.py runserver`

Backend URL: `http://127.0.0.1:8000`

### Frontend setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Copy env file:
   - `copy .env.local.example .env.local` (Windows)
4. Start frontend: `npm run dev`

Frontend URL: `http://localhost:3000`

### Docker setup (optional)
1. From project root: `docker compose up --build`
2. Backend: `http://127.0.0.1:8000`
3. Frontend: `http://localhost:3000`

## 5) API Endpoint List

Base URL: `http://127.0.0.1:8000/api`

### Auth
- `POST /auth/register/`
- `POST /auth/login/`
- `POST /auth/refresh/`

### User
- `GET /auth/profile/`
- `PUT/PATCH /auth/profile/`
- `GET /auth/addresses/`
- `POST /auth/addresses/`
- `GET /auth/addresses/{id}/`
- `PUT/PATCH /auth/addresses/{id}/`
- `DELETE /auth/addresses/{id}/`

### Products
- `GET /products/` (pagination + filter + search + ordering)
- `GET /products/{slug}/`
- `GET /products/categories/`

Supported product query params:
- `search`
- `category`
- `brand`
- `compatibility_tag`
- `min_price`
- `max_price`
- `ordering`
- `page`

### Cart
- `GET /cart/`
- `POST /cart/add/`
- `PATCH /cart/items/{item_id}/`
- `DELETE /cart/items/{item_id}/remove/`

### Orders
- `POST /orders/checkout/`
- `GET /orders/`
- `GET /orders/{id}/`

### Contact
- `POST /contact/`

## 6) Postman Example Requests

### Register
`POST /api/auth/register/`

```json
{
  "email": "user@example.com",
  "username": "builder01",
  "full_name": "Build Master",
  "phone": "+1-202-555-0133",
  "password": "StrongPass123!"
}
```

### Login (JWT)
`POST /api/auth/login/`

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

### Create Address
`POST /api/auth/addresses/`
Header: `Authorization: Bearer <access_token>`

```json
{
  "label": "Home",
  "line1": "123 Silicon Ave",
  "line2": "Apt 5",
  "city": "Austin",
  "state": "TX",
  "postal_code": "73301",
  "country": "USA",
  "is_default": true
}
```

### Product Search/Filter
`GET /api/products/?search=ryzen&category=cpu&min_price=100&max_price=800&brand=amd&compatibility_tag=AM5&page=1`

### Add to Cart
`POST /api/cart/add/`
Header: `Authorization: Bearer <access_token>`

```json
{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
`PATCH /api/cart/items/1/`
Header: `Authorization: Bearer <access_token>`

```json
{
  "quantity": 3
}
```

### Checkout
`POST /api/orders/checkout/`
Header: `Authorization: Bearer <access_token>`

```json
{
  "address_id": 1
}
```

### Contact Message
`POST /api/contact/`

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "subject": "Compatibility question",
  "message": "Is this DDR5 RAM compatible with AM5 motherboards?"
}
```

## 7) Business Rules Implemented

- Exactly one active cart per user
- Stock validation before checkout
- Checkout atomically converts cart to order
- Unit price and total price snapshot stored permanently in order items/order
- Out-of-stock ordering blocked
- JWT auth + token refresh
- Standard API response format for success and errors

## 8) Production Notes

- Use `gunicorn` for Django serving in production
- Configure static/media storage (S3 or CDN) for cloud deployments
- Add HTTPS, secure cookies, strict CORS, and rotated secrets in real environments
- Consider Celery for async tasks (emails, order events, inventory sync)


admin 
: admin@circuitcartel.local
Password: Admin#2026Store!


.env
:DEBUG=True
SECRET_KEY=change-me
ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=parts_store
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
USE_SQLITE=True
