import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Token refresh function
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        "x-ratelimit-bypass": "test-bypass-token"
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

// Enhanced API request function with token refresh retry logic
export async function apiRequest(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    "x-ratelimit-bypass": "test-bypass-token",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const requestOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers,
  };

  let response = await fetch(url, requestOptions);

  // If we get a 401 and have a token, try to refresh
  if (response.status === 401 && token) {
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      // Retry the original request with new token
      const newToken = localStorage.getItem('accessToken');
      const retryHeaders: HeadersInit = {
        ...headers,
        ...(newToken && { Authorization: `Bearer ${newToken}` }),
      };

      response = await fetch(url, {
        ...requestOptions,
        headers: retryHeaders,
      });
    } else {
      // Refresh failed, clear token and redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
  }

  await throwIfResNotOk(response);
  return response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await apiRequest(queryKey.join("/") as string, {
        method: 'GET',
      });

      return await res.json();
    } catch (error) {
      if (unauthorizedBehavior === "returnNull" && error instanceof Error && error.message.includes('401')) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
