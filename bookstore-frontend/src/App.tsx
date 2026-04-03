// App.tsx — Root component of the React application.
// Uses React Router for navigation between the storefront and admin pages.
// Preserves the user's place in the book list so "Continue Shopping" restores it exactly.
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooks from './components/AdminBooks';
import { BookListState } from './types/Book';

// Default state for the book list — used on first load
const DEFAULT_BOOK_STATE: BookListState = {
  page: 1,
  pageSize: 5,
  sortOrder: 'asc',
  category: '',
};

/**
 * StoreFront component
 *
 * Contains the book list and cart views, managed via local state
 * (not separate routes, to preserve the original navigation behavior).
 */
function StoreFront() {
  const [view, setView] = useState<'books' | 'cart'>('books');

  // Saved state from when the user navigated to the cart
  const [savedBookState, setSavedBookState] = useState<BookListState>(DEFAULT_BOOK_STATE);

  const handleGoToCart = (currentState: BookListState) => {
    setSavedBookState(currentState);
    setView('cart');
  };

  const handleContinueShopping = (state: BookListState) => {
    setSavedBookState(state);
    setView('books');
  };

  return view === 'books' ? (
    <BookList initialState={savedBookState} onGoToCart={handleGoToCart} />
  ) : (
    <CartPage savedState={savedBookState} onContinueShopping={handleContinueShopping} />
  );
}

function App() {
  return (
    // CartProvider wraps everything so both views share the same cart state
    <CartProvider>
      <BrowserRouter>
        <div className="min-vh-100 bg-light">
          <Routes>
            {/* Main storefront — book browsing and cart */}
            <Route path="/" element={<StoreFront />} />
            {/* Admin page — add, edit, delete books */}
            <Route path="/adminbooks" element={<AdminBooks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
