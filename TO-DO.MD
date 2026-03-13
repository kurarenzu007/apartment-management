You are a senior React developer. Build a complete FRONTEND ONLY (no backend, 

use dummy/mock data) apartment management system using React + Vanilla CSS 

(no Tailwind, no UI libraries, no CSS frameworks). Use React Router for navigation.

=============================================================

🎨 DESIGN SYSTEM (apply consistently across ALL pages)

=============================================================

CSS Variables (define in index.css):

:root {

  --primary: #1A9E96;

  --primary-dark: #137A73;

  --primary-light: #E8F8F7;

  --primary-gradient: linear-gradient(135deg, #1A9E96, #0D6E68);

  --secondary: #2ECC71;

  --secondary-dark: #27AE60;

  --danger: #E74C3C;

  --danger-light: #FDECEA;

  --warning: #F39C12;

  --warning-light: #FEF9E7;

  --success: #2ECC71;

  --success-light: #EAFAF1;

  --sidebar-bg: linear-gradient(180deg, #0D6E68 0%, #1A9E96 100%);

  --bg-main: #F0F4F4;

  --bg-card: #FFFFFF;

  --text-dark: #1A2B2B;

  --text-muted: #7F8C8D;

  --text-light: #FFFFFF;

  --border: #E0EBER;

  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);

  --shadow-md: 0 4px 20px rgba(0,0,0,0.10);

  --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);

  --radius-sm: 8px;

  --radius-md: 12px;

  --radius-lg: 20px;

  --transition: all 0.25s ease;

}

Typography:

- Import from Google Fonts: 'Plus Jakarta Sans' (headings), 'Inter' (body)

- Page titles: 22px, 700, var(--text-dark)

- Card labels: 12px, 600, var(--text-muted), uppercase, letter-spacing: 0.5px

- Card values: 28px, 700, var(--text-dark)

- Table headers: 13px, 600, var(--text-dark)

- Body text: 14px, 400, var(--text-dark)

Design Rules:

- Sidebar: 240px wide, gradient background, white icons and text

- Active sidebar item: white bg with 0.15 opacity, left border 3px solid white

- All cards: white bg, border-radius var(--radius-md), box-shadow var(--shadow-sm)

- All buttons have hover transitions and cursor: pointer

