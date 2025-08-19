import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await api.post("/token/refresh");
        // const res = await axios.post(
        //   "http://localhost:5000/api/token/refresh",
        //   {},
        //   { withCredentials: true }
        // );

        sessionStorage.setItem("accessToken", res.data.accessToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch (e) {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
