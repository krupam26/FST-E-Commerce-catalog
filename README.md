This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
# E-Commerce Catalog Management System

A full-stack product catalog management application built with **Next.js, MongoDB, and Mongoose**. The application provides a dashboard for creating, viewing, editing, deleting, searching, and filtering products.

## Aim

To build an operational e-commerce catalog that connects a Next.js application to MongoDB through a Mongoose schema and REST API.

## Features

- Add, view, edit, and delete products
- Search by product name, brand, category, or SKU
- Filter products by category
- Track price, stock, brand, SKU, and product descriptions
- Optionally display product images
- Validate required fields and prevent duplicate SKUs
- Automatically store `createdAt` and `updatedAt` timestamps

## Technologies

| Technology | Purpose |
| --- | --- |
| Next.js App Router | Full-stack React framework and routing |
| React | Client-side user interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| MongoDB | Product database |
| Mongoose | MongoDB ODM, schema, and validation |
| Node.js | Runtime environment |

## Architecture

The client-side catalog page communicates with the `/api/products` route. The route connects to MongoDB through the shared Mongoose connection helper and reads or modifies documents in the `products` collection.

```text
React catalog page
				|
				v
Next.js API route: /api/products
				|
				v
Mongoose Product model
				|
				v
MongoDB products collection
```

## Project Structure

```text
ecommerce-catalog/
├── .env.local                 # Local MongoDB connection string
├── package.json
├── README.md
└── src/
		└── app/
				├── api/
				│   └── products/
				│       └── route.ts   # CRUD API handlers
				├── lib/
				│   └── mongodb.ts     # Cached MongoDB connection
				├── models/
				│   └── Product.ts     # Mongoose product schema
				├── globals.css
				├── layout.tsx
				└── page.tsx            # Catalog UI
```

## Database Schema

The `Product` model contains these fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | String | Yes | Product name |
| `description` | String | Yes | Product description |
| `price` | Number | Yes | Product price, minimum `0` |
| `category` | String | Yes | Product category |
| `brand` | String | Yes | Product brand |
| `stock` | Number | Yes | Available stock, minimum `0` |
| `sku` | String | Yes | Unique product identifier |
| `imageUrl` | String | No | Optional product image URL |
| `isActive` | Boolean | No | Product availability, defaults to `true` |
| `createdAt` | Date | Automatic | Creation timestamp |
| `updatedAt` | Date | Automatic | Last update timestamp |

Example document:

```json
{
	"name": "Wireless Headphones",
	"description": "Premium wireless headphones with noise cancellation.",
	"price": 4999,
	"category": "Electronics",
	"brand": "Sony",
	"stock": 25,
	"sku": "SONY-WH-001",
	"imageUrl": "https://example.com/headphones.jpg",
	"isActive": true
}
```

## API Endpoints

All endpoints use `/api/products`.

### Get all products

```http
GET /api/products
```

Returns products sorted by newest first.

### Create a product

```http
POST /api/products
Content-Type: application/json
```

```json
{
	"name": "Smart Watch",
	"description": "Fitness tracking smartwatch",
	"price": 2999,
	"category": "Wearables",
	"brand": "Boat",
	"stock": 40,
	"sku": "BOAT-SW-001",
	"imageUrl": "",
	"isActive": true
}
```

### Update a product

```http
PUT /api/products
Content-Type: application/json
```

Include the product ID and the fields to update:

```json
{
	"id": "PRODUCT_ID",
	"price": 3499,
	"stock": 30
}
```

### Delete a product

```http
DELETE /api/products
Content-Type: application/json
```

```json
{
	"id": "PRODUCT_ID"
}
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ecommerce
```

Replace the placeholders with your MongoDB Atlas credentials. Never commit `.env.local` or database credentials. Environment files are already excluded by `.gitignore`.

## Installation and Setup

1. Clone the repository:

	 ```bash
	 git clone https://github.com/krupam26/FST-E-Commerce-catalog.git
	 cd FST-E-Commerce-catalog
	 ```

2. Install dependencies:

	 ```bash
	 npm install
	 ```

3. Add `MONGODB_URI` to `.env.local`.

4. Start the development server:

	 ```bash
	 npm run dev
	 ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Concepts Demonstrated

1. Next.js App Router and API routes
2. React client components and state management
3. TypeScript interfaces and type-safe forms
4. REST API design and HTTP methods
5. CRUD operations
6. MongoDB database integration
7. Mongoose schemas, models, and validation
8. Environment variables
9. Client-server communication
10. Search, filtering, and responsive UI design

## Viva Questions

### What is MongoDB?

MongoDB is a NoSQL document database that stores data in flexible BSON documents.

### What is Mongoose?

Mongoose is an ODM library that provides schemas, models, validation, and query methods for MongoDB.

### What does CRUD mean?

`C`reate, `R`ead, `U`pdate, and `D`elete.

### Why is the SKU unique?

The SKU identifies a product in the catalog, so a unique constraint prevents duplicate product identifiers.

### Why are environment variables used?

They keep configuration such as the MongoDB connection string outside the source code and repository.

## Author

**Krupa Mehta**
Full Stack Technology Practical Project

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
