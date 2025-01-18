import { createContext, useContext, useState } from "react";
import { myAxios } from "../api/Axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ( { children } ) => {
  const navigate = useNavigate();
  const [ user, setUser ] = useState( null );
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
  };

  const logout = async () => {
    try {
      await csrf(); // CSRF cookie lekérése

      // Kijelentkezés az API-ból
      await myAxios.post( "/logout" );

      // Felhasználó törlése és navigációs lista frissítése
      setUser( null );
      setNavigation( [] );
      navigate( "/" );
      // Navigációs adat frissítése
    } catch ( error ) {
      console.error( "Logout error:", error );
    }
  };

  const getNavItemsWithRoles = async () => {

    try {
      const { data } = await myAxios.get( "/get-nav-items-with-roles" ); // Az új végpont, amely a felhasználó szerepe alapján adja vissza a menüpontokat
      setNavRoleInfo( data ); // Az adatokat beállítjuk a navigation állapotba
    } catch ( error ) {
      console.error( "Failed to fetch navigation items", error );
    }
  };


  const getNavItems = async () => {

    try {
      const { data } = await myAxios.get( "/nav-items" ); // Az új végpont, amely a felhasználó szerepe alapján adja vissza a menüpontokat
      setNavigation( data ); // Az adatokat beállítjuk a navigation állapotba
    } catch ( error ) {
      console.error( "Failed to fetch navigation items", error );
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
      //await getUser();
      //elmegyünk  a kezdőlapra
      getUser();
      getNavItems();
      navigate( "/" );
    } catch ( error ) {
      console.log( error );
      if ( error.response.status === 422 ) {
        setErrors( error.response.data.errors );
      }
    }
  };

  const getNavsByRole = async () => {
    try {
      const { data } = await myAxios.get( '/get-roles-nav' );
      setNavsByRole( data );
    } catch ( error ) {
      console.log( error )
    }
  };

  const getRoles = async () => {
    try {
      const { data } = await myAxios.get( '/roles' );
      setRole( data );
    } catch ( error ) {
      console.log( error )
    }
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        loginReg,
        errors,
        getUser,
        user,
        getNavItems,
        navigation,
        navsByRole,
        getNavsByRole,
        getRoles,
        navRoleInfo,
        role,
        setNavRoleInfo,
        getNavItemsWithRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuthContext() {
  return useContext( AuthContext );
}
