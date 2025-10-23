import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  cpf?: string;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { data: customerData, isLoading } = useQuery<Customer | null>({
    queryKey: ['/api/customer/me'],
    retry: false,
  });

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    } else {
      setCustomer(null);
    }
  }, [customerData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/customer/login', credentials);
      return await response.json() as Customer;
    },
    onSuccess: (data) => {
      setCustomer(data);
      queryClient.setQueryData(['/api/customer/me'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/customer'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest('POST', '/api/customer/register', data);
      return await response.json() as Customer;
    },
    onSuccess: (data) => {
      setCustomer(data);
      queryClient.setQueryData(['/api/customer/me'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/customer'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/customer/logout');
    },
    onSuccess: () => {
      setCustomer(null);
      queryClient.setQueryData(['/api/customer/me'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/customer'] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
