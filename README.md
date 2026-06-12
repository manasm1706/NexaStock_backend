# NexaStock Backend

TypeScript backend for the NexaStock inventory platform.

## What is included

- Versioned REST API under `/api/v1`
- Tenant-aware request context
- Role-aware auth tokens
- Seeded in-memory data for development
- Modules for auth, onboarding, tenants, users, products, suppliers, inventory, warehouse dispatch, POS, analytics, AI, settings, and audit

## Development

1. Install dependencies:

```bash
npm install
```

2. Run the API in watch mode:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Start the compiled server:

```bash
npm start
```

## Environment

Copy `.env.example` to `.env` and adjust values for your environment.
"# NexaStock_backend" 
