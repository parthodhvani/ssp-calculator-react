import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
export const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    // Avoid double WP fetches from hover-preloading sidebar routes
    defaultPreload: false,
    defaultPreloadStaleTime: 0,
  });
  return router;
};
