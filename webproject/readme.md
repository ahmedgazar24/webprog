# University Management System

A full-stack University Management System developed using **Angular 19** and **Laravel 12**. The application provides a centralized platform for managing university administrative and financial operations, including department budgets, student fees, invoices, and staff payroll.

## Features

- **User Authentication:** User registration, login, and protected routes.
- **Department Budget Management:** View and manage department budget information.
- **Student Fee Management:** Track student fees and manage invoices.
- **Invoice Payments:** View invoices and process fee payment requests.
- **Staff Payroll:** Dedicated interface for staff payroll management.
- **User Profiles:** User profile management and account information.

## Technologies Used

### Frontend
- Angular 19
- TypeScript
- HTML5
- CSS3
- RxJS
- Chart.js

### Backend
- PHP 8.2+
- Laravel 12
- RESTful API

### Development Tools
- Git
- npm
- Composer

## Project Structure

```text
webproject/
├── frontend/       # Angular application
│   └── src/
│       └── app/
│           ├── components/
│           ├── guards/
│           ├── models/
│           └── services/
│
└── backend/        # Laravel application
    ├── app/
    │   └── Http/
    │       └── Controllers/
    └── routes/
        └── api.php
```

## Installation and Setup

### Prerequisites

Make sure you have the following installed:
- Node.js and npm
- PHP 8.2 or later
- Composer
- A supported database configured for Laravel

### 1. Clone the Repository

```bash
git clone https://github.com/ahmedgazar24/webprog.git
cd webprog/webproject
```

### 2. Set Up the Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database credentials in the `.env` file, then run:

```bash
php artisan migrate
php artisan serve
```

The Laravel backend will be available at:

`http://127.0.0.1:8000`

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The Angular application will be available at:

`http://localhost:4200`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a user |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/departments` | Retrieve departments |
| GET | `/api/invoices` | Retrieve invoices |
| POST | `/api/invoices` | Create an invoice |
| POST | `/api/invoices/{id}/pay` | Process an invoice payment |

## Project Objective

The project aims to provide a centralized web-based solution for university administrative operations, improving the accessibility and organization of financial and management-related information.
