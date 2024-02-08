import { createFileRoute } from "@tanstack/react-router";
import { AuthData } from "../../utils/auth";

export const Route = createFileRoute("/_layout/")({
  beforeLoad: async ({ context }) => {
    console.log("Context", context);
    if (!context.auth.isAuthenticated) {
      const res = await fetch("/.auth/me");
      const payload = await res.json();
      const { clientPrincipal } = payload;
      if (clientPrincipal) {
        console.log("Client Principal", clientPrincipal);
        context.auth.setAuthData(clientPrincipal as AuthData);
      }
    }
  },
});
