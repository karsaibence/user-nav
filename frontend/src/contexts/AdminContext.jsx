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

  const getUsers = async () => {
    const { data } = await myAxios.get("/users");
    console.log(data);
    setUsers(data);
  };

  const fetchNavRoleInfo = async () => {
    const navRoleData = await myAxios.get("/get-nav-items-with-roles");
    setNavRoleInfo(navRoleData.data);
  };

  const fetchAdminData = async () => {
    try {
      const roleData = await myAxios.get("/roles");
      setRole(roleData.data);

      const navsData = await myAxios.get("/navs");
      setNavs(navsData.data);

      getUsers();

      fetchNavRoleInfo();
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchNavigation();
    if (user && user.role_id === 1) {
      fetchAdminData();
    } // Ha a felhasználó be van jelentkezve, töltse le az adatokat
  }, [user]); // Csak akkor fut le, ha a user változik

  return (
    <AdminContext.Provider
      value={{
        fetchNavRoleInfo,
        role,
        navs,
        users,
        navRoleInfo,
        setNavRoleInfo,
        getUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default function useAdminContext() {
  return useContext(AdminContext);
}
