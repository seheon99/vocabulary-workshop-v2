import {
  BookOpenIcon,
  ChartBarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/20/solid";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLayout,
  SidebarSection,
} from "@/components/base";
import {
  NavbarUserDropdown,
  SidebarUserDropdown,
} from "@/components/features/layout";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocabulary Workshop",
  description: "The best way to memorize words effectively",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <body className={inter.className}>
        <SidebarLayout
          navbar={
            <Navbar>
              <NavbarSpacer />
              <NavbarSection>
                <NavbarItem href="/quiz">
                  <RocketLaunchIcon />
                </NavbarItem>
                <NavbarUserDropdown />
              </NavbarSection>
            </Navbar>
          }
          sidebar={
            <Sidebar>
              <SidebarHeader>
                <SidebarSection className="max-lg:hidden">
                  <SidebarItem href="/quiz">
                    <RocketLaunchIcon />
                    <SidebarLabel>Start a New Quiz</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarHeader>
              <SidebarBody>
                <SidebarSection>
                  <SidebarItem href="/vocabularies">
                    <BookOpenIcon />
                    <SidebarLabel>Vocabularies</SidebarLabel>
                  </SidebarItem>
                  <SidebarItem>
                    <ChartBarIcon href="/statistics" />
                    <SidebarLabel>Statistics</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              </SidebarBody>
              <SidebarFooter className="max-lg:hidden">
                <SidebarUserDropdown />
              </SidebarFooter>
            </Sidebar>
          }
        >
          {children}
        </SidebarLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
