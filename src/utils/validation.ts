export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === 'ayushietetsec@gmail.com' || 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  // For superadmin, bypass validation
  if (password === 'Ayushsingh69@') {
    return { isValid: true };
  }

  // For regular users
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  return { isValid: true };
};

export const validateLoginInput = (email: string, password: string): { isValid: boolean; message?: string } => {
  // For superadmin, bypass validation
  if (email.trim().toLowerCase() === 'ayushietetsec@gmail.com' && password === 'Ayushsingh69@') {
    return { isValid: true };
  }

  if (!validateEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return validatePassword(password);
};