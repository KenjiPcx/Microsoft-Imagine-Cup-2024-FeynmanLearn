import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../components/layout/Sidebar";
import SettingsModal from "../components/layout/SettingsModal";
import LayoutContainer from "../components/LayoutContainer";
import { useAuth } from "../utils/auth";
import CreditsModal from "../components/layout/CreditsModal";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  const auth = useAuth();
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [creditsOpened, { open: openCredits, close: closeCredits }] =
    useDisclosure(false);

  const toggleSettings = () => {
    if (settingsOpened) {
      closeSettings();
    } else {
      openSettings();
    }
  };

  const toggleCredits = () => {
    if (creditsOpened) {
      closeCredits();
    } else {
      openCredits();
    }
  };

  return (
    <>
      {auth.isAuthenticated && (
        <Sidebar
          settingsOpened={settingsOpened}
          toggleSettings={toggleSettings}
          creditsOpened={creditsOpened}
          toggleCredits={toggleCredits}
        />
      )}

      <LayoutContainer opacity={0.4}>
        <Outlet />
      </LayoutContainer>
      <SettingsModal opened={settingsOpened} closeSettings={closeSettings} />
      <CreditsModal opened={creditsOpened} closeCredits={closeCredits} />
    </>
  );
}
