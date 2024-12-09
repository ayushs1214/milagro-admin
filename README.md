# Milagro Admin Dashboard

A comprehensive admin dashboard for managing products, inventory, orders, and user interactions in the Milagro ecosystem. Built with React, TypeScript, and Tailwind CSS.

## Features

### Real-time Dashboard Analytics
- Live metrics for total users, active orders, revenue, and pending approvals
- Real-time revenue trend tracking
- User growth visualization
- User type distribution
- Order status monitoring
- All data synchronized with Supabase backend

### User Management
- User registration approval system
- Role-based access control (Superadmin, Admin, Dealer, Architect, Builder)
- User profile management
- Real-time user activity tracking

### Product Management
- Comprehensive product catalog
- Real-time inventory tracking
- Bulk product uploads
- Sample product management

### Order Management
- Real-time order processing and tracking
- Payment management
- Order status updates
- Delivery tracking

### Expo Management
- Exhibition and event management
- Participant registration
- Product showcase management

### Analytics & Reporting
- Real-time dashboard metrics
- Sales and revenue analytics
- Inventory reports
- User activity tracking

## Tech Stack

### Frontend
- React 18.x
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Charts)
- Zustand (State Management)

### Backend
- Supabase
  - Authentication
  - Real-time Database
  - Storage
  - Row Level Security
  - Edge Functions
  - Webhooks

### Development Tools
- Vite
- ESLint
- PostCSS
- Autoprefixer

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/milagro-admin.git
cd milagro-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Start the development server:
```bash
npm run dev
```

## Default Superadmin Login
```
Email: ayushietetsec@gmail.com
Password: Ayushsingh69@
```

## CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Continuous Integration (CI)
  - Code linting
  - Type checking
  - Unit tests
  - Security scanning
- Continuous Deployment (CD)
  - Automatic deployment to Netlify
  - Environment variable management
  - Build optimization

## Backend Architecture

### Database Schema
- Fully normalized database design
- Row Level Security (RLS) policies
- Real-time subscriptions
- Automated backups

### API Endpoints
- RESTful API design
- JWT authentication
- Rate limiting
- Error handling

### Real-time Features
- WebSocket connections
- Live updates
- Event handling
- Presence detection

### Storage
- Secure file uploads
- CDN integration
- Access control
- Image optimization

## Security Features

- JWT-based authentication
- Role-based access control
- Row Level Security
- Secure password handling
- XSS protection
- CORS configuration
- Rate limiting
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.