// Helper utility functions

export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString()}`;
};

export const getRemarksBadgeVariant = (remarks) => {
  if (remarks === 'Paid On Time') return 'success';
  if (remarks === 'Final Payment') return 'default';
  if (remarks === 'Late') return 'warning';
  if (remarks === 'Unpaid') return 'danger';
  return 'default';
};

export const sortData = (data, field, direction) => {
  return [...data].sort((a, b) => {
    if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterData = (data, searchQuery, fields) => {
  if (!searchQuery) return data;
  
  return data.filter(item =>
    fields.some(field =>
      item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
};
