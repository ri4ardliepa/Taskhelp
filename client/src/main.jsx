import React from "react"
import ReactDOM from "react-dom/client"
import { Auth0Provider } from "@auth0/auth0-react"
import App from "./App"
import "./index.css"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-tjeu4rm2m5cxo43x.us.auth0.com"
      clientId="WqtHxRvj4SyJgALY5PJhAryjJO2bMceM"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
      audience="http://localhost:8000"
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
