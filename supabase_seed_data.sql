-- =============================================
-- SAMPLE DATA FOR JJJ APARTMENT MANAGEMENT SYSTEM
-- =============================================
-- Run this AFTER creating the schema and users in Supabase Auth

-- =============================================
-- IMPORTANT: Create these users in Supabase Dashboard first:
-- 1. admin@admin.com (password: admin123)
-- 2. tenant@tenant.com (password: tenant123)
-- =============================================

-- Insert profiles (replace UUIDs with actual user IDs from auth.users)
-- You'll need to get these IDs after creating users in Supabase Dashboard
-- Example:
-- INSERT INTO profiles (id, email, full_name, phone, role) VALUES
-- ('YOUR-ADMIN-UUID-HERE', 'admin@admin.com', 'Admin User', '09123456789', 'admin'),
-- ('YOUR-TENANT-UUID-HERE', 'tenant@tenant.com', 'Ten Nant', '09987654321', 'tenant');

-- =============================================
-- UNITS
-- =============================================

INSERT INTO units (name, location, rental_fee, status, apartment_type) VALUES
('Apartment 1', 'Building A - Floor 1', 5500.00, 'occupied', 'Studio Apartment'),
('Apartment 24', 'Building A - Floor 2', 4000.00, 'occupied', 'Studio Apartment'),
('House 2', 'Building B', 11500.00, 'occupied', 'House Apartment'),
('Apartment A-1', 'Building A - Floor 1', 2500.00, 'occupied', 'Room'),
('Apartment A-14', 'Building A - Floor 1', 3000.00, 'occupied', 'Room'),
('Room 1', 'Building C - Floor 1', 2220.00, 'occupied', 'Room'),
('Apartment 5', 'Building A - Floor 1', 5000.00, 'vacant', 'Studio Apartment'),
('Apartment 12', 'Building A - Floor 2', 4500.00, 'vacant', 'Studio Apartment'),
('Studio 3', 'Building D - Floor 3', 6000.00, 'maintenance', 'Studio Apartment'),
('Room 5', 'Building C - Floor 2', 2500.00, 'vacant', 'Room');

-- =============================================
-- TENANTS (Update unit_id and user_id with actual UUIDs)
-- =============================================

-- Example tenant inserts (you'll need to update IDs)
-- INSERT INTO tenants (username, full_name, email, contact, address, unit_id, status, move_in_date, contract_duration) VALUES
-- ('tenant1', 'Ten Nant', 'ten.nant@email.com', '09123456789', '123 Main St', (SELECT id FROM units WHERE name = 'Apartment 1'), 'active', '2024-01-15', '12 months'),
-- ('tenant2', 'Nan Tent', 'nan.tent@email.com', '09234567890', '456 Oak Ave', (SELECT id FROM units WHERE name = 'Apartment 24'), 'active', '2024-02-01', '12 months');

-- =============================================
-- RENT PAYMENTS (Sample data)
-- =============================================

-- Example rent payment inserts (update tenant_id and unit_id)
-- INSERT INTO rent_payments (tenant_id, unit_id, amount, due_date, payment_date, payment_method, status, billing_period, balance, remarks) VALUES
-- ((SELECT id FROM tenants WHERE username = 'tenant1'), (SELECT id FROM units WHERE name = 'Apartment 1'), 5500.00, '2024-03-01', '2024-03-01', 'Gcash', 'paid', 'March 2024', 0, 'On Time'),
-- ((SELECT id FROM tenants WHERE username = 'tenant2'), (SELECT id FROM units WHERE name = 'Apartment 24'), 4000.00, '2024-03-01', NULL, NULL, 'overdue', 'March 2024', 4000.00, 'Overdue');

-- =============================================
-- MAINTENANCE REQUESTS (Sample data)
-- =============================================

-- Example maintenance requests (update tenant_id and unit_id)
-- INSERT INTO maintenance_requests (tenant_id, unit_id, title, description, category, priority, status, assigned_to, reported_date) VALUES
-- ((SELECT id FROM tenants WHERE username = 'tenant1'), (SELECT id FROM units WHERE name = 'Apartment 1'), 'Leaking Faucet', 'Kitchen faucet is dripping constantly', 'Plumbing', 'medium', 'pending', NULL, NOW() - INTERVAL '2 days'),
-- ((SELECT id FROM tenants WHERE username = 'tenant2'), (SELECT id FROM units WHERE name = 'Apartment 24'), 'Broken AC', 'Air conditioning unit not cooling', 'Appliance', 'high', 'in-progress', 'John Maintenance', NOW() - INTERVAL '1 day');

-- =============================================
-- COMPLAINTS (Sample data)
-- =============================================

-- Example complaints (update tenant_id and unit_id)
-- INSERT INTO complaints (tenant_id, unit_id, type, subject, description, priority, status, submitted_date) VALUES
-- ((SELECT id FROM tenants WHERE username = 'tenant1'), (SELECT id FROM units WHERE name = 'Apartment 1'), 'complaint', 'Noise Complaint', 'Neighbors are too loud at night', 'medium', 'pending', NOW() - INTERVAL '3 days'),
-- ((SELECT id FROM tenants WHERE username = 'tenant2'), (SELECT id FROM units WHERE name = 'Apartment 24'), 'feedback', 'Great Service', 'Very satisfied with the maintenance response time', 'low', 'resolved', NOW() - INTERVAL '5 days');

-- =============================================
-- BUSINESS PROFILE
-- =============================================

INSERT INTO business_profile (business_name, contact, email, address, contract_template) VALUES
('JJJ Apartment', '09123456789', 'contact@jjjapartment.com', '123 Business St, City', 
'THIS AGREEMENT made this [DATE], by and between JJJ''s Apartment, herein called ''Landlord,'' and [TENANT NAME], herein called ''Tenant.'' Landlord hereby agrees to rent to Tenant the dwelling located at [ADDRESS] under the following terms and conditions...');
