import axios from "axios";

let cachedEpicToken: string | null = null;
let tokenExpiry: number | null = null;

const http = axios.create({
  baseURL: process.env.API_BASE_URL!,
  timeout: 5000,
});

const epic = axios.create({
  baseURL: process.env.EPIC_API_BASE_URL!,
  timeout: 5000,
});

const epicToken = axios.create({
  timeout: 5000,
});

const getAccessToken = async (): Promise<string | null> => {
  if (cachedEpicToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedEpicToken;
  }

  const clientId = process.env.EPIC_CLIENT_ID_PROD!;
  // const clientSecret = process.env.EPIC_CLIENT_SECRET!;
  const tokenUrl = process.env.EPIC_TOKEN_URL!;

  try {
    const response = await epicToken.post(
      tokenUrl,
      new URLSearchParams({
        client_id: clientId,
        // client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    cachedEpicToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    return cachedEpicToken;
  } catch (error: any) {
    console.error(
      "Failed to get Epic access token:",
      error.response?.data || error.message,
    );

    // Clear cached token on auth failure
    cachedEpicToken = null;
    tokenExpiry = null;

    throw new Error(
      `Epic authentication failed: ${error.response?.data?.error || error.message}`,
    );
  }
};

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data ?? err.message);
    return Promise.reject(err);
  },
);

epic.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

epic.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data ?? err.message);
    return Promise.reject(err);
  },
);

export { http, epic, getAccessToken };