- Tables: striped rows (odd: white, even: #F9FBFB), hover highlight

- Status badges: pill shape, colored background + text (no borders)

- Inputs: border 1.5px solid var(--border), radius var(--radius-sm), 

  focus: border-color var(--primary), box-shadow 0 0 0 3px rgba(26,158,150,0.1)

- Page layout: sidebar fixed left + main content scrollable right

=============================================================

📁 PROJECT STRUCTURE

=============================================================

src/

├── components/

│   ├── Sidebar.jsx + Sidebar.css

│   ├── Topbar.jsx + Topbar.css

│   ├── StatCard.jsx + StatCard.css

│   ├── Table.jsx + Table.css

│   ├── Modal.jsx + Modal.css

│   ├── Badge.jsx + Badge.css

│   └── Button.jsx + Button.css

├── pages/

│   ├── Login.jsx + Login.css

│   ├── admin/

│   │   ├── Dashboard.jsx + Dashboard.css

│   │   ├── tenants/

│   │   │   ├── ViewTenants.jsx + ViewTenants.css

│   │   │   ├── TenantDetail.jsx + TenantDetail.css

│   │   │   └── AddTenant.jsx + AddTenant.css

└── App.jsx (with React Router setup)

=============================================================

🔐 PAGE 1: LOGIN PAGE

=============================================================

File: pages/Login.jsx + Login.css

Layout:

- Full viewport height, two-column layout (60/40 split)

- LEFT SIDE (60%): 

  - Full-height background image of modern apartments 

    (use: https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200)

  - Dark overlay gradient: linear-gradient(135deg, rgba(13,110,104,0.85), rgba(26,158,150,0.6))

  - Centered content over image:

    - Building icon (use SVG or emoji 🏢) 

    - App name: "JJJ APARTMENT" (large, bold, white)

    - Tagline: "Smart Apartment Management" (smaller, white, 0.8 opacity)

    - Three feature pills below: "📊 Dashboard" "👥 Tenants" "💰 Rent Tracking"

      (semi-transparent white pills with blur backdrop)

- RIGHT SIDE (40%):

  - White background, vertically centered form

  - Top: Small logo circle (teal gradient bg, white building icon)

  - Title: "Welcome back" (24px, bold)

  - Subtitle: "Sign in to your account" (muted)

  - Form fields with floating labels (label animates up on focus/fill):

    ✉️ Email Address (type="email")

    🔒 Password (type="password" with show/hide toggle eye icon)

    👤 User Type dropdown: "--Select User Type--", "Admin", "Tenant"

  - "Forgot password?" link (right-aligned, teal color)

  - LOGIN button: full width, teal gradient, white text, 48px height

    hover: slight scale(1.01) + deeper shadow

  - Bottom: language switcher (EN | FIL)

States to implement:

const [email, setEmail] = useState('')

const [password, setPassword] = useState('')  

const [showPassword, setShowPassword] = useState(false)

const [userType, setUserType] = useState('')

const [language, setLanguage] = useState('EN')

const [errors, setErrors] = useState({})

const [loading, setLoading] = useState(false)

Functions:

- validateLoginForm(): checks empty fields, email format

- handleLogin(): validates, sets loading true for 1.5s (simulate), 

  then redirects:

  - if userType === 'Admin' → /admin/dashboard

  - if userType === 'Tenant' → /tenant/dashboard

- handleShowPassword(): toggles password visibility

- handleForgotPassword(): shows an inline alert "Reset link sent!" (mock)

=============================================================

🏗️ SHARED LAYOUT: AdminLayout.jsx

=============================================================

Create a shared layout with:

SIDEBAR (240px, fixed, full height):

- Top: Logo circle + "JJJ APARTMENT" text

- User pill: avatar circle + "Admin" label

- Navigation items with icons:

  📊 Dashboard → /admin/dashboard

  👥 Tenants → /admin/tenants  

  🏠 Units → /admin/units

  👤 Owner Info → /admin/owner

  💰 Rent Collection → /admin/rent

  🔧 Maintenance → /admin/maintenance

  💬 Complaints → /admin/complaints

  📈 Reports → /admin/reports

  ⚙️ Settings → /admin/settings

- Active state: white bg at 15% opacity, white left border 3px

- Bottom: Logout button (red tint on hover)

TOPBAR (fixed top, spans main content):

- Height: 64px, white bg, subtle bottom border

- Left: Hamburger menu (for future mobile) + Page title (dynamic)

- Center: Search bar (rounded, light gray bg, 320px wide)

- Right: 

  - Bell icon with notification badge (count: 3)

  - Avatar circle with dropdown arrow

  - Dropdown on avatar click: Profile, Settings, Logout

=============================================================

📊 PAGE 2: ADMIN DASHBOARD

=============================================================

File: pages/admin/Dashboard.jsx

MOCK DATA:

const mockStats = {

  totalApartments: 24,

  totalHouses: 2,

  totalVacancies: 8,

  totalTenants: 18,

  totalRentCollection: 101000,

  paymentCollected: 2,

  maintenance: 0,

  totalComplaints: 3

}

const mockUpcomingDues = [

  { unitId: 'A-1', tenantName: 'Smith Don', dueDate: '12/12/2025', amount: 2500 },

  { unitId: 'H-2', tenantName: 'Mike Conley', dueDate: '12/31/2025', amount: 11500 },

  { unitId: 'A-14', tenantName: 'John Doe', dueDate: '12/15/2025', amount: 3000 },

]

const mockExceededDues = [

  { unitId: 'A-3', tenantName: 'Ana Reyes', dueDate: '11/01/2025', amount: 4500 },

  { unitId: 'A-7', tenantName: 'Carlo Santos', dueDate: '10/15/2025', amount: 2800 },

]

LAYOUT (top to bottom):

1. STATS GRID (2 rows × 4 columns):

Row 1:

  🏢 Total Apartment | 24 | teal icon bg

  🏠 Total House     | 2  | blue icon bg  

  🛏️ Total Vacancies | 8  | orange icon bg

  👥 Total Tenant    | 18 | purple icon bg

Row 2:

  💰 Total Rent Collection | ₱101,000 | green icon bg

  ✅ Payment Collected     | 2        | teal icon bg

  🔧 Maintenance           | 0        | yellow icon bg

  💬 Total Complain        | 3        | red icon bg

Card style:

- White bg, border-radius 12px, padding 20px

- Left: colored icon circle (48px, lighter version of accent color)

- Right: label (12px muted uppercase) + value (28px bold)

- Subtle left border (3px) matching the icon color

- Hover: translateY(-2px) + stronger shadow

2. TABS SECTION below stats:

Two pill tabs: [Upcoming Due Date] [Exceeded due dates]

- Active tab: teal bg, white text

- Inactive: light gray bg

Tab content: styled table

Columns: Unit ID | Tenant Name | Due Date | Amount Due | Status

- Upcoming: show "Due Soon" badge (yellow)

- Exceeded: show "Overdue" badge (red)

- Add a "Print" button top-right of table (gray, outline style)

- Pagination: "Pages 1 of 2" with prev/next arrows

States:

const [activeTab, setActiveTab] = useState('upcoming')

const [searchQuery, setSearchQuery] = useState('')

const [currentPage, setCurrentPage] = useState(1)

Functions:

- handleTabSwitch(tab): switches between upcoming/exceeded

- handleSearch(e): filters table by tenant name or unit ID

- handlePrintGraph(): window.print() mock

- handlePageChange(page): updates currentPage

=============================================================

👥 PAGE 3A: VIEW TENANTS PAGE

=============================================================

File: pages/admin/tenants/ViewTenants.jsx

MOCK DATA:

const mockTenants = [

  {

    id: 1,

    username: 'tenant1',

    name: 'Ten Nant',

    email: 'sample@email.com',

    contact: '09234534335',

    address: 'Adelina',

    unit: 'Apartment 1',

    status: 'active',

    paymentHistory: [

      { date: '01/01/2026', monthlyRent: 5500, method: 'Cash', period: 'Jan 2026', balance: 0, remarks: 'Paid On Time' },

      { date: '02/01/2026', monthlyRent: 5500, method: 'Cash', period: 'Feb 2026', balance: 0, remarks: 'Paid On Time' },

      { date: '03/01/2026', monthlyRent: 5500, method: 'Gcash', period: 'Mar 2026', balance: 0, remarks: 'Paid On Time' },

      { date: '04/01/2026', monthlyRent: 5500, method: 'Bank Transfer', period: 'Apr 2026', balance: 0, remarks: 'Final Payment' },

    ]

  },

  {

    id: 2,

    username: 'tenant2',

    name: 'Nan Tent',

    email: 'sample@email.com',

    contact: '09123456891',

    address: 'Orange Apt',

    unit: 'Apartment 24',

    status: 'active',

    paymentHistory: [

      { date: '01/01/2026', monthlyRent: 4000, method: 'Cash', period: 'Jan 2026', balance: 0, remarks: 'Paid On Time' },

    ]

  },

]

LAYOUT:

- Page title: "Tenant Management" with breadcrumb: Home > Tenants

- Top bar: 

  Left: "Show [3▼] entries" dropdown

  Right: Search input + "➕ Add Tenant" button (teal, prominent)

TABLE COLUMNS:

Username | Name | Email | Contact | Address | Unit | Status | Actions

- No password column (removed for security ✅)

- Status badge: "Active" (green pill) or "Archived" (gray pill)

- Actions column: three icon buttons:

  👁️ View (teal) | ✏️ Edit (blue) | 📦 Archive (orange) — NO delete

TABLE FEATURES:

- Sortable columns (click header to sort asc/desc, show ↕ arrow)

- Hover row highlight

- Striped rows

- Responsive horizontal scroll on overflow

States:

const [tenants, setTenants] = useState(mockTenants)

const [searchQuery, setSearchQuery] = useState('')

const [showEntries, setShowEntries] = useState(3)

const [currentPage, setCurrentPage] = useState(1)

const [sortField, setSortField] = useState('')

const [sortDirection, setSortDirection] = useState('asc')

const [selectedTenant, setSelectedTenant] = useState(null)

const [viewModalOpen, setViewModalOpen] = useState(false)

const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)

