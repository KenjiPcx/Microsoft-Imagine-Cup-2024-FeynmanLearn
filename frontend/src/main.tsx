import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, Router, ErrorComponent } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./utils/auth";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/Spinner";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import { RecoilRoot } from "recoil";

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!, // We'll inject this when we render
  },
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useAuth();

  return (
    <RecoilRoot>
      <RouterProvider router={router} context={{ auth }} />
    </RecoilRoot>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
    <Notifications />
    <App />
  </MantineProvider>
);
