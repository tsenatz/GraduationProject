"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./BedsBathsFilter.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BedsBathsFilterProps {
  initialBeds: string;
  initialBaths: string;
  initialExactMatch: boolean;
  onApply: (beds: string, baths: string, exactMatch: boolean) => void;
}

export default function BedsBathsFilter({
  initialBeds,
  initialBaths,
  initialExactMatch,
  onApply
}: BedsBathsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [beds, setBeds] = useState(initialBeds || "Any");
  const [baths, setBaths] = useState(initialBaths || "Any");
  const [exactMatch, setExactMatch] = useState(initialExactMatch);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onApply(beds, baths, exactMatch);
    setIsOpen(false);
  };

  const hasFilterActive = initialBeds !== "Any" || initialBaths !== "Any" || initialExactMatch;

  return (
    <div className={styles.filterContainer} ref={popoverRef}>
      <button 
        className={`${styles.triggerButton} ${(isOpen || hasFilterActive) ? styles.triggerActive : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Beds & baths</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.sectionHeader}>Number of Bedrooms</div>
          <div className={styles.sectionContent}>
            <div className={styles.label}>Bedrooms</div>
            <div className={styles.segmentControl}>
              {["Any", "1+", "2+", "3+", "4+", "5+"].map((val) => {
                 // For Zillow style, value "1" implies "1+" when not exact match, but let's just use raw values to render the button
                 const displayVal = val;
                 const dataVal = val.replace("+", "");
                 return (
                   <button 
                     key={val}
                     className={`${styles.segmentButton} ${beds === dataVal ? styles.segmentButtonActive : ""}`}
                     onClick={() => setBeds(dataVal)}
                   >
                     {displayVal}
                   </button>
                 );
              })}
            </div>
            
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={exactMatch} 
                onChange={(e) => setExactMatch(e.target.checked)}
                className={styles.checkboxInput}
              />
              Use exact match
            </label>
          </div>

          <div className={styles.sectionHeader}>Number of Bathrooms</div>
          <div className={styles.sectionContent}>
            <div className={styles.label}>Bathrooms</div>
            <div className={styles.segmentControl}>
              {["Any", "1+", "1.5+", "2+", "3+", "4+"].map((val) => {
                 const displayVal = val;
                 const dataVal = val.replace("+", "");
                 return (
                   <button 
                     key={val}
                     className={`${styles.segmentButton} ${baths === dataVal ? styles.segmentButtonActive : ""}`}
                     onClick={() => setBaths(dataVal)}
                   >
                     {displayVal}
                   </button>
                 );
              })}
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.applyButton} onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
