import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Auth0Provider} from "@auth0/auth0-react";
import './main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: import.meta.env.VITE_AUTH0_SCOPE
          }}
      >
          <App/>
      </Auth0Provider>
  </StrictMode>,
)
