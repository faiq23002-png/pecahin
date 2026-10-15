import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation, HashRouter } from "react-router-dom";

interface RouterContextType {
  route: string;
  navigate: (r: string) => void;
  goBack: (fallback?: string) => void;
}

const NavigationContext = createContext<RouterContextType | null>(null);

function NavigationManager({ children }: { children: React.ReactNode }) {
  const navigateReactRouter = useNavigate();
  const location = useLocation();
  const historyStack = useRef<string[]>([]);

  // Strip leading slash to match route names
  const route = location.pathname.substring(1) || "home";

  useEffect(() => {
    const stack = historyStack.current;
    if (stack.length === 0 || stack[stack.length - 1] !== route) {
      stack.push(route);
    }
  }, [route]);

  const navigate = (r: string) => {
    navigateReactRouter(`/${r}`);
    window.scrollTo(0, 0);
  };

  const goBack = (fallback: string = "home") => {
    const stack = historyStack.current;
    if (stack.length > 1) {
      stack.pop(); // remove current route
      navigateReactRouter(-1);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigateReactRouter(-1);
    } else {
      navigateReactRouter(`/${fallback}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <NavigationContext.Provider value={{ route, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useRouter(): RouterContextType {
  const ctx = useContext(NavigationContext);
  if (ctx) return ctx;

  const navigateReactRouter = useNavigate();
  const location = useLocation();
  const route = location.pathname.substring(1) || "home";

  return {
    route,
    navigate: (r) => {
      navigateReactRouter(`/${r}`);
      window.scrollTo(0, 0);
    },
    goBack: (fallback = "home") => {
      if (window.history.state && window.history.state.idx > 0) {
        navigateReactRouter(-1);
      } else {
        navigateReactRouter(`/${fallback}`);
      }
      window.scrollTo(0, 0);
    },
  };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  return (
    <HashRouter>
      <NavigationManager>{children}</NavigationManager>
    </HashRouter>
  );
}
