"use client";

import {
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/16/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { getAuth, signOut } from "firebase/auth";

import {
  Avatar,
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  NavbarItem,
  SidebarItem,
} from "@/components/base";
import { LoginButton } from "@/components/features/auth";
import { app } from "@/firebase";
import { useCurrentUser } from "@/hooks";

import type { User } from "firebase/auth";

export function NavbarUserDropdown() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <UserDropdown as={NavbarItem} anchor="bottom end" user={user}>
      {user.email}
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
    <UserDropdown as={SidebarItem} anchor="top start" user={user}>
      <span className="flex min-w-0 items-center gap-3">
        <Avatar src={user.photoURL} className="size-10" square alt="" />
        <span className="min-w-0">
          <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
            {user.displayName}
          </span>
          <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
            {user.email}
          </span>
        </span>
      </span>
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
  user: User;
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
