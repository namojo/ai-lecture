"use client";

import "./globals.css";
import { ThemeContext, useThemeProvider } from "@/hooks/useTheme";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeProvider = useThemeProvider();

  return (
    <html lang="ko" className={themeProvider.theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <head>
        <title>AI Lecture - 하네스 기반 AI 애플리케이션 개발 교육</title>
        <meta name="description" content="Claude Code와 Gemini CLI를 활용한 하네스 기반 AI 앱 개발 교육 플랫폼" />
      </head>
      <body>
        {themeProvider.mounted ? (
          <ThemeContext.Provider value={{ theme: themeProvider.theme, toggleTheme: themeProvider.toggleTheme }}>
            <AppShell>{children}</AppShell>
          </ThemeContext.Provider>
        ) : (
          <div style={{ visibility: "hidden" }}>
            <AppShell>{children}</AppShell>
          </div>
        )}
      </body>
    </html>
  );
}
