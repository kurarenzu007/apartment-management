// Mock data for the application

export const mockStats = {
  totalApartments: 24,
  totalHouses: 2,
  totalVacancies: 8,
  totalTenants: 18,
  totalRentCollection: 101000,
  paymentCollected: 2,
  maintenance: 0,
  totalComplaints: 3
};

export const mockUpcomingDues = [
  { unitId: 'A-1', tenantName: 'Smith Don', dueDate: '12/12/2025', amount: 2500, status: 'upcoming' },
  { unitId: 'H-2', tenantName: 'Mike Conley', dueDate: '12/31/2025', amount: 11500, status: 'upcoming' },
  { unitId: 'A-14', tenantName: 'John Doe', dueDate: '12/15/2025', amount: 3000, status: 'upcoming' },
];

export const mockExceededDues = [
  { unitId: 'A-3', tenantName: 'Ana Reyes', dueDate: '11/01/2025'
, amount: 4500, status: 'overdue' },
  { unitId: 'A-7', tenantName: 'Carlo Santos', dueDate: '10/15/2025', amount: 2800, status: 'overdue' },
];

export const mockTenants = [
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
];


export const mockUnits = [
  { id: 1, name: 'Apartment 1', location: 'Building A - Floor 1', rentalFee: 5500, status: 'occupied', tenant: 'Ten Nant' },
  { id: 2, name: 'Apartment 24', location: 'Building A - Floor 2', rentalFee: 4000, status: 'occupied', tenant: 'Nan Tent' },
  { id: 3, name: 'House 2', location: 'Building B', rentalFee: 11500, status: 'occupied', tenant: 'Mike Conley' },
  { id: 4, name: 'Apartment A-1', location: 'Building A - Floor 1', rentalFee: 2500, status: 'occupied', tenant: 'Smith Don' },
  { id: 5, name: 'Apartment A-14', location: 'Building A - Floor 1', rentalFee: 3000, status: 'occupied', tenant: 'John Doe' },
  { id: 6, name: 'Room 1', location: 'Building C - Floor 1', rentalFee: 2220, status: 'occupied', tenant: 'Ana Reyes' },
  { id: 7, name: 'Apartment 5', location: 'Building A - Floor 1', rentalFee: 5000, status: 'vacant', tenant: null },
  { id: 8, name: 'Apartment 12', location: 'Building A - Floor 2', rentalFee: 4500, status: 'vacant', tenant: null },
  { id: 9, name: 'Studio 3', location: 'Building D - Floor 3', rentalFee: 6000, status: 'maintenance', tenant: null },
  { id: 10, name: 'Room 5', location: 'Building C - Floor 2', rentalFee: 2500, status: 'vacant', tenant: null },
];
