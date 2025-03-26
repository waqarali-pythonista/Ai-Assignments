import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image_source?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface Transaction {
  id: number;
  product: Product;
  quantity: number;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const apiService = {
  // Authentication
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/token/', {
        username: credentials.username,
        password: credentials.password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    try {
      const response = await api.post('/signup/', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Signup failed');
      }
      throw error;
    }
  },

  // Products
  getProducts: async (page = 1): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await api.get<PaginatedResponse<Product>>(`/products/?page=${page}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch products');
      }
      throw error;
    }
  },

  addProduct: async (formData: FormData) => {
    const response = await axios.post('/api/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: number) => {
    try {
      const response = await api.delete(`/products/${id}/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to delete product');
      }
      throw error;
    }
  },

  purchaseProduct: async (productId: number, quantity: number, paymentMethod: 'APP' | 'CASH') => {
    try {
      const response = await axios.post(`/api/products/${productId}/purchase/`, {
        quantity,
        payment_method: paymentMethod,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to purchase product');
      }
      throw error;
    }
  },

  // Transactions
  getTransactions: async (page = 1): Promise<PaginatedResponse<Transaction>> => {
    try {
      const response = await api.get<PaginatedResponse<Transaction>>(`/transactions/?page=${page}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
      }
      throw error;
    }
  },

  updateTransaction: async (id: number, quantity: number): Promise<Transaction> => {
    try {
      const response = await api.patch<Transaction>(`/transactions/${id}/`, { quantity });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to update transaction');
      }
      throw error;
    }
  },

  deleteTransaction: async (id: number): Promise<void> => {
    try {
      await api.delete(`/transactions/${id}/`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to delete transaction');
      }
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get<User[]>('/users/');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch users');
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get<User>('/users/me/');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch user data');
      }
      throw error;
    }
  },
}; 