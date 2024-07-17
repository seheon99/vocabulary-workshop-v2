import {
  ArrowRightStartOnRectangleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/16/solid";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

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

export function NavbarUserDropdown() {
  return (
    <UserDropdown as={NavbarItem} anchor="bottom end">
      Account
      <ChevronDownIcon />
    </UserDropdown>
  );
}

export function SidebarUserDropdown() {
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
        <DropdownItem href="/logout">
          <ArrowRightStartOnRectangleIcon />
          <DropdownLabel>Logout</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
