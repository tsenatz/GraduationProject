"use client";

import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  /** Optional class override for the wrapper div */
  wrapperClassName?: string;
  /** Optional class override for the input element */
  inputClassName?: string;
  /** Optional class override for the search icon */
  iconClassName?: string;
}

/**
 * A pill-shaped search input with a magnifier icon.
 * Used in the Hero section and any future search-enabled surface.
 */
export function SearchBar({
  placeholder = "Enter an address",
  value,
  onChange,
  onSubmit,
  wrapperClassName = "",
  inputClassName = "",
  iconClassName = "",
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className={`${styles.searchWrapper} ${wrapperClassName}`}>
      <input
        type="text"
        className={`${styles.searchInput} ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label="Search properties"
      />
      <Search size={24} className={`${styles.searchIcon} ${iconClassName}`} strokeWidth={2.5} aria-hidden="true" />
    </div>
  );
}
