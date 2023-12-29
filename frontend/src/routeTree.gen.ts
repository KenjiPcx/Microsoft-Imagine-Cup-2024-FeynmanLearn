import { Route as rootRoute } from "./routes/__root";
import { Route as SessionsRoute } from "./routes/sessions";
// import { Route as LayoutRoute } from "./routes/_layout";
import { Route as IndexRoute } from "./routes/index";
import { Route as SessionsSessionIdRoute } from "./routes/sessions.$sessionId";
// import { Route as LayoutLayoutBRoute } from "./routes/_layout/layout-b";
// import { Route as LayoutLayoutARoute } from "./routes/_layout/layout-a";
// import { Route as PostsIndexRoute } from "./routes/posts.index";
// import { Route as PostsPostIdDeepRoute } from "./routes/posts_.$postId.deep";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      parentRoute: typeof rootRoute;
    };
    "/_layout": {
      parentRoute: typeof rootRoute;
    };
    "/sessions": {
      parentRoute: typeof rootRoute;
    };
    "/sessions/": {
      parentRoute: typeof SessionsRoute;
    };
    "/sessions/$sessionId": {
      parentRoute: typeof SessionsRoute;
    };
  }
}

Object.assign(IndexRoute.options, {
  path: "/",
  getParentRoute: () => rootRoute,
});

// Object.assign(LayoutRoute.options, {
//   id: "/_layout",
//   getParentRoute: () => rootRoute,
// });

Object.assign(SessionsRoute.options, {
  path: "/sessions",
  getParentRoute: () => rootRoute,
});

// Object.assign(PostsIndexRoute.options, {
//   path: "/",
//   getParentRoute: () => PostsRoute,
// });

Object.assign(SessionsSessionIdRoute.options, {
  path: "/$sessionId",
  getParentRoute: () => SessionsRoute,
});

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SessionsRoute,
  SessionsSessionIdRoute,
]);
