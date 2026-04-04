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

        /// <summary>
        /// Seeds the database with initial book data using EF Core's HasData method.
        /// This ensures the Books table always has data regardless of whether the
        /// .sqlite file was found on disk (important for Azure deployment).
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>().HasData(
                new Book { BookID = 1, Title = "Les Miserables", Author = "Victor Hugo", Publisher = "Signet", ISBN = "978-0451419439", Classification = "Fiction", Category = "Classic", PageCount = 1488, Price = 9.95m },
                new Book { BookID = 2, Title = "Team of Rivals", Author = "Doris Kearns Goodwin", Publisher = "Simon & Schuster", ISBN = "978-0743270755", Classification = "Non-Fiction", Category = "Biography", PageCount = 944, Price = 14.58m },
                new Book { BookID = 3, Title = "The Snowball", Author = "Alice Schroeder", Publisher = "Bantam", ISBN = "978-0553384611", Classification = "Non-Fiction", Category = "Biography", PageCount = 832, Price = 21.54m },
                new Book { BookID = 4, Title = "American Ulysses", Author = "Ronald C. White", Publisher = "Random House", ISBN = "978-0812981254", Classification = "Non-Fiction", Category = "Biography", PageCount = 864, Price = 11.61m },
                new Book { BookID = 5, Title = "Unbroken", Author = "Laura Hillenbrand", Publisher = "Random House", ISBN = "978-0812974492", Classification = "Non-Fiction", Category = "Historical", PageCount = 528, Price = 13.33m },
                new Book { BookID = 6, Title = "The Great Train Robbery", Author = "Michael Crichton", Publisher = "Vintage", ISBN = "978-0804171281", Classification = "Fiction", Category = "Historical", PageCount = 288, Price = 13.33m },
                new Book { BookID = 7, Title = "Deep Work", Author = "Cal Newport", Publisher = "Grand Central Publishing", ISBN = "978-1455586691", Classification = "Non-Fiction", Category = "Self-Help", PageCount = 304, Price = 14.99m },
                new Book { BookID = 8, Title = "It's Your Ship", Author = "Michael Abrashoff", Publisher = "Grand Central Publishing", ISBN = "978-1455523023", Classification = "Non-Fiction", Category = "Self-Help", PageCount = 240, Price = 21.66m },
                new Book { BookID = 9, Title = "The Virgin Way", Author = "Richard Branson", Publisher = "Portfolio", ISBN = "978-1591847984", Classification = "Non-Fiction", Category = "Business", PageCount = 400, Price = 29.16m },
                new Book { BookID = 10, Title = "Sycamore Row", Author = "John Grisham", Publisher = "Batnam", ISBN = "978-0553393613", Classification = "Fiction", Category = "Thrillers", PageCount = 642, Price = 15.03m },
                new Book { BookID = 11, Title = "The Way I Heard It", Author = "Mike Rowe", Publisher = "Gallery Books", ISBN = "978-1982131470", Classification = "Fiction", Category = "Historical", PageCount = 272, Price = 12.30m },
                new Book { BookID = 12, Title = "The Complete Personal Memoirs of Ulysses S. Grant", Author = "Ulysses S. Grant", Publisher = "CreateSpace Independent Publishing Platform", ISBN = "978-1481216043", Classification = "Non-Fiction", Category = "Biography", PageCount = 552, Price = 19.99m },
                new Book { BookID = 13, Title = "The Screwtape Letters", Author = "C.S. Lewis", Publisher = "HarperOne", ISBN = "978-0060652937", Classification = "Fiction", Category = "Christian Books", PageCount = 209, Price = 10.27m },
                new Book { BookID = 14, Title = "Sleep Smarter", Author = "Shawn Stevenson", Publisher = "Rodale Books", ISBN = "978-1623367398", Classification = "Non-Fiction", Category = "Health", PageCount = 288, Price = 17.59m },
                new Book { BookID = 15, Title = "Titan", Author = "Ron Chernow", Publisher = "Vintage", ISBN = "978-1400077304", Classification = "Non-Fiction", Category = "Biography", PageCount = 832, Price = 16.59m },
                new Book { BookID = 16, Title = "The Hunt for Red October", Author = "Tom Clancy", Publisher = "Berkley", ISBN = "978-0440001027", Classification = "Fiction", Category = "Action", PageCount = 656, Price = 9.99m }
            );
        }
    }
}
