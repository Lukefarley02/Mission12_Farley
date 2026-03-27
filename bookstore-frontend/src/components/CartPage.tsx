import { useCart } from '../context/CartContext';
import { BookListState } from '../types/Book';

interface CartPageProps {
  // The saved state from the book list so we can restore it when going back
  savedState: BookListState;
  onContinueShopping: (state: BookListState) => void;
}

/**
 * CartPage component
 *
 * Displays the current shopping cart with:
 *   - Each book's title, unit price, quantity controls, and subtotal
 *   - A running total at the bottom
 *   - "Continue Shopping" button that returns the user to exactly where they left off
 *   - "Clear Cart" button to empty everything at once
 */
export default function CartPage({ savedState, onContinueShopping }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    // Bootstrap Grid: container with a centered, responsive column
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">

          {/* ── Page Header ── */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-2">🛒</span>
              <h1 className="mb-0 fw-bold text-primary">Your Cart</h1>
            </div>

            {/* Continue Shopping restores the user's previous page/filter/sort */}
            <button
              className="btn btn-outline-secondary"
              onClick={() => onContinueShopping(savedState)}
            >
              ← Continue Shopping
            </button>
          </div>

          {/* ── Empty Cart State ── */}
          {items.length === 0 ? (
            <div className="card shadow-sm text-center py-5">
              <div className="card-body">
                <p className="fs-5 text-muted mb-3">Your cart is empty.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => onContinueShopping(savedState)}
                >
                  Browse Books
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Cart Items Table ── */}
              <div className="card shadow-sm mb-4">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Book</th>
                        <th scope="col" className="text-end">Unit Price</th>
                        <th scope="col" className="text-center">Quantity</th>
                        <th scope="col" className="text-end">Subtotal</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.book.bookID}>
                          {/* Book title and author */}
                          <td>
                            <div className="fw-semibold">{item.book.title}</div>
                            <div className="text-muted small">{item.book.author}</div>
                          </td>

                          {/* Unit price */}
                          <td className="text-end align-middle">
                            ${item.book.price.toFixed(2)}
                          </td>

                          {/* Quantity controls — decrement, display, increment */}
                          <td className="text-center align-middle">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQuantity(item.book.bookID, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="fw-semibold" style={{ minWidth: '1.5rem', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQuantity(item.book.bookID, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Subtotal = unit price × quantity */}
                          <td className="text-end align-middle fw-semibold text-success">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </td>

                          {/* Remove button */}
                          <td className="text-center align-middle">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeFromCart(item.book.bookID)}
                              aria-label={`Remove ${item.book.title} from cart`}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Order Total & Actions ── */}
              {/* Bootstrap Grid: push total card to the right */}
              <div className="row justify-content-end">
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">Order Summary</h5>

                      {/* Per-item subtotals */}
                      {items.map(item => (
                        <div key={item.book.bookID} className="d-flex justify-content-between text-muted small mb-1">
                          <span>{item.book.title} × {item.quantity}</span>
                          <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}

                      <hr />

                      {/* Grand total */}
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total</span>
                        <span className="text-success">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clear cart button */}
                  <button
                    className="btn btn-outline-danger w-100 mt-3"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
