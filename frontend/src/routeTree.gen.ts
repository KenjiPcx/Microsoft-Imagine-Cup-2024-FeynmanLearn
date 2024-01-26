import { Route as rootRoute } from "./routes/__root";
import { Route as SessionsRoute } from "./routes/sessions";
// import { Route as LayoutRoute } from "./routes/_layout";
import { Route as IndexRoute } from "./routes/index";
import { Route as Sessions_SessionIdRoute } from "./routes/sessions.$sessionId";
import { Route as Sessions_NewSessionRoute } from "./routes/sessions.new";
import { Route as Session_PostSessionRoute } from "./routes/sessions.analysis.$sessionId";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      parentRoute: typeof rootRoute;
    };
    "/sessions": {
      parentRoute: typeof rootRoute;
    };
    "/sessions/": {
      parentRoute: typeof SessionsRoute;
    };
    "/sessions/run/$sessionId": {
      parentRoute: typeof SessionsRoute;
    };
    "/sessions/analysis/$sessionId/": {
      parentRoute: typeof SessionsRoute;
    };
    "/sessions/new": {
      parentRoute: typeof SessionsRoute;
    };
  }
}

Object.assign(IndexRoute.options, {
  path: "/",
  getParentRoute: () => rootRoute,
});

Object.assign(SessionsRoute.options, {
  path: "/sessions",
  getParentRoute: () => rootRoute,
});

Object.assign(Sessions_SessionIdRoute.options, {
  path: "/sessions/run/$sessionId",
  getParentRoute: () => rootRoute,
});

Object.assign(Sessions_NewSessionRoute.options, {
  path: "/sessions/new",
  getParentRoute: () => rootRoute,
});

Object.assign(Session_PostSessionRoute.options, {
  path: "/sessions/analysis/$sessionId",
  getParentRoute: () => rootRoute,
});

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SessionsRoute,
  Sessions_SessionIdRoute,
  Sessions_NewSessionRoute,
  Session_PostSessionRoute,
]);
