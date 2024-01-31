import * as React from "react";
import { Outlet, FileRoute } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingsModal";
import LayoutContainer from "../components/LayoutContainer";

export const Route = new FileRoute("/_layout").createRoute({
  component: LayoutComponent,
});

function LayoutComponent() {
  const [opened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);

  const toggleSettings = () => {
    if (opened) {
      closeSettings();
    } else {
      openSettings();
    }
  };

  return (
    <>
      <Sidebar settingsOpened={opened} toggleSettings={toggleSettings} />
      <LayoutContainer opacity={0.4}>
        <Outlet />
      </LayoutContainer>
      <SettingsModal opened={opened} closeSettings={closeSettings} />
    </>
  );
}
