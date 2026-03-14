# Remaining Pages to Update

## Completed ✓
1. **Dashboard** - Now uses real database data for stats and payment dues
2. **RentCollection** - Fetches real rent payments and can mark as paid
3. **ViewTenants** - Fetches real tenant data
4. **AddTenant** - Creates real tenants in database
5. **Units** - Fetches real unit data

## Still Need Updates

### 3. Maintenance Page
**File**: `src/pages/admin/Maintenance.jsx`
**Changes needed**:
- Replace mock data import with `getMaintenanceRequests, updateMaintenanceRequest`
- Add `useEffect` to fetch data on mount
- Update `handleUpdateStatus` to call `updateMaintenanceRequest(id, { status })`
- Update `handleAssignStaff` to call `updateMaintenanceRequest(id, { assigned_to })`
- Format data to match frontend expectations

### 4. Complaints Page  
**File**: `src/pages/admin/Complaints.jsx`
**Changes needed**:
- Replace mock data import with `getComplaints, updateComplaint, replyToComplaint`
- Add `useEffect` to fetch data on mount
- Update `handleSubmitReply` to call `replyToComplaint(id, reply)`
- Update `handleUpdateStatus` to call `updateComplaint(id, { status })`
- Update `handleUpdatePriority` to call `updateComplaint(id, { priority })`
- Format data to match frontend expectations

### 5. Reports Page
**File**: `src/pages/admin/Reports.jsx`
**Currently**: Uses mock data for charts and tables
**Changes needed**:
- Fetch real rent payment data
- Calculate actual revenue by month
- Generate real payment status breakdown
- All data is already available via `getRentPayments()`

### 6. Settings Page
**File**: `src/pages/admin/Settings.jsx`
**Changes needed**:
- Fetch business profile from `getBusinessProfile()`
- Update business profile with `updateBusinessProfile(updates)`
- Fetch tenant accounts from `getTenants()` for Manage Accounts section
- Archive/restore functionality already works via `archiveTenant()`

## Database Service Functions Available

All these functions are already created in `src/services/database.js`:

```javascript
// Tenants
getTenants()
getTenantById(id)
createTenant(data)
updateTenant(id, updates)
archiveTenant(id)

// Units
getUnits()
getUnitById(id)
createUnit(data)
updateUnit(id, updates)

// Rent Payments
getRentPayments()
updatePayment(id, updates)
markPaymentAsPaid(id, paymentData)

// Maintenance
getMaintenanceRequests()
createMaintenanceRequest(data)
updateMaintenanceRequest(id, updates)

// Complaints
getComplaints()
createComplaint(data)
updateComplaint(id, updates)
replyToComplaint(id, reply)

// Dashboard
getDashboardStats()

// Business Profile
getBusinessProfile()
updateBusinessProfile(updates)
```

## Pattern to Follow

For each page:
1. Import database functions at top
2. Add `loading` state
3. Add `useEffect` to fetch data on mount
4. Replace mock data with fetched data
5. Update all action handlers to call database functions
6. Add error handling with Toast notifications
7. Refresh data after mutations

## Example Pattern:

```javascript
import { useState, useEffect } from 'react';
import { getDataFunction, updateDataFunction } from '../../services/database';

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getDataFunction();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updateDataFunction(id, updates);
      await fetchData(); // Refresh
      showToast('Updated successfully');
    } catch (error) {
      showToast('Failed to update', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  return (
    // ... JSX with loading state
    {loading ? <div>Loading...</div> : <YourContent />}
    <Toast ... />
  );
}
```
