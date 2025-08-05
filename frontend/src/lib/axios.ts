import axios from "axios";

const customRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// retrieve cookies from server components
customRequest.interceptors.request.use(
    async (config) => {
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("connect.sid");
        
        if (sessionCookie) {
          config.headers.Cookie = `${sessionCookie.name}=${sessionCookie.value}`;
        }
      }

      return config;
    },
    (error) => {
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  );

export default customRequest;
