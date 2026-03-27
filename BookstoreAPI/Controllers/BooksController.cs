using BookstoreAPI.Data;
using BookstoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreAPI.Controllers
{
    /// <summary>
    /// REST API controller that exposes endpoints for reading book data.
    /// Base route: /api/books
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        // The EF Core context injected by the DI container — our gateway to the database
        private readonly BookstoreContext _context;

        /// <summary>
        /// Constructor — ASP.NET's dependency injection automatically provides
        /// the BookstoreContext instance registered in Program.cs.
        /// </summary>
        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/books
        /// Returns a paginated, sorted, and optionally category-filtered list of books.
        ///
        /// Query parameters:
        ///   page      - which page to return (default: 1)
        ///   pageSize  - how many books per page (default: 5)
        ///   sortOrder - "asc" for A→Z or "desc" for Z→A by title (default: "asc")
        ///   category  - filter to a specific category, e.g. "Biography" (optional)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<BooksResponse>> GetBooks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string sortOrder = "asc",
            [FromQuery] string? category = null)
        {
            // Guard against invalid page/size values coming from the client
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 5;

            // Start with the full Books table as an IQueryable —
            // nothing is sent to the database yet; queries are built lazily
            IQueryable<Book> query = _context.Books;

            // Apply category filter if one was provided — narrows results to that genre
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // Apply title sort — translates to ORDER BY Title ASC/DESC in SQL
            query = sortOrder.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            // COUNT(*) — needed to calculate total pages for the pagination UI
            int totalCount = await query.CountAsync();

            // Calculate total pages, rounding up so a partial page still shows
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Clamp page to valid range in case the category switch reduces total pages
            if (page > totalPages && totalPages > 0) page = totalPages;

            // SKIP and TAKE implement SQL OFFSET / LIMIT for the current page
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new BooksResponse
            {
                Books = books,
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            });
        }

        /// <summary>
        /// GET /api/books/categories
        /// Returns a distinct, alphabetically sorted list of all category values.
        /// Used to populate the category filter dropdown in the frontend.
        /// </summary>
        [HttpGet("categories")]
        public async Task<ActionResult<List<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)   // Pull just the Category column
                .Distinct()                // Remove duplicates
                .OrderBy(c => c)           // Sort alphabetically
                .ToListAsync();

            return Ok(categories);
        }

        /// <summary>
        /// GET /api/books/{id}
        /// Returns a single book by its primary key (BookID).
        /// Returns 404 Not Found if no book with that ID exists.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();
            return book;
        }
    }

    /// <summary>
    /// Shape of the JSON response returned by GET /api/books.
    /// Wraps the book list with pagination metadata so the React
    /// frontend knows the total page count without a separate request.
    /// </summary>
    public class BooksResponse
    {
        /// <summary>The books for the current page.</summary>
        public List<Book> Books { get; set; } = new();

        /// <summary>Total number of books across all pages (within the active filter).</summary>
        public int TotalCount { get; set; }

        /// <summary>Total number of pages at the current page size.</summary>
        public int TotalPages { get; set; }

        /// <summary>The page number that was returned.</summary>
        public int CurrentPage { get; set; }

        /// <summary>How many books were requested per page.</summary>
        public int PageSize { get; set; }
    }
}
