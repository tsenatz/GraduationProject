export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS_LEFT: NavLink[] = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/agents", label: "Find an agent" },
];

export const NAV_LINKS_RIGHT: NavLink[] = [
  { href: "/rentalmanager", label: "Manage rentals" },
  { href: "/gethelp", label: "Get help" },
];
