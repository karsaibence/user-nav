/*
import axios from "axios";

// Létrehozunk egy új Axios példányt a create metódus segítségével.
export const myAxios = axios.create({
  // Alap backend API kiszolgáló elérési útjának beállítása
  baseURL: "http://localhost:8000/api",
  // Beállítjuk, hogy a kérések azonosítása cookie-k segítségével történik.
  withCredentials: true,
});

myAxios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => {
    // Hiba esetén írjuk ki a hibát, vagy végezzünk hibakezelést
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);
*/

import axios from "axios";

// Létrehozzuk az Axios példányt
export const myAxios = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Interceptorok hozzáadása
myAxios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }

    // Cache tiltása
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    return config;
  },
  (error) => Promise.reject(error)
);

myAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response);
    }
    return Promise.reject(error);
  }
);
