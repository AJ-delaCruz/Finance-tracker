// export const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api';
// export const wsUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
// // export const backendUrl = process.env.REACT_APP_BACKEND_URL;

// export const backendUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api';
// export const wsUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';

export const backendUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_BACKEND_URL || '/api' : 'http://localhost:3000/api';
export const wsUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_WS_URL || '/' : 'http://localhost:3000';
