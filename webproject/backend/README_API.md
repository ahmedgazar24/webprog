# Backend API (Demo)

This Laravel backend exposes simple demo endpoints for the Angular frontend.

## Endpoints

- `POST /api/register` — Registers a user (demo only)
- `POST /api/login` — Logs in and returns a token (demo only)
- `GET /api/departments` — Lists department budgets
- `GET /api/invoices` — Lists student fee invoices
- `POST /api/invoices` — Creates an invoice
  - Body: `{ "studentId": number, "studentName": string, "amount": number }`
- `POST /api/invoices/{id}/pay` — Adds a payment to an invoice
  - Body (optional): `{ "amount": number }`

## Run Locally

Ensure PHP and Composer are installed.

```powershell
# From webproject/backend
composer install
php artisan key:generate
php artisan serve
```

The API will be served at `http://127.0.0.1:8000`.

## Quick Test (PowerShell)

```powershell
Invoke-RestMethod -Method GET -Uri http://127.0.0.1:8000/api/departments
Invoke-RestMethod -Method GET -Uri http://127.0.0.1:8000/api/invoices
Invoke-RestMethod -Method POST -Uri http://127.0.0.1:8000/api/invoices -ContentType application/json -Body '{"studentId":101,"studentName":"Ali Ahmed","amount":5000}'
```

## Frontend Integration Notes

Update Angular services to call the backend instead of local mocks.

- Departments: `GET /api/departments`
- Invoices:
  - List: `GET /api/invoices`
  - Create: `POST /api/invoices`
  - Pay: `POST /api/invoices/{id}/pay`
- Auth:
  - Register/Login already exist as demo endpoints; replace local storage login with these when ready.

Add base URL in an environment or service:

```ts
const BASE_URL = 'http://127.0.0.1:8000/api';
```

Use Angular `HttpClient` to call endpoints and map responses: `{ data: ... }`.
