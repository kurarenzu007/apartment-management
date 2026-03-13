You are a senior React developer building on top of an existing 
apartment management system called "JJJ Apartment" that already has:
- Login page, Admin Dashboard, Tenant Management (View + Add)
- Shared components: Sidebar, Topbar, StatCard, Badge, Button, Modal
- Design system with CSS variables (see below)
- React Router v6, Vanilla CSS only (NO Tailwind, NO UI libraries)

=============================================================
🎨 EXISTING DESIGN SYSTEM (already defined in index.css)
=============================================================

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
  --info: #3498DB;
  --info-light: #EBF5FB;
  --bg-main: #F0F4F4;
  --bg-card: #FFFFFF;
  --text-dark: #1A2B2B;
  --text-muted: #7F8C8D;
  --text-light: #FFFFFF;
  --border: #E0ECEB;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --transition: all 0.25s ease;
}

Fonts: 'Plus Jakarta Sans' (headings), 'Inter' (body)
All monetary values: ₱X,XXX format (Philippine Peso)
Dates: MM/DD/YYYY format
Icons: Unicode emojis or inline SVG ONLY (no icon libraries)

=============================================================
📁 ADD THESE FILES TO EXISTING PROJECT
=============================================================

src/pages/admin/
├── RentCollection.jsx + RentCollection.css
├── Maintenance.jsx + Maintenance.css
└── Complaints.jsx + Complaints.css

These pages are already referenced in the Sidebar and Router.
Wrap each in AdminLayout (Sidebar + Topbar) — same as Dashboard.

=============================================================
💰 PAGE 1: RENT COLLECTION
=============================================================

File: pages/admin/RentCollection.jsx + RentCollection.css
Route: /admin/rent

───────────────────────────────
MOCK DATA:
───────────────────────────────
const mockRentRecords = [
  {
    id: 1,
    tenantName: 'Ten Nant',
    initials: 'TN',
    unit: 'Apartment 1',
    billingPeriod: 'January 2026',
    amountDue: 5500,
    amountPaid: 5500,
    dueDate: '01/01/2026',
    datePaid: '01/01/2026',
    paymentMethod: 'Cash',
    balance: 0,
    status: 'paid'
  },
  {
    id: 2,
    tenantName: 'Nan Tent',
    initials: 'NT',
    unit: 'Apartment 24',
    billingPeriod: 'January 2026',
    amountDue: 4000,
    amountPaid: 0,
    dueDate: '01/01/2026',
    datePaid: null,
    paymentMethod: null,
    balance: 4000,
    status: 'missed'
  },
  {
    id: 3,
    tenantName: 'Mike Conley',
    initials: 'MC',
    unit: 'House 2',
    billingPeriod: 'January 2026',
    amountDue: 11500,
    amountPaid: 0,
    dueDate: '12/31/2025',
    datePaid: null,
    paymentMethod: null,
    balance: 11500,
    status: 'overdue'
  },
  {
    id: 4,
    tenantName: 'Smith Don',
    initials: 'SD',
    unit: 'Apartment A-1',
    billingPeriod: 'January 2026',
    amountDue: 2500,
    amountPaid: 2500,
    dueDate: '12/12/2025',
    datePaid: '12/12/2025',
    paymentMethod: 'GCash',
    balance: 0,
    status: 'paid'
  },
  {
    id: 5,
    tenantName: 'John Doe',
    initials: 'JD',
    unit: 'Apartment A-14',
    billingPeriod: 'January 2026',
    amountDue: 3000,
    amountPaid: 2000,
    dueDate: '01/15/2026',
    datePaid: null,
    paymentMethod: 'Bank Transfer',
    balance: 1000,
    status: 'partial'
  },
  {
    id: 6,
    tenantName: 'Ana Reyes',
    initials: 'AR',
    unit: 'Room 1',
    billingPeriod: 'January 2026',
    amountDue: 2220,
    amountPaid: 0,
    dueDate: '01/05/2026',
    datePaid: null,
    paymentMethod: null,
    balance: 2220,
    status: 'pending'
  }
]

───────────────────────────────
LAYOUT (top to bottom):
───────────────────────────────

1. PAGE HEADER:
   - Title: "Rent Collection" + breadcrumb: Home > Rent Collection
   - Right side: Month/Year selector (dropdown: Jan 2026, Feb 2026...)
     + "📤 Export" button (gray outline)