const [tenantToArchive, setTenantToArchive] = useState(null)

Functions:

- fetchAllTenants(): sets mock data to state

- handleSearch(e): filters tenants by name, email, or unit

- handleSort(field): toggles asc/desc sort on field

- handleShowEntries(n): changes rows per page

- handlePageChange(page): pagination

- handleViewTenant(tenant): sets selectedTenant, opens view modal

- handleEditTenant(tenant): opens edit modal (basic, just show alert for now)

- handleArchiveTenant(tenant): opens confirm dialog, on confirm 

  sets tenant status to 'archived'

- handleCreateNew(): navigates to /admin/tenants/add

VIEW MODAL (when 👁️ clicked):

- Slide-in modal from the right OR centered modal

- Header: tenant name + "Tenant Details" label, teal bg

- Section 1 - Tenant Info cards:

  Name | Email | Contact | Unit | Address | Status

- Section 2 - Payment History table:

  Columns: Payment Date | Monthly Rent | Payment Method | Billing Period | Balance | Remarks

  - Remarks badge color:

    "Paid On Time" → green

    "Final Payment" → teal/blue  

    "Late" → orange

    "Unpaid" → red

- Close button (X) top right

=============================================================

👥 PAGE 3B: ADD TENANT (Multi-Step Form)

=============================================================

File: pages/admin/tenants/AddTenant.jsx

STEP INDICATOR at top:

[1] Personal Info → [2] Stay Details → [3] Account Setup

- Active step: filled teal circle with white number

- Completed step: teal circle with ✓ checkmark  

- Future step: gray outline circle

- Connected by a horizontal line (gray → teal when completed)

───────────────────────────────

STEP 1: Personal Information

───────────────────────────────

Two-column grid layout:

Left column:

  Full Name *        → text input

  Email Address *    → email input

  Contact Number *   → tel input (placeholder: 09XX-XXXX-XXXX)

Right column:

  Date of Birth *    → date input

  Occupation         → text input (optional)

Bottom: [Next →] button (teal, right-aligned)

Validation:

- Full Name: required, min 2 chars

- Email: required, valid email format

- Contact: required, must start with 09, 11 digits

- Date of Birth: required, must be 18+ years old

- Show inline error messages in red below each field

───────────────────────────────

STEP 2: Stay Details & Contract

───────────────────────────────

Two-column grid:

Left column:

  Apartment Type * → dropdown:

    "-- Select Type --"

    "Studio Apartment"

    "House Apartment"  

    "Commercial Front"

    "Commercial Back"

    "Room"

  Duration of Stay * → dropdown:

    "-- Select Duration --"

    "6 months"

    "12 months"