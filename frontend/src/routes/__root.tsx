import * as React from "react";
import {
  Link,
  Outlet,
  rootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Auth } from "../utils/auth";
import { Spinner } from "../components/Spinner";
import { Container } from "@mantine/core";

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return <Spinner show={isLoading} />;
}

export const Route = rootRouteWithContext<{
  auth: Auth;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Container>
      <div className={`min-h-screen flex flex-col`}>
        <div className={`flex items-center border-b gap-2`}>
          <h1 className={`text-3xl p-2`}>Learn with Feynman</h1>
          {/* Show a global spinner when the router is transitioning */}
          <div className={`text-3xl`}>
            <RouterSpinner />
          </div>
        </div>
        <div className={`flex-1 flex`}>
          <div className={`divide-y w-56`}>
            {(
              [
                ["/", "Home"],
                ["/sessions", "Sessions"],
                ["/sessions/new", "New Session"],
                // ["/dashboard", "Dashboard"],
                // ["/profile", "Profile"],
                // ["/login", "Login"],
              ] as const
            ).map(([to, label]) => {
              return (
                <div key={to}>
                  <Link
                    to={to}
                    activeOptions={
                      {
                        // If the route points to the root of it's parent,
                        // make sure it's only active if it's exact
                        // exact: to === '.',
                      }
                    }
                    preload="intent"
                    className={`block py-2 px-3 text-blue-700`}
                    // Make "active" links bold
                    activeProps={{ className: `font-bold` }}
                  >
                    {label}
                  </Link>
                </div>
              );
            })}
          </div>
          <hr />
          <div className={`flex-1 border-l border-gray-200`}>
            {/* Render our first route match */}
            <Outlet />
          </div>
          <hr />
        </div>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </Container>
  );
}
