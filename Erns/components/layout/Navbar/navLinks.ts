export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS_LEFT: NavLink[] = [
  { href: "/search?status=FOR_SALE", label: "Buy" },
  { href: "/search?status=FOR_RENT", label: "Rent" },
  { href: "/sell", label: "Sell" },
];

export const NAV_LINKS_RIGHT: NavLink[] = [
  { href: "/rentalmanager", label: "Manage rentals" },
  { href: "/gethelp", label: "Get help" },
];