2. SUMMARY STAT CARDS (3 cards in a row):
   💰 Total Collected  | sum of all paid amounts | green left border
   ⏳ Total Pending    | sum of pending+partial   | yellow left border  
   🚨 Total Overdue    | sum of overdue+missed    | red left border
   Each card: icon circle + label + ₱ amount (large) + count below 
   "(X tenants)" in muted small text

3. FILTER TABS (pill style, below cards):
   [All] [✅ Paid] [⏳ Pending] [🕐 Partial] [❌ Missed] [🚨 Overdue]
   - Active: teal bg + white text
   - Each tab shows a count badge next to label
   - e.g. "Missed (1)" "Overdue (1)"

4. TABLE TOOLBAR (between tabs and table):
   Left: Search input (🔍 "Search tenant or unit...")
   Right: "Show [10▼] entries" dropdown

5. MAIN TABLE:
   Columns (in order):
   # | Tenant | Unit | Billing Period | Due Date | Amount Due | 
   Paid | Balance | Method | Date Paid | Status | Actions

   TENANT column: initials avatar circle + name (stacked)
   Avatar colors cycle: teal, blue, purple, orange, green

   STATUS BADGES:
   - paid     → "✅ Paid"    green pill
   - pending  → "⏳ Pending" yellow pill
   - partial  → "🕐 Partial" blue pill
   - missed   → "❌ Missed"  red pill
   - overdue  → "🚨 Overdue" dark red pill

   ROW STYLING:
   - overdue rows: background #FFF5F5 (light red tint)
   - missed rows: background #FFF5F5
   - paid rows: normal white/striped
   
   ACTIONS column (3 icon buttons):
   ✅ Mark as Paid   → opens Mark Paid modal
   📩 Send Reminder  → shows toast "Reminder sent to [name]"
   👁️ View Details   → opens View modal

   TABLE FOOTER:
   - Left: "Showing X to Y of Z entries"
   - Right: pagination arrows + page numbers

6. MARK AS PAID MODAL:
   Header: "Record Payment — [Tenant Name]"
   Teal header background, white text
   
   Form fields:
   - Amount Paid: number input (pre-filled with balance)
   - Payment Method: dropdown
     "Cash" | "GCash" | "Bank Transfer" | "Check"
   - Date Paid: date input (pre-filled today)
   - Reference No.: text input (optional, for GCash/bank)
   - Remarks: text input
     Pre-filled options as chips: 
     [Paid On Time] [Late Payment] [Partial Payment] [Final Payment]
     Clicking a chip fills the remarks field
   
   Footer buttons:
   [Cancel] (gray outline) [✅ Confirm Payment] (teal gradient)
   
   On confirm: update record status, show success toast

7. VIEW DETAILS MODAL:
   Header: tenant initials avatar + name + unit
   
   Two sections side by side:
   Left — Payment Info:
     Billing Period | Amount Due | Amount Paid
     Balance | Due Date | Date Paid
     Payment Method | Reference No.
   
   Right — Payment Status Timeline:
     Visual vertical timeline:
     ● Bill Generated → [date]
     ● Payment Due   → [due date]  
     ● Payment Received → [date paid] or "Not yet paid"
     Each step: dot + label + date
     Completed steps: teal dot
     Pending steps: gray dot

8. SEND REMINDER feature:
   No modal needed — just toast notification:
   "📩 Reminder sent to [Tenant Name] for ₱[amount]"
   Toast: teal bg, white text, 3 seconds

───────────────────────────────
STATES:
───────────────────────────────
const [records, setRecords] = useState(mockRentRecords)
const [activeFilter, setActiveFilter] = useState('all')
const [searchQuery, setSearchQuery] = useState('')
const [showEntries, setShowEntries] = useState(10)
const [currentPage, setCurrentPage] = useState(1)
const [selectedMonth, setSelectedMonth] = useState('January 2026')
const [selectedRecord, setSelectedRecord] = useState(null)
const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false)
const [viewModalOpen, setViewModalOpen] = useState(false)
const [paymentForm, setPaymentForm] = useState({
  amountPaid: '', method: '', datePaid: '', reference: '', remarks: ''
})
const [toast, setToast] = useState({ show: false, message: '', type: '' })

