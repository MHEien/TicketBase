import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Event } from '../lib/api/events';

export interface CartItem {
  eventId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  price: number; // Price per ticket in dollars
  event?: Event;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  isLoading: boolean;
  error: string | null;
}

export interface CheckoutData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
  specialRequests?: string;
  marketingConsent?: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { eventId: string; ticketTypeId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { eventId: string; ticketTypeId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  currency: 'USD',
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.eventId === action.payload.eventId && 
                item.ticketTypeId === action.payload.ticketTypeId
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity,
        };
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.eventId === action.payload.eventId && 
            item.ticketTypeId === action.payload.ticketTypeId) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => !(item.eventId === action.payload.eventId && 
                 item.ticketTypeId === action.payload.ticketTypeId)
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'LOAD_CART':
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (eventId: string, ticketTypeId: string, quantity: number) => void;
  removeItem: (eventId: string, ticketTypeId: string) => void;
  clearCart: () => void;
  getItemQuantity: (eventId: string, ticketTypeId: string) => number;
  hasItems: boolean;
  // Checkout functions
  saveCheckoutData: (data: CheckoutData) => void;
  loadCheckoutData: () => CheckoutData | null;
  clearCheckoutData: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (eventId: string, ticketTypeId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { eventId, ticketTypeId, quantity } });
  };

  const removeItem = (eventId: string, ticketTypeId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { eventId, ticketTypeId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (eventId: string, ticketTypeId: string) => {
    const item = state.items.find(
      item => item.eventId === eventId && item.ticketTypeId === ticketTypeId
    );
    return item?.quantity || 0;
  };

  const saveCheckoutData = (data: CheckoutData) => {
    localStorage.setItem('checkout_customer_data', JSON.stringify(data));
  };

  const loadCheckoutData = (): CheckoutData | null => {
    const saved = localStorage.getItem('checkout_customer_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading checkout data:', error);
      }
    }
    return null;
  };

  const clearCheckoutData = () => {
    localStorage.removeItem('checkout_customer_data');
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    hasItems: state.items.length > 0,
    saveCheckoutData,
    loadCheckoutData,
    clearCheckoutData,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}; 