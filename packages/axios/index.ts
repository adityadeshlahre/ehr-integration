import axios from "axios";
import { SignJWT, importPKCS8 } from "jose";

const generateBackendJWT = async (clientId: string): Promise<string> => {
  const privateKeyPem = process.env.EPIC_PRIVATE_KEY!;
  const tokenUrl = process.env.EPIC_TOKEN_URL!;

  if (!privateKeyPem) {
    throw new Error(
      "EPIC_PRIVATE_KEY environment variable is required for JWT authentication",
    );
  }

  const privateKey = await importPKCS8(privateKeyPem, "RS256");

  const jti = crypto.randomUUID();

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 300;

  const jwt = await new SignJWT({
    iss: clientId,
    sub: clientId,
    aud: tokenUrl,
    jti,
    exp,
    iat: now,
    nbf: now,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);

  return jwt;
};

let cachedEpicToken: string | null = null;
let tokenExpiry: number | null = null;

const http = axios.create({
  baseURL: process.env.API_BASE_URL!,
  // timeout: 5000,
});

const epic = axios.create({
  baseURL: process.env.EPIC_API_BASE_URL!,
  // timeout: 5000,
});

const epicToken = axios.create({
  timeout: 5000,
});

const getAccessToken = async (): Promise<string | null> => {
  if (cachedEpicToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedEpicToken;
  }

  // Use sandbox client ID for development/testing, production for live
  const isProduction = process.env.NODE_ENV === "production";
  const clientId = isProduction
    ? process.env.EPIC_CLIENT_ID_PROD!
    : process.env.EPIC_CLIENT_ID!;
  const clientSecret = process.env.EPIC_CLIENT_SECRET!;
  const tokenUrl = process.env.EPIC_TOKEN_URL!;
  const useJWT = process.env.EPIC_USE_JWT === "true";

  try {
    let requestData: URLSearchParams;

    if (useJWT) {
      // JWT Authentication (recommended for backend services)
      const jwt = await generateBackendJWT(clientId);
      requestData = new URLSearchParams({
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: jwt,
      });
    } else {
      // Client Secret Authentication
      requestData = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      });
    }

    const response = await epicToken.post(tokenUrl, requestData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

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
