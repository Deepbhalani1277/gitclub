export const setToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const getToken = () => {
  return localStorage.getItem('admin_token');
};

export const removeToken = () => {
  localStorage.removeItem('admin_token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
