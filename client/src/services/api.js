const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchEvents = async ({ type = 'upcoming', search = '', category = '' } = {}) => {
  const queryParams = new URLSearchParams();
  if (type) queryParams.append('type', type);
  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);

  const response = await fetch(`${API_URL}/events?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

export const fetchEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event details');
  return response.json();
};

export const registerForEvent = async (id, registrationData) => {
  const response = await fetch(`${API_URL}/events/${id}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registrationData)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
};
