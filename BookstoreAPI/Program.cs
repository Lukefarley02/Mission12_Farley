using BookstoreAPI.Data;
using Microsoft.EntityFrameworkCore;

// ── Builder phase ────────────────────────────────────────────────────────────
// WebApplication.CreateBuilder sets up configuration (appsettings.json, env
// variables, command-line args) and prepares the dependency injection container.
var builder = WebApplication.CreateBuilder(args);

// Register MVC controllers so ASP.NET can discover and route to them
builder.Services.AddControllers();

// Registers the API explorer, which Swagger uses to discover endpoints
builder.Services.AddEndpointsApiExplorer();

// Registers the Swagger generator — produces an OpenAPI JSON document
// describing every controller action (useful for testing at /swagger)
builder.Services.AddSwaggerGen();

// Register the EF Core DbContext with SQLite as the database provider.
// The connection string "BookstoreConnection" is read from appsettings.json:
//   "Data Source=Bookstore.sqlite"
// This makes BookstoreContext available via dependency injection throughout the app.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Configure Cross-Origin Resource Sharing (CORS).
// Browsers block requests from one origin (e.g., http://localhost:5173) to another
// (e.g., http://localhost:5050) unless the server explicitly allows it.
// This policy permits requests from the Vite dev server and a common React port.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()  // Allow Content-Type, Authorization, etc.
              .AllowAnyMethod(); // Allow GET, POST, PUT, DELETE, etc.
    });
});

// ── App phase ────────────────────────────────────────────────────────────────
// Build the WebApplication from the configured services
var app = builder.Build();

// Only expose Swagger UI in development — never in production
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    // Serves the OpenAPI JSON at /swagger/v1/swagger.json
    app.UseSwaggerUI(); // Serves the interactive UI at /swagger
}

// Apply the CORS policy defined above — must come before MapControllers
app.UseCors("AllowReact");

// Serve the React frontend's static files (index.html, JS, CSS, etc.)
// from the wwwroot folder. This allows the API and frontend to run from
// the same domain when deployed to Azure.
app.UseDefaultFiles(); // Serves index.html for "/" requests
app.UseStaticFiles();  // Serves JS, CSS, images, etc. from wwwroot

// Enable authorization middleware (required even without custom policies)
app.UseAuthorization();

// Map incoming HTTP requests to the appropriate controller actions
app.MapControllers();

// SPA fallback — any request that doesn't match an API route or static file
// gets index.html so React Router can handle client-side routing (e.g., /adminbooks)
app.MapFallbackToFile("index.html");

// Start the web server and begin listening for requests
app.Run();
