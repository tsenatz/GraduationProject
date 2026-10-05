export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS_LEFT: NavLink[] = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/mortgage", label: "Get a mortgage" },
  { href: "/agents", label: "Find an agent" },
];

export const NAV_LINKS_RIGHT: NavLink[] = [
  { href: "/manage-rentals", label: "Manage rentals" },
  { href: "/advertise", label: "Advertise" },
  { href: "/get-help", label: "Get help" },
];
