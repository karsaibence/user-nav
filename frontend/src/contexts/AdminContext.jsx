import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/Axios";
import useAuthContext from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user, fetchNavigation } = useAuthContext();
  
  const [role, setRole] = useState([]);
  const [users, setUsers] = useState([]);
  const [navs, setNavs] = useState([]);
  const [navRoleInfo, setNavRoleInfo] = useState([]);

  const fetchAdminNavItems = async () => {
    try {
      const response = await myAxios.get("/get-nav-items-with-roles"); // Backend hívás
      if (response.data && Array.isArray(response.data)) {
        console.log("NavRoleInfo válasz:", response.data); // Debugging
        return response.data;
      } else {
        console.error("Unexpected response format:", response);
        return [];
      }
    } catch (error) {
      console.error("Hiba a navRoleInfo lekérésekor:", error);
      return [];
    }
  };

  const getUsers = async () => {
    const { data } = await myAxios.get("/users");
    console.log(data);
    setUsers(data);
  };

  const fetchAdminData = async () => {
    try {
      // Navigációs adatok lekérése, ha a felhasználó bejelentkezett

      if (user && user.role !== null) {
        const navRoleData = await myAxios.get("/get-nav-items-with-roles");
        setNavRoleInfo(navRoleData.data);

        const roleData = await myAxios.get("/roles");
        setRole(roleData.data);

        const navsData = await myAxios.get("/navs");
        setNavs(navsData.data);

        getUsers();
        //const navRoleDataByRole = await myAxios.get("/get-roles-nav");
        //setNavsByRole(navRoleDataByRole.data);
      }
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchNavigation();
    if (user) {
      if (user.role_id === 1) {
        fetchAdminData();
      } // Ha a felhasználó be van jelentkezve, töltse le az adatokat
    }
  }, [user]); // Csak akkor fut le, ha a user változik

  return (
    <AdminContext.Provider
      value={{
        fetchAdminData,
        fetchAdminNavItems,
        role,
        navs,
        users,
        navRoleInfo,
        setNavRoleInfo,
        getUsers,
      }}>
      {children}
    </AdminContext.Provider>
  );
};

export default function useAdminContext() {
  return useContext(AdminContext);
}
