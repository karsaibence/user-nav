import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/Axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [navigation, setNavigation] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");

  //bejelentkezett felhasználó adatainak lekérdezése
  const getUser = async () => {
    const { data } = await myAxios.get("/user");
    console.log(data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const fetchNavigation = async () => {
    try {
      const navData = await myAxios.get("/nav-items");
      setNavigation(navData.data); // A navigációs adatok beállítása
    } catch (error) {
      console.error("Hiba a navigációs adatok lekérésekor:", error);
    }
  };

  const logout = async () => {
    try {
      await csrf(); // CSRF cookie lekérése

      // Kijelentkezés az API-ból
      await myAxios.post("/logout");
      localStorage.removeItem("user");
      // Felhasználó törlése és navigációs lista frissítése
      setUser(null);
      setNavigation([]);
      //fetchNavigation();
      navigate("/");
      // Navigációs adat frissítése
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loginReg = async ({ ...adat }, vegpont) => {
    //lekérjük a csrf tokent
    await csrf();
    console.log(adat, vegpont);

    try {
      await myAxios.post(vegpont, adat);
      console.log("siker");
      //sikeres bejelentkezés/regisztráció esetén
      //Lekérdezzük a usert
      await getUser();
      //elmegyünk  a kezdőlapra
    } catch (error) {
      console.log(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
    navigate("/");
  };

  useEffect(() => {
    // Ellenőrizzük, hogy van-e mentett felhasználó
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []); // Csak egyszer fut le, amikor az oldal betöltődik

  return (
    <AuthContext.Provider
      value={{
        logout,
        loginReg,
        getUser,
        errors,
        user,
        navigation,
        fetchNavigation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuthContext() {
  return useContext(AuthContext);
}
