import { supabase } from '../lib/supabase';

// =============================================
// TENANTS
// =============================================

export const getTenants = async () => {
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      *,
      unit:units(name),
      rent_payments(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getTenantById = async (id) => {
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      *,
      unit:units(*),
      rent_payments(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createTenant = async (tenantData) => {
  const { data, error } = await supabase
    .from('tenants')
    .insert([tenantData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTenant = async (id, updates) => {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const archiveTenant = async (id) => {
  return updateTenant(id, { status: 'archived' });
};


// =============================================
// UNITS
// =============================================

export const getUnits = async () => {
  const { data, error } = await supabase
    .from('units')
    .select(`
      *,
      tenants(full_name)
    `)
    .order('name', { ascending: true });

  if (error) throw error;
  
  // Format data to match frontend expectations
  return data.map(unit => ({
    ...unit,
    tenant: unit.tenants?.[0]?.full_name || null,
    rentalFee: parseFloat(unit.rental_fee)
  }));
};

export const getUnitById = async (id) => {
  const { data, error } = await supabase
    .from('units')
    .select(`
      *,
      tenants(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createUnit = async (unitData) => {
  const { data, error } = await supabase
    .from('units')
    .insert([unitData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUnit = async (id, updates) => {
  const { data, error } = await supabase
    .from('units')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


// =============================================
// RENT PAYMENTS
// =============================================

export const getRentPayments = async () => {
  const { data, error } = await supabase
    .from('rent_payments')
    .select(`
      *,
      tenant:tenants(full_name, contact),
      unit:units(name)
    `)
    .order('due_date', { ascending: false });

  if (error) throw error;
  
  // Format data to match frontend expectations
  return data.map(payment => ({
    ...payment,
    tenantName: payment.tenant?.full_name,
    tenantContact: payment.tenant?.contact,
    unitName: payment.unit?.name,
    monthlyRent: parseFloat(payment.amount),
    dueDate: payment.due_date,
    paymentDate: payment.payment_date,
    paymentMethod: payment.payment_method
  }));
};

export const updatePayment = async (id, updates) => {
  const { data, error } = await supabase
    .from('rent_payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const markPaymentAsPaid = async (id, paymentData) => {
  return updatePayment(id, {
    status: 'paid',
    payment_date: paymentData.paymentDate,
    payment_method: paymentData.paymentMethod,
    balance: 0,
    remarks: 'On Time'
  });
};


// =============================================
// MAINTENANCE REQUESTS
// =============================================

export const getMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      tenant:tenants(full_name),
      unit:units(name, location)
    `)
    .order('reported_date', { ascending: false });

  if (error) throw error;
  
  // Format data to match frontend expectations
  return data.map(request => ({
    ...request,
    tenantName: request.tenant?.full_name,
    unitName: request.unit?.name,
    location: request.unit?.location,
    date: request.reported_date,
    assignedTo: request.assigned_to
  }));
};

export const createMaintenanceRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert([requestData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMaintenanceRequest = async (id, updates) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


// =============================================
// COMPLAINTS
// =============================================

export const getComplaints = async () => {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      tenant:tenants(full_name),
      unit:units(name)
    `)
    .order('submitted_date', { ascending: false });

  if (error) throw error;
  
  // Format data to match frontend expectations
  return data.map(complaint => ({
    ...complaint,
    tenantName: complaint.tenant?.full_name,
    unitName: complaint.unit?.name,
    date: complaint.submitted_date,
    reply: complaint.admin_reply
  }));
};

export const createComplaint = async (complaintData) => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([complaintData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateComplaint = async (id, updates) => {
  const { data, error } = await supabase
    .from('complaints')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const replyToComplaint = async (id, reply) => {
  return updateComplaint(id, {
    admin_reply: reply,
    status: 'resolved'
  });
};


// =============================================
// DASHBOARD STATS
// =============================================

export const getDashboardStats = async () => {
  // Get total tenants
  const { count: totalTenants } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get occupied units
  const { count: occupiedUnits } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'occupied');

  // Get total units
  const { count: totalUnits } = await supabase
    .from('units')
    .select('*', { count: 'exact', head: true });

  // Get pending maintenance
  const { count: pendingMaintenance } = await supabase
    .from('maintenance_requests')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'in-progress']);

  // Get total revenue (paid payments this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: payments } = await supabase
    .from('rent_payments')
    .select('amount')
    .eq('status', 'paid')
    .gte('payment_date', startOfMonth.toISOString());

  const totalRevenue = payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  return {
    totalTenants: totalTenants || 0,
    occupiedUnits: occupiedUnits || 0,
    totalUnits: totalUnits || 0,
    vacantUnits: (totalUnits || 0) - (occupiedUnits || 0),
    pendingMaintenance: pendingMaintenance || 0,
    totalRevenue: totalRevenue
  };
};

// =============================================
// BUSINESS PROFILE
// =============================================

export const getBusinessProfile = async () => {
  const { data, error } = await supabase
    .from('business_profile')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateBusinessProfile = async (updates) => {
  const { data, error } = await supabase
    .from('business_profile')
    .update(updates)
    .eq('id', (await getBusinessProfile()).id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
