# Milagro Admin Dashboard - API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication

All endpoints except `/auth/login` require JWT authentication.

### Headers
```http
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### Login
```http
POST /auth/login

Request Headers:
Content-Type: application/json

Request Body:
{
  "email": "ayushietetsec@gmail.com",
  "password": "Ayushsingh69@"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Super Admin",
    "email": "ayushietetsec@gmail.com",
    "role": "superadmin",
    "status": "active",
    "avatar": "url_to_avatar",
    "createdAt": "2024-03-15T10:30:00Z",
    "lastLogin": "2024-03-15T10:30:00Z"
  }
}

Response 401:
{
  "error": "Invalid credentials"
}
```

### User Management

#### List Users
```http
GET /users

Query Parameters:
- page (optional): Current page number (default: 1)
- limit (optional): Items per page (default: 10)
- role (optional): Filter by role (dealer, architect, builder)
- status (optional): Filter by status (active, inactive, pending)
- search (optional): Search by name or email

Response 200:
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "dealer",
      "status": "active",
      "avatar": "url_to_avatar",
      "businessInfo": {
        "companyName": "Doe Enterprises",
        "phone": "+91 98765 43210",
        "gstNumber": "29ABCDE1234F1Z5",
        "panNumber": "ABCDE1234F",
        "address": "123 Business District, Mumbai"
      },
      "createdAt": "2024-03-15T10:30:00Z",
      "lastLogin": "2024-03-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

[Rest of the API documentation remains unchanged]

## Webhooks

### Order Webhooks
```http
POST /webhooks/order

Headers:
X-Webhook-Secret: your-webhook-secret

Body:
{
  "type": "order.created|order.updated|order.deleted",
  "order": {
    "id": "1",
    "status": "pending",
    ...
  }
}
```

### Payment Webhooks
```http
POST /webhooks/payment

Headers:
X-Webhook-Secret: your-webhook-secret

Body:
{
  "type": "payment.succeeded|payment.failed",
  "payment": {
    "id": "1",
    "orderId": "1",
    "status": "succeeded",
    ...
  }
}
```

## Real-time Subscriptions

### Order Updates
```typescript
supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      // Handle order updates
    }
  )
  .subscribe();
```

### Inventory Updates
```typescript
supabase
  .channel('inventory')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      // Handle inventory updates
    }
  )
  .subscribe();
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. Headers included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1623456789
```

## Error Responses

All endpoints may return these error responses:

```http
401 Unauthorized:
{
  "error": "Authentication required"
}

403 Forbidden:
{
  "error": "Insufficient permissions"
}

404 Not Found:
{
  "error": "Resource not found"
}

422 Validation Error:
{
  "error": "Validation failed",
  "details": {
    "field": ["error message"]
  }
}

500 Server Error:
{
  "error": "Internal server error"
}
```