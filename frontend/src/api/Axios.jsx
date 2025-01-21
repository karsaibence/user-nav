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
    const user = localStorage.getItem("user");
    // Ha van bejelentkezett felhasználó, állítsuk be az Authorization tokent
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        config.headers["Authorization"] = `Bearer ${parsedUser.token}`;
      }
    }

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
