import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppWithAuth } from './App'
import './index.css'
import './registerSW'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
)
