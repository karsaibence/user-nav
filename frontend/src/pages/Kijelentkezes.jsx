import React from "react";
import useAuthContext from "../contexts/AuthContext";

const Kijelentkezes = () => {
  const { logout } = useAuthContext();
  return (
    <div>
      <button
        variant="primary"
        onClick={() => {
          logout();
        }}
      >
        Kijelentkezés
      </button>
    </div>
  );
};

export default Kijelentkezes;
