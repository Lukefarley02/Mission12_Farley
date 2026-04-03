import { useState, useEffect } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

// Base URL for all API calls
const API_BASE = 'http://localhost:5050/api';

// Empty book template for the Add form
const EMPTY_BOOK: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

/**
 * AdminBooks component
 *
 * Provides a full CRUD interface for managing books in the database.
 * Features:
 *   - View all books in a table
 *   - Add a new book via a form
 *   - Edit an existing book inline
 *   - Delete a book with confirmation
 */
export default function AdminBooks() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for adding/editing
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState(EMPTY_BOOK);
  const [showAddForm, setShowAddForm] = useState(false);

  // ── Fetch All Books ────────────────────────────────────────────────────────
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all books without pagination for admin view
      const res = await fetch(`${API_BASE}/books?pageSize=1000`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setBooks(data.books);
    } catch {
      setError('Failed to load books. Make sure the API is running on http://localhost:5050.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ── Add Book ───────────────────────────────────────────────────────────────
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBook, bookID: 0 }),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      setNewBook(EMPTY_BOOK);
      setShowAddForm(false);
      setSuccess('Book added successfully!');
      await fetchBooks();
    } catch {
      setError('Failed to add book. Please check your input and try again.');
    }
  };

  // ── Update Book ────────────────────────────────────────────────────────────
  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/books/${editingBook.bookID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBook),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      setEditingBook(null);
      setSuccess('Book updated successfully!');
      await fetchBooks();
    } catch {
      setError('Failed to update book. Please check your input and try again.');
    }
  };

  // ── Delete Book ────────────────────────────────────────────────────────────
  const handleDeleteBook = async (bookID: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/books/${bookID}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      setSuccess('Book deleted successfully!');
      await fetchBooks();
    } catch {
      setError('Failed to delete book.');
    }
  };

  // ── Reusable Book Form ─────────────────────────────────────────────────────
  const BookForm = ({
    book,
    onChange,
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    book: Omit<Book, 'bookID'> & { bookID?: number };
    onChange: (field: string, value: string | number) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel: string;
  }) => (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Title</label>
          <input
            type="text"
            className="form-control"
            value={book.title}
            onChange={e => onChange('title', e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Author</label>
          <input
            type="text"
            className="form-control"
            value={book.author}
            onChange={e => onChange('author', e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Publisher</label>
          <input
            type="text"
            className="form-control"
            value={book.publisher}
            onChange={e => onChange('publisher', e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">ISBN</label>
          <input
            type="text"
            className="form-control"
            value={book.isbn}
            onChange={e => onChange('isbn', e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Classification</label>
          <select
            className="form-select"
            value={book.classification}
            onChange={e => onChange('classification', e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Category</label>
          <input
            type="text"
            className="form-control"
            value={book.category}
            onChange={e => onChange('category', e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Page Count</label>
          <input
            type="number"
            className="form-control"
            value={book.pageCount}
            onChange={e => onChange('pageCount', Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Price ($)</label>
          <input
            type="number"
            className="form-control"
            value={book.price}
            onChange={e => onChange('price', Number(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-2">📋</span>
          <div>
            <h1 className="mb-0 fw-bold text-primary">Admin — Manage Books</h1>
            <p className="text-muted mb-0 small">Add, edit, and delete books in the database</p>
          </div>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          ✓ {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Add Book Button / Form */}
      <div className="mb-4">
        {!showAddForm && !editingBook && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            + Add New Book
          </button>
        )}

        {showAddForm && (
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white fw-semibold">
              Add New Book
            </div>
            <div className="card-body">
              <BookForm
                book={newBook}
                onChange={(field, value) =>
                  setNewBook(prev => ({ ...prev, [field]: value }))
                }
                onSubmit={handleAddBook}
                onCancel={() => {
                  setShowAddForm(false);
                  setNewBook(EMPTY_BOOK);
                }}
                submitLabel="Add Book"
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Form (shown when editing a book) */}
      {editingBook && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-warning text-dark fw-semibold">
            Editing: {editingBook.title}
          </div>
          <div className="card-body">
            <BookForm
              book={editingBook}
              onChange={(field, value) =>
                setEditingBook(prev => (prev ? { ...prev, [field]: value } : null))
              }
              onSubmit={handleUpdateBook}
              onCancel={() => setEditingBook(null)}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p className="mt-2 text-muted">Loading books…</p>
        </div>
      )}

      {/* Books Table */}
      {!loading && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-primary">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col">Category</th>
                  <th scope="col" className="text-end">Price</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  books.map(book => (
                    <tr key={book.bookID}>
                      <td className="text-muted">{book.bookID}</td>
                      <td className="fw-semibold">{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className="badge bg-info text-dark">{book.category}</span>
                      </td>
                      <td className="text-end fw-semibold text-success">
                        ${book.price.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setEditingBook(book);
                              setShowAddForm(false);
                            }}
                            disabled={editingBook !== null}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteBook(book.bookID, book.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-center text-muted small mt-3">
        {books.length} book{books.length !== 1 ? 's' : ''} in database
      </p>
    </div>
  );
}
