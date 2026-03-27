using BookstoreAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookstoreAPI.Data
{
    /// <summary>
    /// The Entity Framework Core database context for the bookstore application.
    /// This class acts as the bridge between the C# model classes and the
    /// underlying SQLite database. All database queries go through this context.
    /// </summary>
    public class BookstoreContext : DbContext
    {
        /// <summary>
        /// Constructor — receives database options (connection string, provider, etc.)
        /// from the dependency injection container configured in Program.cs,
        /// and passes them to the base DbContext class.
        /// </summary>
        /// <param name="options">EF Core options including the SQLite connection string.</param>
        public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

        /// <summary>
        /// Represents the "Books" table in the SQLite database.
        /// EF Core uses this DbSet to generate and execute SQL queries
        /// (SELECT, INSERT, UPDATE, DELETE) against the Books table.
        /// </summary>
        public DbSet<Book> Books { get; set; }
    }
}
