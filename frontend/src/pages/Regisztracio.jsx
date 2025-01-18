import React, { useState } from "react";
import useAuthContext from "../contexts/AuthContext";

const Regisztracio = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");

  const { loginReg, errors } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Összegyűjtjük egyetlen objektumban az űrlap adatokat
    const adat = {
      name: name,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    };

    loginReg(adat, "/register");
  };

  return (
    <div className="m-auto" style={{ maxWidth: "400px" }}>
      <h1 className="text-center">Regisztráció</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">
            Név:
          </label>
          <input
            type="text"
            // value beállítása a state értékére
            value={name}
            // state értékének módosítása ha változik a beviteli mező tartalma
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="form-control"
            id="name"
            placeholder="név"
            name="name"
          />
        </div>
        <div>
          {errors.email && (
            <span className="text-danger">{errors.name[0]}</span>
          )}
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            // value beállítása a state értékére
            value={email}
            // state értékének módosítása ha változik a beviteli mező tartalma
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="form-control"
            id="email"
            placeholder="email"
            name="email"
          />
        </div>
        <div>
          {errors.email && (
            <span className="text-danger">{errors.email[0]}</span>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="pwd" className="form-label">
            Jelszó:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="form-control"
            id="pwd"
            placeholder="jelszó"
            name="pwd"
          />
          <div>
            {errors.password && (
              <span className="text-danger">{errors.password[0]}</span>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="pwdcmn" className="form-label">
            Jelszó:
          </label>
          <input
            type="password"
            value={password_confirmation}
            onChange={(e) => {
              setPassword_confirmation(e.target.value);
            }}
            className="form-control"
            id="pwdcmn"
            placeholder="jelszó újra"
            name="pwdcmn"
          />
        </div>

        <div className=" text-center">
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Regisztracio;
