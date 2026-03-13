// Validation utility functions

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePhoneNumber = (phone) => {
  return phone.startsWith('09') && phone.length === 11;
};

export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const isAdult = (dateOfBirth) => {
  return calculateAge(dateOfBirth) >= 18;
};