───────────────────────────────
FUNCTIONS:
───────────────────────────────
- fetchRentRecords(): sets mock data
- handleFilterChange(status): filters by status tab
- handleSearch(e): filters by tenant name or unit
- handleMonthChange(month): filters by billing period
- computeSummary(): returns { collected, pending, overdue } totals
- handleOpenMarkPaid(record): sets selectedRecord, opens modal
- handlePaymentFormChange(field, value): updates paymentForm
- handleRemarkChip(remark): sets remarks field
- handleConfirmPayment(): validates, updates record status,
  shows toast, closes modal
- handleSendReminder(record): shows toast with tenant name + amount
- handleViewDetails(record): sets selectedRecord, opens view modal
- handleExport(): window.alert('Export coming soon!') mock
- filterRecords(): returns filtered + searched records
- paginateRecords(): returns current page slice

=============================================================
🔧 PAGE 2: MAINTENANCE REQUESTS
=============================================================

File: pages/admin/Maintenance.jsx + Maintenance.css
Route: /admin/maintenance

───────────────────────────────
MOCK DATA:
───────────────────────────────
const mockRequests = [
  {
    id: 1,
    tenantName: 'Jonathan Cruz',
    initials: 'JC',
    unit: 'Apartment 3',
    title: 'Broken Door',
    description: 'Fix the broken door, we have noticed it late. Because we did not have time to explore things but please fix this.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    dateSubmitted: '03/12/2026',
    priority: 'high',
    status: 'open',
    assignedTo: null,
    category: 'Door/Window'
  },
  {
    id: 2,
    tenantName: 'Jonathan Cruz',
    initials: 'JC',
    unit: 'Apartment 3',
    title: 'Sink Not Draining',
    description: 'The kitchen sink has been clogged for 2 days. Water is not draining at all.',
    image: null,
    dateSubmitted: '03/12/2026',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Maintenance Staff A',
    category: 'Plumbing'
  },
  {
    id: 3,
    tenantName: 'Ana Reyes',
    initials: 'AR',
    unit: 'Room 1',
    title: 'Flickering Lights',
    description: 'The bedroom lights have been flickering every night for a week.',
    image: null,
    dateSubmitted: '03/10/2026',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'Maintenance Staff B',
    category: 'Electrical'
  },
  {
    id: 4,
    tenantName: 'Smith Don',
    initials: 'SD',
    unit: 'Apartment A-1',
    title: 'Leaking Faucet',
    description: 'Bathroom faucet has been leaking since last week.',
    image: null,
    dateSubmitted: '03/11/2026',
    priority: 'medium',
    status: 'open',
    assignedTo: null,
    category: 'Plumbing'
  },
]

───────────────────────────────
LAYOUT:
───────────────────────────────

1. PAGE HEADER:
   Title: "Maintenance Requests" + breadcrumb
   Right: View toggle buttons: [📋 Table] [📌 Board] 
   (toggle between table view and kanban board view)

2. SUMMARY CARDS (3 cards):
   🔵 Open        | count | blue left border
   🟡 In Progress | count | orange left border
   🟢 Resolved    | count | green left border

3. FILTER ROW:
   Left: Filter tabs: [All] [Open] [In Progress] [Resolved]
   Right: Priority filter dropdown: [All Priorities ▼]
          + Category filter: [All Categories ▼]
          + Search input

4A. TABLE VIEW (default):
    Columns:
    # | Tenant + Unit | Category | Title | Priority | 
    Status | Date | Assigned To | Actions

    PRIORITY BADGES:
    - high   → "🔴 High"   red pill
    - medium → "🟡 Medium" orange pill
    - low    → "🟢 Low"   green pill

    STATUS BADGES:
    - open        → "📬 Open"        blue pill
    - in_progress → "⚙️ In Progress" orange pill
    - resolved    → "✅ Resolved"    green pill

    Unread/new requests: bold text + teal left border on row

    ACTIONS column:
    👁️ View Details  → opens detail modal
    ⚙️ Update Status → opens status update modal
    ✅ Mark Resolved → directly marks as resolved + toast

