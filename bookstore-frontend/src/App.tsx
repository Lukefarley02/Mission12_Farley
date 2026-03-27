// App.tsx — Root component of the React application.
// Manages which view is shown (book list vs. cart) and preserves the
// user's place in the book list so "Continue Shopping" restores it exactly.
import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import { BookListState } from './types/Book';

// The two possible views in the app
type View = 'books' | 'cart';

// Default state for the book list — used on first load
const DEFAULT_BOOK_STATE: BookListState = {
  page: 1,
  pageSize: 5,
  sortOrder: 'asc',
  category: '',
};

function App() {
  const [view, setView] = useState<View>('books');

  // Saved state from when the user navigated to the cart —
  // passed back to BookList so it restores the exact page/filter/sort
  const [savedBookState, setSavedBookState] = useState<BookListState>(DEFAULT_BOOK_STATE);

  // Called by BookList when the user clicks the Cart button
  const handleGoToCart = (currentState: BookListState) => {
    setSavedBookState(currentState); // Save where they were
    setView('cart');
  };

  // Called by CartPage when the user clicks "Continue Shopping"
  const handleContinueShopping = (state: BookListState) => {
    setSavedBookState(state);
    setView('books');
  };

  return (
    // CartProvider wraps everything so both views share the same cart state
    <CartProvider>
      <div className="min-vh-100 bg-light">
        {view === 'books' ? (
          // Pass saved state so the list resumes from the right page/filter
          <BookList
            initialState={savedBookState}
            onGoToCart={handleGoToCart}
          />
        ) : (
          <CartPage
            savedState={savedBookState}
            onContinueShopping={handleContinueShopping}
          />
        )}
      </div>
    </CartProvider>
  );
}

export default App;
