import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { NextComponentType, NextPage, NextPageContext } from "next";
import AuthGuard from "../helpers/AuthGuard";
import { NotificationsProvider } from "@mantine/notifications";
import Header from "../components/Header";
import { Analytics } from '@vercel/analytics/react';

interface AppProps {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & {
    requireAuth: boolean;
  };
}

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */

          colorScheme: "dark",
          colors: {
            dark: [
              "#fff",
              "#A6A7AB",
              "#909296",
              "#5C5F66",
              "#373A40",
              "#2C2E33",
              "#25262B",
              "#1A1B1E",
              "#141517",
              "#101113",
            ],
          },
          fontFamily: "Manrope, sans-serif",
        }}
      >
        <NotificationsProvider>
          <SessionProvider session={session}>
            <Header />
            {Component.requireAuth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
      <Analytics />
    </>

  );
}

export default MyApp;
