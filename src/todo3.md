You are continuing to build the "JJJ Apartment" management system.
The existing project already has:
- Design system CSS variables in index.css (--primary, --danger, etc.)
- Shared components: Sidebar, Topbar, StatCard, Badge, Button, Modal, Toast
- Fonts: Plus Jakarta Sans + Inter
- React Router v6, Vanilla CSS ONLY
- Pages: Login, Dashboard, Tenants, Units, 
  RentCollection, Maintenance, Complaints

DO NOT rewrite existing files. Only ADD these two new pages:
src/pages/admin/Reports.jsx + Reports.css
src/pages/admin/Settings.jsx + Settings.css

Both pages use AdminLayout (same Sidebar + Topbar as other pages).
Routes already exist — just build the page content.

=============================================================
📈 PAGE 1: REPORTS
=============================================================

Route: /admin/reports

───────────────────────────────
MOCK DATA:
───────────────────────────────
const mockMonthlyData = [
  { month: 'Jan', paid: 24, missed: 2, late: 1, 
    rentTotal: 85000, maintenanceTotal: 3500 },
  { month: 'Feb', paid: 22, missed: 3, late: 2, 
    rentTotal: 78000, maintenanceTotal: 2000 },
  { month: 'Mar', paid: 26, missed: 1, late: 0, 
    rentTotal: 101000, maintenanceTotal: 7000 },
  { month: 'Apr', paid: 24, missed: 2, late: 1, 
    rentTotal: 92000, maintenanceTotal: 4500 },
  { month: 'May', paid: 24, missed: 0, late: 3, 
    rentTotal: 95000, maintenanceTotal: 1500 },
]

───────────────────────────────
LAYOUT:
───────────────────────────────

1. PAGE HEADER:
   Title: "Reports" + breadcrumb: Home > Reports
   Right side: 
   - Year dropdown: [2026 ▼] (options: 2024, 2025, 2026)
   - Month dropdown: [All Months ▼]
   - "📤 Export PDF" button (gray outline)

2. SUMMARY CARDS (3 cards, same style as Dashboard):
   💰 Total Rent Collected | sum of rentTotal | green
   🔧 Maintenance Fees     | sum of maintenanceTotal | orange
   📊 Overall Total        | sum of both | teal

3. BAR CHART (built with pure CSS + divs, NO chart library):

   Title: "Monthly Payment Overview"
   Legend: 
   ● Paid (teal) ● Missed (red) ● Late (orange)

   Chart area:
   - Y-axis: 0 to 30 (auto scale to max value)
   - X-axis: month labels (Jan, Feb, Mar...)
   - Each month: 3 bars side by side (Paid/Missed/Late)
   - Bar colors:
     Paid   → var(--primary) teal
     Missed → var(--danger) red
     Late   → var(--warning) orange
   - Bars have height proportional to value
   - Hover on bar: show tooltip 
     "[Month] [Type]: [value] tenants"
     (CSS :hover + position absolute tooltip)
   - Bar labels: value number on top of each bar
   - Smooth grow animation on load:
     @keyframes growUp { 
       from { height: 0 } 
       to { height: [computed]% } 
     }

4. SUMMARY TABLE below chart:
   Title: "Revenue Breakdown"
   
   Columns: Month | Rent Collected | Maintenance | Total | vs Last Month
   
   "vs Last Month" column:
   - If higher than previous month: "▲ X%" (green)
   - If lower: "▼ X%" (red)
   - First month: "—"
   
   Table footer (totals row, bold, teal bg):
   TOTAL | ₱sum | ₱sum | ₱sum | —

5. PAYMENT STATUS BREAKDOWN (below table):
   Title: "Payment Status Summary"
   
   Simple horizontal bar (progress-bar style) for each month:
   Shows proportion of Paid vs Late vs Missed visually
   [████████░░░░] Jan: 24 paid, 2 missed, 1 late
   
   Full-width bar divided into colored segments:
   Paid = teal | Late = orange | Missed = red
   Percentage labels inside each segment if wide enough

───────────────────────────────
STATES:
───────────────────────────────
const [data, setData] = useState(mockMonthlyData)
const [selectedYear, setSelectedYear] = useState('2026')
const [selectedMonth, setSelectedMonth] = useState('all')
const [hoveredBar, setHoveredBar] = useState(null)

───────────────────────────────
FUNCTIONS:
───────────────────────────────
- computeSummary(): returns total rent, maintenance, overall
- filterData(): filters by selectedMonth
- computePercentChange(current, previous): 
  returns percentage string like "▲ 12%" or "▼ 5%"
- handleExport(): window.alert('Export coming soon!')
- getBarHeight(value, max): 
  returns percentage string for CSS height
  e.g. (value / max) * 100 + '%'

=============================================================
⚙️ PAGE 2: SETTINGS
=============================================================

Route: /admin/settings

───────────────────────────────
LAYOUT (two-column):
───────────────────────────────

Left column (260px, fixed): 
  Settings menu card (white, rounded, shadow)
  Menu items (clickable, highlight active):
  🏢 Business Profile
  🔒 Password & Security
  👥 Manage Accounts
  📄 Contract Template
  ─────────────────
  🚪 Log Out (red text, at bottom)

Right column (flex: 1):
  Shows the active section content

───────────────────────────────
SECTION 1: Business Profile (default active)
───────────────────────────────
Title: "Business Profile"

Form layout:

