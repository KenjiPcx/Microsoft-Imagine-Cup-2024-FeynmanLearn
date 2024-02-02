import { Outlet, FileRoute } from "@tanstack/react-router";
import LayoutContainer from "../components/LayoutContainer";

export const Route = new FileRoute("/_layout_no_sidebar").createRoute({
  component: LayoutNoSidebarComponent,
});

function LayoutNoSidebarComponent() {
  return (
    <LayoutContainer opacity={1}>
      <Outlet />
    </LayoutContainer>
  );
}
