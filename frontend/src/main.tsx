import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import { RouterProvider, Router, ErrorComponent } from "@tanstack/react-router";
import { auth } from "./utils/auth";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/Spinner";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

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

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <App />
      </MantineProvider>
    </React.StrictMode>
  );
}
