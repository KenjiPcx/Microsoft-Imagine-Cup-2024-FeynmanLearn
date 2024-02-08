import { Outlet, createFileRoute } from "@tanstack/react-router";
import LayoutContainer from "../components/LayoutContainer";

export const Route = createFileRoute("/_layout_no_sidebar")({
  component: LayoutNoSidebarComponent,
});

function LayoutNoSidebarComponent() {
  return (
    <LayoutContainer opacity={1}>
      <Outlet />
    </LayoutContainer>
  );
}
