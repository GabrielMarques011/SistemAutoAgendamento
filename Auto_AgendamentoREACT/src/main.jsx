import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import './tailwind.css'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
