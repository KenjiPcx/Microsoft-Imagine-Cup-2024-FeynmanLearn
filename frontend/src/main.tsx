import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
import { RouterProvider, Router, ErrorComponent } from "@tanstack/react-router";
import { auth } from "./utils/auth";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/Spinner";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";

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
  // This stuff is just to tweak our sandbox setup in real-time
  // const [loaderDelay, setLoaderDelay] = useSessionStorage("loaderDelay", 500);
  // const [pendingMs, setPendingMs] = useSessionStorage("pendingMs", 1000);
  // const [pendingMinMs, setPendingMinMs] = useSessionStorage(
  //   "pendingMinMs",
  //   500
  // );

  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      // defaultPendingMs={pendingMs}
      // defaultPendingMinMs={pendingMinMs}
      context={{
        auth,
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
    <App />
  </MantineProvider>
);