4B. KANBAN BOARD VIEW:
    3 columns side by side:
    
    [📬 Open (2)]    [⚙️ In Progress (1)]    [✅ Resolved (1)]
    
    Each column:
    - Header: colored top border + title + count badge
    - Cards stacked vertically
    
    Each card shows:
    - Tenant avatar (initials circle) + name + unit
    - Title (bold)
    - Category chip (small gray pill)
    - Priority badge
    - Date submitted
    - Assigned to (if any) or "Unassigned" (muted)
    - If has image: small thumbnail preview
    - "View Details →" link at bottom
    
    Column colors:
    Open: blue top border + light blue bg header
    In Progress: orange top border + light orange bg header
    Resolved: green top border + light green bg header

5. VIEW DETAILS MODAL:
   Header: teal bg
   Left side: "[priority badge] [category chip]"
   Title: request title (large, white)
   Tenant: "From: [name] — [unit]"

   Modal body (two columns):
   
   Left (60%):
   - Full description (styled box, light gray bg)
   - Attached photo (if exists):
     Full-width image with "📷 Attached Photo" label above
     Clicking image opens it in a lightbox (full screen overlay)
   
   Right (40%):
   - Request Info card:
     📅 Date Submitted: [date]
     🏠 Unit: [unit]
     🔧 Category: [category]
     ⚡ Priority: [badge]
     📊 Status: [badge]
     👷 Assigned To: [name or "Unassigned"]
   
   - Update Status section:
     "Change Status:" label
     Three button pills: [Open] [In Progress] [Resolved]
     Active status: filled teal
   
   - Assign Staff section:
     "Assign to:" dropdown
     Options: "Unassigned", "Maintenance Staff A", 
              "Maintenance Staff B", "Plumber", "Electrician"
     [Assign] button
   
   Footer:
   [Close] (gray) [✅ Save Changes] (teal)

6. STATUS UPDATE MODAL (from table action):
   Simple modal:
   Title: "Update Status"
   Current status shown
   Three option cards to select:
   [📬 Open] [⚙️ In Progress] [✅ Resolved]
   Selected card: teal border + teal bg tint
   [Cancel] [Update] buttons

───────────────────────────────
STATES:
───────────────────────────────
const [requests, setRequests] = useState(mockRequests)
const [viewMode, setViewMode] = useState('table') // 'table' | 'board'
const [activeFilter, setActiveFilter] = useState('all')
const [priorityFilter, setPriorityFilter] = useState('all')
const [categoryFilter, setCategoryFilter] = useState('all')
const [searchQuery, setSearchQuery] = useState('')
const [selectedRequest, setSelectedRequest] = useState(null)
const [detailModalOpen, setDetailModalOpen] = useState(false)
const [statusModalOpen, setStatusModalOpen] = useState(false)
const [lightboxOpen, setLightboxOpen] = useState(false)
const [toast, setToast] = useState({ show: false, message: '', type: '' })

───────────────────────────────
FUNCTIONS:
───────────────────────────────
- fetchRequests(): sets mock data
- handleViewModeToggle(mode): switches table/board
- handleFilterChange(status): filters by status
- handlePriorityFilter(priority): filters by priority
- handleCategoryFilter(category): filters by category
- handleSearch(e): search by tenant name, unit, title
- computeSummary(): returns { open, inProgress, resolved } counts
- handleViewDetails(request): opens detail modal
- handleStatusUpdate(request, newStatus): 
  updates status in state, shows toast, closes modal
- handleMarkResolved(request): 
  directly sets status to resolved + toast
- handleAssignStaff(request, staff):
  updates assignedTo in state + toast
- handleOpenLightbox(): opens image lightbox
- filterRequests(): applies all active filters
- getRequestsByStatus(status): for kanban columns

=============================================================
💬 PAGE 3: COMPLAINTS & FEEDBACK
=============================================================

File: pages/admin/Complaints.jsx + Complaints.css
Route: /admin/complaints

