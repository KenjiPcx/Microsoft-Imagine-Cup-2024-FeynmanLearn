import * as React from "react";
import { ErrorComponent, ErrorRouteProps } from "@tanstack/react-router";
import { SessionNotFoundError } from "../sessionsService";

export function SessionErrorComponent({ error }: ErrorRouteProps) {
  if (error instanceof SessionNotFoundError) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}
