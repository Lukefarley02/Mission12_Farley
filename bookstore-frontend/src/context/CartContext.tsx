import { createContext, useContext, useState, ReactNode } from 'react';
import { Book, CartItem } from '../types/Book';

/**
 * Defines the shape of all values and functions exposed by the cart context.
 */
interface CartContextType {
  items: CartItem[];                        // All items currently in the cart
  addToCart: (book: Book) => void;          // Add one copy of a book (or increment qty)
  removeFromCart: (bookID: number) => void; // Remove a book entirely from the cart
  updateQuantity: (bookID: number, quantity: number) => void; // Set exact quantity
  clearCart: () => void;                    // Empty the entire cart
  totalItems: number;                       // Sum of all quantities (for badge display)
  totalPrice: number;                       // Sum of all (price × quantity)
}

// Create the context with undefined as the default —
// components must be wrapped in CartProvider to use it
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider wraps the app and makes cart state available to all
 * child components via useCart(). State lives in memory for the
 * duration of the browser session.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /**
   * Add a book to the cart. If it's already there, increment the quantity.
   */
  const addToCart = (book: Book) => {
    setItems(prev => {
      const existing = prev.find(item => item.book.bookID === book.bookID);
      if (existing) {
        // Book already in cart — just bump the quantity
        return prev.map(item =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // First time adding this book — start at quantity 1
      return [...prev, { book, quantity: 1 }];
    });
  };

  /**
   * Remove a book completely from the cart regardless of quantity.
   */
  const removeFromCart = (bookID: number) => {
    setItems(prev => prev.filter(item => item.book.bookID !== bookID));
  };

  /**
   * Set the quantity of a cart item directly. Removes the item if quantity <= 0.
   */
  const updateQuantity = (bookID: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookID);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.book.bookID === bookID ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Remove all items from the cart.
   */
  const clearCart = () => setItems([]);

  // Derived values computed from the items array
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook for consuming the cart context.
 * Throws an error if used outside of a CartProvider.
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
