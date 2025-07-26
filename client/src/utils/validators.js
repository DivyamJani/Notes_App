export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/;
  return regex.test(password);
};

export const validateName = (name) => {
  const regex = /^[a-zA-Z\s]{3,}$/;
  return regex.test(name.trim());
};
