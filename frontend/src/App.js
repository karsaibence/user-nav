import { Route, Routes } from "react-router-dom";
import "./App.css";
import VendegLayout from "./layouts/VendegLayout";
import Fooldal from "./pages/Fooldal";
import { useEffect } from "react";
import useAuthContext from "./contexts/AuthContext";
import { ComponentsMap } from "./components/componentsmap/ComponentsMap";

function App() {
  const { user, navigation, getNavItems } = useAuthContext(); // getNavItems lekérése az AuthContextből

  useEffect(() => {
    getNavItems();
  }, [user]);

  const urls = navigation.map((e, i) => {
    return e.url.replace("/", "");
  });

  console.log(navigation)
  return (
    <Routes>
      <Route path="/" element={<VendegLayout />}>
        <Route index element={<Fooldal />} />
        {navigation.map((e, index) => {
          const Component = ComponentsMap[e.componentName]; // Komponens referenciájának lekérése

          if (!Component) {
            console.error(`Component ${e.componentName} not found.`);
            return null; // Hibakezelés: ha nincs megfelelő komponens, kihagyjuk a route-ot
          }

          return (
            <Route
              key={index}
              path={urls[index]}
              element={<Component />} // Komponens JSX-ben történő renderelése
            />
          );
        })}
      </Route>
    </Routes>
  );
}

export default App;
