import { useState, useEffect, useCallback } from 'react';
import { Book, BooksResponse, BookListState } from '../types/Book';
import { useCart } from '../context/CartContext';

// Base URL for all API calls
// In development (Vite), use the full localhost URL
// In production (served from the API), use a relative path
const API_BASE = import.meta.env.DEV ? 'http://localhost:5050/api' : '/api';

interface BookListProps {
  // Initial state to restore when returning from the cart page
  initialState?: BookListState;
  // Called when the user clicks "Go to Cart" so App.tsx can switch views
  onGoToCart: (currentState: BookListState) => void;
}

/**
 * BookList component
 *
 * Fetches books from the ASP.NET API and displays them in a paginated,
 * sortable, filterable Bootstrap table. Features:
 *   - Category filter dropdown (populated from the API)
 *   - 5 books per page by default, user-selectable page size
 *   - A–Z / Z–A title sort toggle
 *   - Add to Cart button per row
 *   - Cart summary bar showing item count and total
 *
 * New Bootstrap features used:
 *   1. sticky-top — keeps the controls bar visible while scrolling
 *   2. Positioned badge — shows cart item count overlaid on the cart button
 *      using position-relative / position-absolute / translate-middle
 */
export default function BookList({ initialState, onGoToCart }: BookListProps) {
  const { addToCart, totalItems, totalPrice } = useCart();

  // ── State ──────────────────────────────────────────────────────────────────

  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialState?.page ?? 1);
  const [pageSize, setPageSize] = useState(initialState?.pageSize ?? 5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialState?.sortOrder ?? 'asc');
  const [category, setCategory] = useState(initialState?.category ?? ''); // '' = All
  const [categories, setCategories] = useState<string[]>([]);             // Dropdown options
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);    // For "Added!" flash

  // ── Fetch Categories (once on mount) ──────────────────────────────────────

  useEffect(() => {
    fetch(`${API_BASE}/books/categories`)
      .then(res => res.json())
      .then((data: string[]) => setCategories(data))
      .catch(() => {}); // Silently ignore if categories fail to load
  }, []);

  // ── Fetch Books ────────────────────────────────────────────────────────────

  /**
   * Fetches the current page of books from the API using all active filters.
   * useCallback ensures the function reference is stable between renders,
   * so the useEffect below only re-runs when a dependency actually changes.
   */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string — category is omitted when empty (returns all books)
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
        sortOrder,
        ...(category ? { category } : {}),
      });

      const res = await fetch(`${API_BASE}/books?${params}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data: BooksResponse = await res.json();
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch {
      setError('Failed to load books. Make sure the API is running on http://localhost:5050.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortOrder, category]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ── Event Handlers ─────────────────────────────────────────────────────────

  // Reset to page 1 when page size changes so we don't land on an invalid page
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Toggle sort direction and reset to page 1
  const toggleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  // Change category filter and reset to page 1
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  /**
   * Add a book to the cart and briefly show an "Added!" indicator on that row.
   */
  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setAddedBookId(book.bookID);
    setTimeout(() => setAddedBookId(null), 1200);
  };

  /**
   * Navigate to the cart, passing the current state so we can restore it later.
   */
  const handleGoToCart = () => {
    onGoToCart({ page: currentPage, pageSize, sortOrder, category });
  };

  // ── Pagination Logic ───────────────────────────────────────────────────────

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="container py-4">

      {/* ── Page Header ── */}
      <div className="d-flex align-items-center mb-4">
        <span className="me-2 fs-2">📚</span>
        <div>
          <h1 className="mb-0 fw-bold text-primary">Online Bookstore</h1>
          <p className="text-muted mb-0 small">Professor Hilton's recommended reads</p>
        </div>
      </div>

      {/*
        ── Controls Bar ──
        NEW BOOTSTRAP FEATURE #1: sticky-top
        Keeps the controls visible as the user scrolls down through the book list.
      */}
      <div className="card shadow-sm mb-4 sticky-top" style={{ zIndex: 100 }}>
        <div className="card-body py-3">
          {/* Bootstrap Grid row for the controls */}
          <div className="row align-items-center g-2">

            {/* Category filter dropdown */}
            <div className="col-auto">
              <label className="form-label fw-semibold mb-0 me-1">Category:</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Results-per-page dropdown */}
            <div className="col-auto">
              <label className="form-label fw-semibold mb-0 me-1">Per page:</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={pageSize}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
              >
                {[5, 10, 25].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Sort toggle */}
            <div className="col-auto">
              <button className="btn btn-outline-primary btn-sm" onClick={toggleSort}>
                Sort by Title&nbsp;{sortOrder === 'asc' ? '↑ A–Z' : '↓ Z–A'}
              </button>
            </div>

            {/* Total count */}
            <div className="col-auto text-muted small">
              {totalCount} book{totalCount !== 1 ? 's' : ''}
            </div>

            {/*
              Cart button — pushed to the right via ms-auto
              NEW BOOTSTRAP FEATURE #2: Positioned badge
              position-absolute + translate-middle floats the count badge
              over the top-right corner of the button.
            */}
            <div className="col-auto ms-auto">
              <button
                className="btn btn-success position-relative"
                onClick={handleGoToCart}
              >
                🛒 Cart
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Cart Summary Bar (shown only when cart has items) ── */}
      {totalItems > 0 && (
        <div className="alert alert-success d-flex justify-content-between align-items-center mb-4 py-2">
          <span>
            🛒 <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} in your cart
            &nbsp;—&nbsp;
            <strong>${totalPrice.toFixed(2)}</strong> total
          </span>
          <button className="btn btn-success btn-sm" onClick={handleGoToCart}>
            View Cart →
          </button>
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && (
        <div className="alert alert-danger" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p className="mt-2 text-muted">Loading books…</p>
        </div>
      )}

      {/* ── Book Table ── */}
      {!loading && !error && (
        <div className="card shadow-sm mb-4">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-primary">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col">Publisher</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Classification</th>
                  <th scope="col">Category</th>
                  <th scope="col" className="text-end">Pages</th>
                  <th scope="col" className="text-end">Price</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-4">
                      No books found for this category.
                    </td>
                  </tr>
                ) : (
                  books.map((book, idx) => (
                    <tr key={book.bookID}>
                      <td className="text-muted small">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="fw-semibold">{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher}</td>
                      <td><span className="font-monospace small">{book.isbn}</span></td>
                      <td><span className="badge bg-secondary">{book.classification}</span></td>
                      <td><span className="badge bg-info text-dark">{book.category}</span></td>
                      <td className="text-end">{book.pageCount.toLocaleString()}</td>
                      <td className="text-end fw-semibold text-success">
                        ${book.price.toFixed(2)}
                      </td>
                      {/* Add to Cart — briefly shows "Added!" confirmation after click */}
                      <td className="text-center">
                        <button
                          className={`btn btn-sm ${addedBookId === book.bookID ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleAddToCart(book)}
                        >
                          {addedBookId === book.bookID ? '✓ Added!' : '+ Cart'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination Controls ── */}
      {!loading && totalPages > 1 && (
        <nav aria-label="Book pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                &laquo; Prev
              </button>
            </li>
            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <li key={`ellipsis-${i}`} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              )
            )}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {!loading && totalPages > 0 && (
        <p className="text-center text-muted small">
          Page {currentPage} of {totalPages}
        </p>
      )}

    </div>
  );
}
