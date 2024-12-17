import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { RouteConfig } from "./route";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          {RouteConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.Component />} // Use JSX here
            />
          ))}
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
