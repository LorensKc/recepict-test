"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <QueryClientProvider client={queryClient}>
          <main>
            <nav>
              <Link href="/">Головна</Link> |{" "}
              <Link href="/selected">Вибрані рецепти</Link>
            </nav>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
