import App from "./App";
import AuthnProvider from "./providers/AuthnProvider";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthnProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              headings: {
                fontWeight: 500,
              },
            }}
          >
            <App />
          </MantineProvider>
        </AuthnProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
