import React from 'react'
import ReactDOM from 'react-dom/client'
import { FronteggProvider } from '@frontegg/react'
import App from './App.jsx'
import './index.css'

const contextOptions = {
  baseUrl: 'https://app-69a4h50ipubw.frontegg.com', // your working tenant URL
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}>
      <App />
    </FronteggProvider>
  </React.StrictMode>
)
