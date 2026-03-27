import React from 'react'
import ReactDOM from 'react-dom/client'

// Import Bootstrap 5 CSS globally so all components can use Bootstrap classes
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.tsx'

// Mount the React app into the <div id="root"> element defined in index.html.
// StrictMode activates extra development-only checks and warnings (double-renders
// effects in development to help catch side-effect bugs).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
