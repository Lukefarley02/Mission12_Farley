using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreAPI.Models
{
    /// <summary>
    /// Represents a single book in the bookstore database.
    /// Each property maps directly to a column in the SQLite "Books" table.
    /// The [Required] annotations ensure the model validator rejects any
    /// incomplete data before it ever reaches the database.
    /// </summary>
    [Table("Books")] // Explicitly maps this class to the "Books" table in SQLite
    public class Book
    {
        /// <summary>
        /// Primary key — auto-incremented by SQLite.
        /// The [Key] attribute tells Entity Framework this is the PK.
        /// </summary>
        [Key]
        public int BookID { get; set; }

        /// <summary>
        /// The full title of the book (e.g., "Les Miserables").
        /// </summary>
        [Required]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The name of the author (e.g., "Victor Hugo").
        /// </summary>
        [Required]
        public string Author { get; set; } = string.Empty;

        /// <summary>
        /// The publishing company (e.g., "Signet").
        /// </summary>
        [Required]
        public string Publisher { get; set; } = string.Empty;

        /// <summary>
        /// International Standard Book Number in ISBN-13 format
        /// (e.g., "978-0451419439"). Used as a globally unique book identifier.
        /// </summary>
        [Required]
        public string ISBN { get; set; } = string.Empty;

        /// <summary>
        /// Broad classification of the book's content
        /// (e.g., "Fiction" or "Non-Fiction").
        /// </summary>
        [Required]
        public string Classification { get; set; } = string.Empty;

        /// <summary>
        /// More specific genre or sub-category within the classification
        /// (e.g., "Biography", "Classic", "Historical").
        /// </summary>
        [Required]
        public string Category { get; set; } = string.Empty;

        /// <summary>
        /// Total number of pages in the book.
        /// </summary>
        [Required]
        public int PageCount { get; set; }

        /// <summary>
        /// Retail price in US dollars (e.g., 9.95).
        /// Uses decimal for accurate monetary arithmetic.
        /// </summary>
        [Required]
        public decimal Price { get; set; }
    }
}