Logo area (top):
- Current logo circle preview (80px, teal gradient, 🏢 icon)
- "Change Logo" button (outline) → file input (accept: image/*)
- "Remove Logo" link (red, small) — only shows if logo exists
- After upload: show image preview in the circle

Form fields below logo:
- Business Name: text input (pre-filled: "JJJ Apartment")
- Contact Number: tel input
- Email Address: email input
- Address: text input
- About Us: textarea (4 rows)
  pre-filled: "The Basmayor's Apartment was established 
  in 2005 by Mrs. Eliza Basmayor and Mr. Jun Basmayor..."

[💾 Save Changes] button (teal, right-aligned)
On save: show Toast "✅ Business profile updated!"

───────────────────────────────
SECTION 2: Password & Security
───────────────────────────────
Title: "Password & Security"

Form:
- Current Password: password input + show/hide toggle
- New Password: password input + show/hide toggle
  Password strength bar below (Weak/Fair/Strong)
- Confirm New Password: password input + show/hide toggle

Validation:
- Current password required
- New password min 8 chars, 1 uppercase, 1 number, 1 special
- Confirm must match new password
- Show inline errors below each field

[🔒 Update Password] button (teal)
On success: Toast "✅ Password updated successfully!"
On error: Toast "❌ Passwords do not match"

───────────────────────────────
SECTION 3: Manage Accounts
───────────────────────────────
Title: "Manage Accounts"

MOCK tenant list (simple):
const mockAccounts = [
  { id: 1, name: 'Ten Nant', username: 'tenant1', 
    unit: 'Apartment 1', status: 'active' },
  { id: 2, name: 'Nan Tent', username: 'tenant2', 
    unit: 'Apartment 24', status: 'active' },
  { id: 3, name: 'Old Tenant', username: 'tenant3', 
    unit: 'N/A', status: 'archived' },
]

Simple table:
Columns: Name | Username | Unit | Status | Actions

Actions:
- Active tenants: [📦 Archive] (orange outline)
- Archived tenants: [♻️ Restore] (green outline)

Archive: opens confirm dialog
  "Archive [name]? They will lose system access."
  [Cancel] [Archive] (orange)

Restore: directly restores + toast

───────────────────────────────
SECTION 4: Contract Template
───────────────────────────────
Title: "Contract Template"

Subtitle (muted): 
"This template is used when adding new tenants."

Large textarea (12 rows):
Pre-filled with:
"THIS AGREEMENT made this [DATE], by and between 
JJJ's Apartment, herein called 'Landlord,' and 
[TENANT NAME], herein called 'Tenant.' Landlord 
hereby agrees to rent to Tenant the dwelling located 
at [ADDRESS] under the following terms and conditions..."

Note below textarea (info box, blue tint):
"ℹ️ Use placeholders: [DATE], [TENANT NAME], 
[ADDRESS], [RENT AMOUNT], [START DATE], [END DATE]"

[💾 Save Template] button (teal)
On save: Toast "✅ Contract template saved!"

───────────────────────────────
LOG OUT (bottom of left menu):
───────────────────────────────
Clicking "🚪 Log Out":
Opens a simple confirm dialog:
  Title: "Log Out"
  Message: "Are you sure you want to log out?"
  [Cancel] [Log Out] (red)
On confirm: navigate('/login')

───────────────────────────────
STATES:
───────────────────────────────
const [activeSection, setActiveSection] = useState('profile')
const [logoPreview, setLogoPreview] = useState(null)
const [profileForm, setProfileForm] = useState({
  businessName: 'JJJ Apartment',
  contact: '',
  email: '',
  address: '',
  aboutUs: "The Basmayor's Apartment was established in 2005..."
})
const [passwordForm, setPasswordForm] = useState({
  current: '', newPass: '', confirm: ''
})
const [passwordStrength, setPasswordStrength] = useState(0)
const [showPasswords, setShowPasswords] = useState({
  current: false, newPass: false, confirm: false
})
const [accounts, setAccounts] = useState(mockAccounts)
const [archiveTarget, setArchiveTarget] = useState(null)
const [archiveModalOpen, setArchiveModalOpen] = useState(false)
const [logoutModalOpen, setLogoutModalOpen] = useState(false)
const [contractText, setContractText] = useState('THIS AGREEMENT...')
const [errors, setErrors] = useState({})
const [toast, setToast] = useState({ show: false, message: '', type: '' })

───────────────────────────────
FUNCTIONS:
───────────────────────────────
- handleSectionChange(section): updates activeSection
- handleLogoUpload(e): reads file, sets logoPreview
- handleRemoveLogo(): clears logoPreview
- handleProfileChange(field, value): updates profileForm
- handleSaveProfile(): mock save + success toast
- handlePasswordChange(field, value): 
  updates passwordForm,
  if field === 'newPass': calls calculateStrength()
- calculateStrength(password): returns 0-3 score
  0 = empty, 1 = weak, 2 = fair, 3 = strong
- handleTogglePassword(field): toggles showPasswords
- handleUpdatePassword(): validates all fields,
  shows success or error toast
- handleArchiveAccount(account): 
  sets archiveTarget, opens archiveModal
- confirmArchive(): sets status to 'archived' + toast
- handleRestoreAccount(account): 
  sets status back to 'active' + toast
- handleContractChange(e): updates contractText
- handleSaveContract(): mock save + toast
- handleLogout(): opens logoutModal
- confirmLogout(): navigate('/login')

=============================================================
📋 RULES (same as existing project)
=============================================================
- Vanilla CSS only, no libraries
- All functions fully implemented
- All CSS fully styled  
- Use existing Toast, Modal, Badge, Button components
- Monetary: ₱X,XXX format
- No placeholder comments
- Files must drop into existing project without changes
  to any other file