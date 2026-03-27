/**
 * Represents a single book as returned by the API.
 * Property names use camelCase to match the JSON serialization
 * that ASP.NET Core produces from the C# PascalCase model.
 */
export interface Book {
  bookID: number;         // Primary key from the database
  title: string;          // Full book title
  author: string;         // Author's full name
  publisher: string;      // Publishing company
  isbn: string;           // ISBN-13 identifier (e.g., "978-0451419439")
  classification: string; // Broad type: "Fiction" or "Non-Fiction"
  category: string;       // Sub-genre: "Biography", "Classic", "Historical", etc.
  pageCount: number;      // Total number of pages
  price: number;          // Retail price in USD
}

/**
 * Shape of the paginated response from GET /api/books.
 * The API wraps the book array with metadata so the frontend
 * can render pagination controls without a separate request.
 */
export interface BooksResponse {
  books: Book[];       // The books for the current page
  totalCount: number;  // Total books across all pages (within the active filter)
  totalPages: number;  // Total number of pages at the current page size
  currentPage: number; // Which page was returned
  pageSize: number;    // How many books were requested per page
}

/**
 * Represents a single line item in the shopping cart.
 * Extends Book with a quantity field.
 */
export interface CartItem {
  book: Book;      // The book that was added
  quantity: number; // How many copies are in the cart
}

/**
 * The state saved when navigating from the book list to the cart,
 * so the user can return to exactly where they left off.
 */
export interface BookListState {
  page: number;
  pageSize: number;
  sortOrder: 'asc' | 'desc';
  category: string; // Empty string means "All Categories"
}
