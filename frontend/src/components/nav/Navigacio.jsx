import React, { useEffect } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navigacio = () => {
  const { navigation } = useAuthContext(); // getNavItems lekérése az AuthContextből


  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          {
           navigation ? (
            // Ha van navigációs adat, azt dinamikusan rendereljük
            navigation.map( ( item, i ) => (
              <li className="navbar-item" key={i}>
                <Link className="nav-link" to={item.url}>
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
