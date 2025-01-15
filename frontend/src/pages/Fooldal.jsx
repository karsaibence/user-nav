import React from "react";
import useAuthContext from "../contexts/AuthContext";

const Fooldal = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Kezdőlap</h1>
      <p>
        Bejelentkezett felhasználó:{" "}
        {user === null ? "Nincs bejelentkezett felhasználó!" : user.name}
      </p>
    </div>
  );
};

export default Fooldal;
