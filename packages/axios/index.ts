import axios from 'axios';

const getAccessToken = async (): Promise<string> => {
  const clientId = process.env.EPIC_CLIENT_ID!;
  const clientSecret = process.env.EPIC_CLIENT_SECRET!;
  const tokenUrl = process.env.EPIC_TOKEN_URL!;

  const response = await epic.post(tokenUrl, {})

  return response.data.access_token;
}

const http = axios.create({
  baseURL: process.env.API_BASE_URL!,
  timeout: 5000,
});

const epic = axios.create({
  baseURL: process.env.EPIC_API_BASE_URL!,
  timeout: 5000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);

epic.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});


epic.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);


export { http, epic, getAccessToken };
