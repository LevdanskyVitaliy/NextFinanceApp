This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The project consists of two parts: **frontend** (Next.js) and **backend** (Express + SQLite).

### 1. Run the backend

```bash
cd src
npm install
npm start
```

The API will be available at [http://localhost:3000](http://localhost:3000).

### 2. Run the frontend

In a separate terminal:

```bash
npm run dev -- --port 3001
# or
yarn dev --port 3001
# or
pnpm dev --port 3001
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/transactions` | Get transactions (supports filters, sorting, pagination) |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions/:id` | Get transaction by id |
| PATCH | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

Query params for `GET /transactions`:
- `page`, `limit` — pagination
- `type` — filter by type (`income` / `expense`)
- `category` — filter by category id
- `sort_by`, `sort_order` — sorting (`date`, `amount`; `asc` / `desc`)

## Environment Variables

For production, set `NEXT_PUBLIC_API_URL` to point to your backend host.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

### Frontend (Vercel)

The easiest way to deploy the Next.js frontend is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Set environment variable `NEXT_PUBLIC_API_URL` to your backend URL.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Backend (Render / Railway / Fly.io)

The Express + SQLite backend needs persistent storage, so deploy it to a platform that supports it (Render, Railway, Fly.io, etc.).

Start command: `npm start` (from `src/` directory).

# financetracker
