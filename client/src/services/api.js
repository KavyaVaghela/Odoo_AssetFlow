import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and unauthorized access
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh on 401 Unauthorized responses
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:5000/api/admin/auth/refresh', {
            refreshToken,
          });

          if (res.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token expired or invalid:', refreshError.message);
        }
      }

      // If refresh failed or no refresh token exists, redirect to session expired
      localStorage.clear();
      window.location.href = '/session-expired';
    }

    // Handle 403 Forbidden checks (Access Denied)
    if (error.response && error.response.status === 403) {
      const errData = error.response.data;
      if (errData && errData.errors && errData.errors[0]) {
        const details = errData.errors[0];
        if (details.status === 'Pending') {
          // Redirect to pending page
          localStorage.setItem('reg_date', details.registration_date);
          window.location.href = '/pending-approval';
          return Promise.reject(error);
        }
        if (details.status === 'Inactive' && details.approval_status === 'Rejected') {
          // Redirect to rejected page
          window.location.href = '/rejected';
          return Promise.reject(error);
        }
      }
      
      // Generic unauthorized access
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);

export default api;
