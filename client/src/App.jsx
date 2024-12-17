import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { privateRoutes, publicRoutes } from "./routes";

function App() {
  const token = useSelector((state) => state.accessToken);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {!token
            ? publicRoutes.map((route, index) => {
                const Component = route.component;
                return (
                  <>
                    <Route
                      key={`route-${index}`}
                      path={route.path}
                      element={
                        <Suspense fallback={"loading..."}>
                          <Component />
                        </Suspense>
                      }
                    />
                  </>
                );
              })
            : privateRoutes.map((route, index) => {
                const Component = route.component;
                return (
                  <>
                    <Route
                      key={`route-${index}`}
                      path={route.path}
                      element={
                        <Suspense fallback={"loading..."}>
                          <Component />
                        </Suspense>
                      }
                    />
                  </>
                );
              })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
