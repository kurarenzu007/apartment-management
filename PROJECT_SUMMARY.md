# JJJ Apartment Management System

A complete frontend-only apartment management system built with React + Vanilla CSS.

## ✅ Completed Features

### 🎨 Design System
- Custom CSS variables for consistent theming
- Google Fonts: 'Plus Jakarta Sans' (headings) + 'Inter' (body)
- Teal/green color scheme with gradients
- Responsive design with proper spacing and shadows

### 🔐 Authentication
- **Login Page** with split layout (60/40)
  - Left: Hero image with overlay and feature pills
  - Right: Login form with email, password, user type selection
  - Form validation
  - Language switcher (EN/FIL)
  - Forgot password functionality

### 📊 Admin Dashboard
- **Stats Grid** (8 cards in 2 rows × 4 columns):
  - Total Apartments, Houses, Vacancies, Tenants
  - Rent Collection, Payments, Maintenance, Complaints
- **Dues Management**:
  - Tabbed interface (Upcoming / Exceeded due dates)
  - Searchable table with pagination
  - Print functionality
  - Status badges (Due Soon / Overdue)

### 👥 Tenant Management
- **View Tenants Page**:
  - Sortable table with all tenant information
  - Search functionality
  - Show entries dropdown (3/5/10)
  - Action buttons: View, Edit, Archive
  - View Modal with tenant details + payment history
  - Archive confirmation modal
  - No delete option (security best practice)

- **Add Tenant Page** (Multi-step form):
  - Step 1: Personal Information (name, email, contact, DOB, occupation)
  - Step 2: Stay Details (apartment type, duration)
  - Step 3: Account Setup (username, password)
  - Step indicator with progress visualization
  - Form validation at each step
  - Back/Next navigation

### 🧩 Reusable Components
- **Layout Components**: Sidebar, Topbar, AdminLayout
- **UI Components**: StatCard, Badge, Button, Modal, Table

## 🚀 How to Run

```bash
cd rent-connect
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## 🔑 Test Login

- Email: any valid email format
- Password: any password
- User Type: Select "Admin" to access admin dashboard

## 📁 Improved Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.jsx + Sidebar.css
│   │   ├── Topbar.jsx + Topbar.css
│   │   └── index.js         # Barrel export
│   └── ui/                  # Reusable UI components
│       ├── Badge.jsx + Badge.css
│       ├── Button.jsx + Button.css
│       ├── Modal.jsx + Modal.css
│       ├── StatCard.jsx + StatCard.css
│       ├── Table.jsx + Table.css
│       └── index.js         # Barrel export
├── constants/
│   └── index.js             # App constants (routes, types, status)
├── data/
│   └── mockData.js          # Mock data for development
├── layouts/
│   ├── AdminLayout.jsx      # Admin layout wrapper
│   └── AdminLayout.css
├── pages/
│   ├── auth/
│   │   ├── Login.jsx + Login.css
│   └── admin/
│       ├── Dashboard.jsx + Dashboard.css
│       └── tenants/
│           ├── ViewTenants.jsx + ViewTenants.css
│           └── AddTenant.jsx + AddTenant.css
├── utils/
│   ├── helpers.js           # Helper functions
│   ├── validation.js        # Validation utilities
│   └── index.js             # Barrel export
├── App.jsx                  # React Router setup
├── App.css
├── index.css                # Design system variables
└── main.jsx
```

## 🎯 Key Improvements

### Better Organization
- ✅ Separated layout and UI components
- ✅ Created dedicated folders for constants, data, utils
- ✅ Barrel exports for cleaner imports
- ✅ Centralized mock data
- ✅ Reusable validation and helper functions

### Code Quality
- ✅ Constants for routes, types, and status values
- ✅ Utility functions for common operations
- ✅ Consistent import patterns
- ✅ Better separation of concerns
- ✅ Scalable folder structure

### Developer Experience
- ✅ Easy to find and modify components
- ✅ Clear separation between pages and components
- ✅ Reusable utilities and constants
- ✅ Clean import statements using barrel exports

## 📝 Example Imports

```javascript
// Before
import Sidebar from '../../../components/Sidebar';
import Button from '../../../components/Button';

// After (using barrel exports)
import { Sidebar, Topbar } from '../../../components/layout';
import { Button, Badge, Modal } from '../../../components/ui';
import { ROUTES, USER_TYPES } from '../../../constants';
import { validateEmail, formatCurrency } from '../../../utils';
```

## 🎯 Key Features

- ✅ No backend required (uses mock data)
- ✅ Pure vanilla CSS (no Tailwind, no UI libraries)
- ✅ React Router for navigation
- ✅ Form validation with utility functions
- ✅ Responsive design
- ✅ Consistent design system
- ✅ Hover effects and transitions
- ✅ Modal dialogs
- ✅ Multi-step forms
- ✅ Sortable tables
- ✅ Search functionality
- ✅ Status badges
- ✅ Well-organized folder structure
- ✅ Reusable utilities and constants

## 📝 Notes

- All data is mock/dummy data stored in `src/data/mockData.js`
- Placeholder routes exist for other admin pages (Units, Owner Info, Rent Collection, etc.)
- Tenant dashboard route exists but shows "Coming Soon"
- Edit tenant functionality shows an alert (not fully implemented)
- Archive functionality updates tenant status to 'archived'
- Constants are centralized in `src/constants/index.js`
- Validation utilities are in `src/utils/validation.js`
- Helper functions are in `src/utils/helpers.js`
