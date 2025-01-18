import React, { useEffect } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navigacio = () => {
  const { user, navigation, getNavItems } = useAuthContext(); // getNavItems lekérése az AuthContextből

  useEffect( () => {
    getNavItems();
  }, [ user ] );

  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          {navigation.length > 0 ? (
            // Ha van navigációs adat, azt dinamikusan rendereljük
            navigation.map( ( item ) => (
              <li className="navbar-item" key={item.id}>
                <Link className="nav-link" to={item.url} >
                  {item.megnevezes}
                </Link>
              </li>
            ) )
          ) : (
            // Ha még nincs adat, vagy töltődik, akkor egy "loading" állapotot mutatunk
            <li className="navbar-item">
              <span className="nav-link">Loading...</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigacio;
