import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './AuthContext' // 👈 import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 wrap your app */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
