"use client";

import React from "react";
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
  /** Optional class override for the search icon / button */
  iconClassName?: string;
}

/**
 * A pill-shaped search input with a clickable magnifier submit button.
 * Used in the Hero section and any search-enabled surface.
 */
export function SearchBar({
  placeholder = "Enter an address",
  value = "",
  onChange,
  onSubmit,
  wrapperClassName = "",
  inputClassName = "",
  iconClassName = "",
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  const handleClickSubmit = () => {
    if (onSubmit) {
      onSubmit(value);
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
      <button
        type="button"
        onClick={handleClickSubmit}
        className={`${styles.searchBtn} ${iconClassName}`}
        aria-label="Submit search"
        title="Search"
      >
        <Search size={22} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
