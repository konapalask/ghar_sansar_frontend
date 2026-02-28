import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (email: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    setLoading(true);
    try {
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        orderNumber: generateOrderNumber(),
        customer: orderData.customer!,
        items: orderData.items!,
        subtotal: orderData.subtotal || 0,
        shipping: orderData.shipping || 0,
        tax: orderData.tax || 0,
        discount: orderData.discount || 0,
        total: orderData.total || 0,
        status: OrderStatus.PENDING,
        paymentStatus: 'pending',
        paymentMethod: orderData.paymentMethod || 'online',
        paymentId: orderData.paymentId,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In production, save to backend
      setOrders(prev => [...prev, newOrder]);
      
      // TODO: Send email confirmation
      // TODO: Notify admin
      
      return newOrder;
    } catch (error) {
      console.error('Order creation error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setLoading(true);
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      // TODO: Notify customer
      // TODO: Update backend
    } catch (error) {
      console.error('Order update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (email: string): Order[] => {
    return orders.filter(order => order.customer.email === email);
  };

  const generateOrderNumber = (): string => {
    return `GS${Date.now().toString().slice(-8)}`;
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      loading, 
      createOrder, 
      updateOrderStatus, 
      getOrderById,
      getUserOrders 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