───────────────────────────────
MOCK DATA:
───────────────────────────────
const mockComplaints = [
  {
    id: 1,
    tenantName: 'Jonathan Cruz',
    initials: 'JC',
    unit: 'Apartment 3',
    type: 'complaint',
    category: 'Cleanliness',
    title: 'Messy Common Area',
    message: 'The hallway and common area near apartment 3 has been consistently dirty. Garbage is left in the corridor.',
    dateSubmitted: '03/13/2026',
    status: 'new',
    priority: 'medium',
    adminReply: null,
    isRead: false,
  },
  {
    id: 2,
    tenantName: 'Jonathan Cruz',
    initials: 'JC',
    unit: 'Apartment 3',
    type: 'feedback',
    category: 'Service',
    title: 'Good Services',
    message: 'I am very satisfied with the quick response to my maintenance request last week. Great job!',
    dateSubmitted: '03/12/2026',
    status: 'acknowledged',
    priority: 'low',
    adminReply: 'Thank you for your kind words! We always aim to provide the best service.',
    isRead: true,
  },
  {
    id: 3,
    tenantName: 'Jonathan Cruz',
    initials: 'JC',
    unit: 'Apartment 3',
    type: 'feedback',
    category: 'Cleanliness',
    title: 'Apartment Was Clean',
    message: 'The apartment was very clean when I moved in. Everything was properly maintained.',
    dateSubmitted: '03/10/2026',
    status: 'resolved',
    priority: 'low',
    adminReply: 'Glad to hear that! We will maintain these standards.',
    isRead: true,
  },
  {
    id: 4,
    tenantName: 'Ana Reyes',
    initials: 'AR',
    unit: 'Room 1',
    type: 'complaint',
    category: 'Noise',
    title: 'Noisy Neighbors',
    message: 'The tenants in apartment 4 have been playing loud music past midnight every weekend.',
    dateSubmitted: '03/11/2026',
    status: 'under_review',
    priority: 'high',
    adminReply: 'We are currently looking into this matter.',
    isRead: true,
  },
]

───────────────────────────────
LAYOUT:
───────────────────────────────

1. PAGE HEADER:
   Title: "Complaints & Feedback" + breadcrumb
   Right: "Mark All as Read" button (outline) + unread count badge

2. SUMMARY CARDS (4 cards):
   🔴 Total Complaints  | count | red left border
   🟢 Total Feedback    | count | green left border
   ⚪ Unresolved        | count | orange left border
   📬 Unread            | count | blue left border

3. MAIN TAB NAVIGATION (large tabs, not pills):
   [🔴 Complaints (2)] [🟢 Feedback (2)]
   
   Tab styling:
   - Complaints active: red bottom border (3px) + red text
   - Feedback active: green bottom border (3px) + green text
   - Inactive: gray text
   - Tabs have count badge (circle)

4. FILTER ROW (below tabs):
   Left: Status filter pills:
     Complaints tab: [All] [New] [Under Review] [Resolved]
     Feedback tab: [All] [New] [Acknowledged] [Resolved]
   Right: Category dropdown + Search input

5. ITEMS LIST (card-based, NOT a table):
   Each item is a horizontal card:

   Left side (10%): 
   - Colored vertical stripe:
     Complaint: red | Feedback: green
   - Initials avatar circle

   Center (70%):
   - Row 1: Title (bold, 15px) + Category chip (gray) + 
     Priority badge (only for complaints)
   - Row 2: Tenant name (teal) + "•" + Unit (muted)
   - Row 3: Message preview (truncated to 1 line, muted, 13px)
   - Row 4: 📅 Date + 
     If has reply: "💬 Admin replied" (teal, small)
     If unread: bold dot indicator

   Right side (20%):
   - Status badge (stacked on top)
   - Action buttons below:
     👁️ View & Reply
     ✅ Mark Resolved (if not resolved)
   - Unread items: entire card has slight blue-tinted bg

   UNREAD indicator:
   - Small teal dot (●) on the left
   - Card background: #F0F8FF (very light blue)
   - Disappears after opening

6. VIEW & REPLY MODAL:
   Header: 
   - Colored top border (red for complaint, green for feedback)
   - Category chip + Type badge (🔴 Complaint / 🟢 Feedback)
   - Title (large, bold)
   - "From [Tenant Name] — [Unit] • [Date]"
   
   Modal body:

   Section 1 — Message:
   "💬 Message" label
   Full message in styled box (light gray bg, italic text, 
   rounded corners, left colored border)

   Section 2 — Status Flow:
   Horizontal stepper (for complaints):
   [New] → [Under Review] → [Acknowledged] → [Resolved]
   Current step highlighted in appropriate color
   Clicking a step updates the status
   
   For feedback:
   [New] → [Acknowledged] → [Resolved]

   Section 3 — Admin Reply Thread:
   "📝 Reply / Notes" label
   
   If previous reply exists:
   Show it in a speech-bubble style box:
   - Right-aligned (admin side)
   - Teal bg, white text
   - "Admin • [date]" label below
   
   Reply input area:
   - Textarea: "Type your reply or internal note..."
   - Below textarea: 
     Quick reply chips (clickable to fill textarea):
     ["We'll look into this"] 
     ["Issue has been resolved"]
     ["Thank you for your feedback"]
     ["We will take action on this"]
   - [📩 Send Reply] button (teal) 
     + [💾 Save as Note] button (gray outline)
   
   Footer:
   Left: Priority selector (for complaints only):
     🔴 High | 🟡 Medium | 🟢 Low (clickable pills)
   Right: [Close] [✅ Mark as Resolved] (green)

