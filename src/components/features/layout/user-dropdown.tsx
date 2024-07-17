"use client";

import {
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/16/solid";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { getAuth, signOut } from "firebase/auth";

import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  NavbarItem,
  SidebarItem,
  SidebarLabel,
} from "@/components/base";
import { LoginButton } from "@/components/features/auth";
import { app } from "@/firebase";
import { useCurrentUser } from "@/hooks";

export function NavbarUserDropdown() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <UserDropdown as={NavbarItem} anchor="bottom end">
      Account
      <ChevronDownIcon />
    </UserDropdown>
  );
}

export function SidebarUserDropdown() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <UserDropdown as={SidebarItem} anchor="top start">
      <UserCircleIcon />
      <SidebarLabel>Account</SidebarLabel>
      <ChevronUpIcon />
    </UserDropdown>
  );
}

function UserDropdown({
  as,
  anchor,
  children,
}: {
  as: typeof NavbarItem | typeof SidebarItem;
  anchor: Parameters<typeof DropdownMenu>[0]["anchor"];
  children: React.ReactNode;
}) {
  return (
    <Dropdown>
      <DropdownButton as={as}>{children}</DropdownButton>
      <DropdownMenu className="min-w-64" anchor={anchor}>
        <DropdownItem href="/settings">
          <Cog8ToothIcon />
          <DropdownLabel>Settings</DropdownLabel>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          onClick={async () => {
            await signOut(getAuth(app));
          }}
        >
          <ArrowRightStartOnRectangleIcon />
          <DropdownLabel>Logout</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
