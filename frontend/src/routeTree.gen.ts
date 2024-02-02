// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as LayoutnosidebarImport } from './routes/_layout_no_sidebar'
import { Route as LayoutImport } from './routes/_layout'
import { Route as AuthImport } from './routes/_auth'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutSessionsImport } from './routes/_layout/sessions'
import { Route as AuthProfileImport } from './routes/_auth.profile'
import { Route as LayoutSessionsNewImport } from './routes/_layout/sessions_.new'
import { Route as LayoutnosidebarSessionsRunSessionIdImport } from './routes/_layout_no_sidebar/sessions_.run.$sessionId'
import { Route as LayoutSessionsAnalysisSessionIdImport } from './routes/_layout/sessions_.analysis.$sessionId'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const LayoutnosidebarRoute = LayoutnosidebarImport.update({
  id: '/_layout_no_sidebar',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutSessionsRoute = LayoutSessionsImport.update({
  path: '/sessions',
  getParentRoute: () => LayoutRoute,
} as any)

const AuthProfileRoute = AuthProfileImport.update({
  path: '/profile',
  getParentRoute: () => AuthRoute,
} as any)

const LayoutSessionsNewRoute = LayoutSessionsNewImport.update({
  path: '/sessions/new',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutnosidebarSessionsRunSessionIdRoute =
  LayoutnosidebarSessionsRunSessionIdImport.update({
    path: '/sessions/run/$sessionId',
    getParentRoute: () => LayoutnosidebarRoute,
  } as any)

const LayoutSessionsAnalysisSessionIdRoute =
  LayoutSessionsAnalysisSessionIdImport.update({
    path: '/sessions/analysis/$sessionId',
    getParentRoute: () => LayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout_no_sidebar': {
      preLoaderRoute: typeof LayoutnosidebarImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/profile': {
      preLoaderRoute: typeof AuthProfileImport
      parentRoute: typeof AuthImport
    }
    '/_layout/sessions': {
      preLoaderRoute: typeof LayoutSessionsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/sessions/new': {
      preLoaderRoute: typeof LayoutSessionsNewImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/sessions/analysis/$sessionId': {
      preLoaderRoute: typeof LayoutSessionsAnalysisSessionIdImport
      parentRoute: typeof LayoutImport
    }
    '/_layout_no_sidebar/sessions/run/$sessionId': {
      preLoaderRoute: typeof LayoutnosidebarSessionsRunSessionIdImport
      parentRoute: typeof LayoutnosidebarImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  AuthRoute.addChildren([AuthProfileRoute]),
  LayoutRoute.addChildren([
    LayoutSessionsRoute,
    LayoutIndexRoute,
    LayoutSessionsNewRoute,
    LayoutSessionsAnalysisSessionIdRoute,
  ]),
  LayoutnosidebarRoute.addChildren([LayoutnosidebarSessionsRunSessionIdRoute]),
  LoginRoute,
])