───────────────────────────────
STATES:
───────────────────────────────
const [items, setItems] = useState(mockComplaints)
const [activeTab, setActiveTab] = useState('complaint')
const [activeFilter, setActiveFilter] = useState('all')
const [categoryFilter, setCategoryFilter] = useState('all')
const [searchQuery, setSearchQuery] = useState('')
const [selectedItem, setSelectedItem] = useState(null)
const [modalOpen, setModalOpen] = useState(false)
const [replyText, setReplyText] = useState('')
const [toast, setToast] = useState({ show: false, message: '', type: '' })

───────────────────────────────
FUNCTIONS:
───────────────────────────────
- fetchItems(): sets mock data
- handleTabSwitch(tab): switches complaint/feedback
- handleFilterChange(status): filters by status
- handleSearch(e): search by name, unit, title, message
- computeSummary(): returns counts for summary cards
- handleViewItem(item): 
  marks as read (isRead: true), 
  sets selectedItem, opens modal
- handleSendReply(item, reply):
  sets adminReply on item, 
  updates status to 'acknowledged',
  shows toast "Reply sent to [name]",
  clears replyText
- handleQuickReply(text): sets replyText to chip text
- handleStatusUpdate(item, status): 
  updates status, shows toast
- handleMarkResolved(item):
  sets status to 'resolved', shows toast, closes modal
- handleMarkAllRead():
  sets all isRead to true, shows toast
- handlePriorityChange(item, priority):
  updates priority for complaints only
- getUnreadCount(): returns count of unread items
- filterItems(): applies tab + status + category + search

=============================================================
🍞 TOAST NOTIFICATION (shared, if not already built)
=============================================================

Create a reusable Toast component if not already in project:

File: components/Toast.jsx + Toast.css

Props: { show, message, type, onClose }
Types: 'success' | 'error' | 'warning' | 'info'

Styling:
- Fixed position: top-right, 20px from edges
- Width: 320px
- Padding: 16px 20px
- Border-radius: var(--radius-md)
- Box-shadow: var(--shadow-lg)
- Left colored border (5px) matching type
- Icon on left: ✅ ❌ ⚠️ ℹ️
- Message text + × close button
- Animation: slide in from right on mount
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0 } 
                        to { transform: translateX(0); opacity: 1 } }
- Auto-dismiss: setTimeout 3000ms then onClose()

Colors per type:
- success: border #2ECC71, bg #F0FFF4
- error:   border #E74C3C, bg #FFF5F5
- warning: border #F39C12, bg #FFFBF0
- info:    border #3498DB, bg #F0F8FF

=============================================================
📋 IMPLEMENTATION RULES
=============================================================

1. Each page is its own .jsx + .css file pair
2. NO external CSS libraries, NO Tailwind
3. Reuse existing components: Modal, Badge, Button, StatCard
4. All functions FULLY implemented (no placeholder comments)
5. All CSS classes FULLY styled (no empty rules)
6. Monetary values: ₱X,XXX (use toLocaleString('en-PH'))
7. Dates: MM/DD/YYYY
8. Consistent spacing: use multiples of 4px/8px
9. All modals have proper overlay (rgba(0,0,0,0.5) backdrop)
10. All destructive/important actions have confirmation or toast
11. Empty states: show a centered message + emoji when 
    filtered results are empty
12. Loading skeleton: gray animated pulse on initial load
    (setTimeout 800ms then set loading false)

Generate ALL three pages completely with full 
implementation. Every function must work. Every CSS 
rule must be complete. Pages must be immediately 
usable when added to the existing project.