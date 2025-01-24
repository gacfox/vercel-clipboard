"use client";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
