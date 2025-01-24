import { createContext, useContext, useEffect, useState } from "react";
import { myAxios } from "../api/Axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ( { children } ) => {
  const navigate = useNavigate();
  const [ user, setUser ] = useState( null );
  const [ users, setUsers ] = useState( [] );
  const [ navs, setNavs ] = useState( [] );
  const [ navigation, setNavigation ] = useState( [] );
  const [ navsByRole, setNavsByRole ] = useState( [] );
  const [ navRoleInfo, setNavRoleInfo ] = useState( [] );
  const [ role, setRole ] = useState( [] );
  const [ errors, setErrors ] = useState( {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  } );

  const csrf = () => myAxios.get( "/sanctum/csrf-cookie" );

  //bejelentkezett felhasználó adatainak lekérdezése
  const getUser = async () => {
    const { data } = await myAxios.get( "/user" );
    console.log( data );
    setUser( data );
    localStorage.setItem( "user", JSON.stringify( data ) );
  };

  const getUsers = async () => {
    const { data } = await myAxios.get( "/users" );
    console.log( data );
    setUsers( data );
  };



  const fetchNavigation = async () => {
    try {
      const navData = await myAxios.get( "/nav-items" );
      setNavigation( navData.data ); // A navigációs adatok beállítása
    } catch ( error ) {
      console.error( "Hiba a navigációs adatok lekérésekor:", error );
    }
  };

  const logout = async () => {
    try {
      await csrf(); // CSRF cookie lekérése

      // Kijelentkezés az API-ból
      await myAxios.post( "/logout" );
      localStorage.removeItem( "user" );
      // Felhasználó törlése és navigációs lista frissítése
      setUser( null );
      setNavigation( [] );
      fetchNavigation();
      navigate( "/" );
      // Navigációs adat frissítése
    } catch ( error ) {
      console.error( "Logout error:", error );
    }
  };

  const loginReg = async ( { ...adat }, vegpont ) => {
    //lekérjük a csrf tokent
    await csrf();
    console.log( adat, vegpont );

    try {
      await myAxios.post( vegpont, adat );
      console.log( "siker" );
      //sikeres bejelentkezés/regisztráció esetén
      //Lekérdezzük a usert
      await getUser();
      //elmegyünk  a kezdőlapra
    } catch ( error ) {
      console.log( error );
      if ( error.response.status === 422 ) {
        setErrors( error.response.data.errors );
      }
    }
    navigate( "/" );
  };

  const fetchAdminNavItems = async () => {
    try {
      const response = await myAxios.get( "/get-nav-items-with-roles" ); // Backend hívás
      if ( response.data && Array.isArray( response.data ) ) {
        console.log( "NavRoleInfo válasz:", response.data ); // Debugging
        return response.data;
      } else {
        console.error( "Unexpected response format:", response );
        return [];
      }
    } catch ( error ) {
      console.error( "Hiba a navRoleInfo lekérésekor:", error );
      return [];
    }
  };

  const fetchAdminData = async () => {
    try {
      // Navigációs adatok lekérése, ha a felhasználó bejelentkezett

      if ( user && user.role !== null ) {
        const navRoleData = await myAxios.get( "/get-nav-items-with-roles" );
        setNavRoleInfo( navRoleData.data );

        const roleData = await myAxios.get( "/roles" );
        setRole( roleData.data );

        const navsData = await myAxios.get( "/navs" );
        setNavs( navsData.data );

        getUsers();
        //const navRoleDataByRole = await myAxios.get("/get-roles-nav");
        //setNavsByRole(navRoleDataByRole.data);
      }
    } catch ( error ) {
      console.error( "Hiba az adatok lekérésekor:", error );
    }
  };

  useEffect( () => {
    // Ellenőrizzük, hogy van-e mentett felhasználó
    const savedUser = localStorage.getItem( "user" );

    if ( savedUser ) {
      setUser( JSON.parse( savedUser ) );
    } else {
      getUser(); // Ha nincs mentett felhasználó, kérjük le
    }
  }, [] ); // Csak egyszer fut le, amikor az oldal betöltődik

  useEffect( () => {
    fetchNavigation();
    if ( user ) {
      if ( user.role_id === 1 ) {
        fetchAdminData();
      } // Ha a felhasználó be van jelentkezve, töltse le az adatokat
    }
  }, [ user ] ); // Csak akkor fut le, ha a user változik

  return (
    <AuthContext.Provider
      value={{
        logout,
        loginReg,
        fetchAdminData,
        fetchAdminNavItems,
        getUser,
        errors,
        user,
        navigation,
        navsByRole,
        navRoleInfo,
        role,
        navs,
        setNavRoleInfo,
        users,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuthContext() {
  return useContext( AuthContext );
}
