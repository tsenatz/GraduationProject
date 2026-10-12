"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ExternalLink,
  MessageSquare,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  EyeOff,
} from "lucide-react";
import { RentalPropertyRecord } from "@/lib/actions/rentals";
import styles from "./RentalPropertyCard.module.css";

interface RentalPropertyCardProps {
  property: RentalPropertyRecord;
  onStatusChange: (
    propertyId: string,
    newStatus: "FOR_RENT" | "RENTED" | "OFF_MARKET"
  ) => void;
  onDelete: (propertyId: string) => void;
}

export const RentalPropertyCard: React.FC<RentalPropertyCardProps> = ({
  property,
  onStatusChange,
  onDelete,
}) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case "FOR_RENT":
        return (
          <span className={`${styles.statusBadge} ${styles.statusListed}`}>
            <CheckCircle2 size={12} />
            <span>Listed for Rent</span>
          </span>
        );
      case "RENTED":
        return (
          <span className={`${styles.statusBadge} ${styles.statusRented}`}>
            <Users size={12} />
            <span>Occupied / Leased</span>
          </span>
        );
      case "OFF_MARKET":
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.statusOffMarket}`}>
            <EyeOff size={12} />
            <span>Off-Market / Draft</span>
          </span>
        );
    }
  };

  const coverPhoto =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80";

  return (
    <div className={styles.propertyCard}>
      {/* Cover Image & Badges */}
      <div className={styles.imageWrapper}>
        <Image
          src={coverPhoto}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className={styles.propertyImg}
        />
        {getStatusBadge()}
        <span className={styles.referenceBadge}>{property.referenceNo}</span>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        {/* Price Row */}
        <div className={styles.priceRow}>
          <div>
            <span className={styles.priceText}>
              ETB {formatPrice(property.priceETB)}
            </span>
            <span className={styles.pricePeriod}>/ mo</span>
          </div>
          <span className={styles.depositText}>
            Deposit: ETB {formatPrice(property.depositETB)}
          </span>
        </div>

        {/* Title & Location */}
        <h4 className={styles.title} title={property.title}>
          {property.title}
        </h4>
        <div className={styles.location}>
          <MapPin size={13} />
          <span>
            {property.specificArea || property.subCity}, Addis Ababa
          </span>
        </div>

        {/* Specs */}
        <div className={styles.specsRow}>
          <div className={styles.specItem}>
            <Bed size={14} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className={styles.specItem}>
            <Bath size={14} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className={styles.specItem}>
            <Maximize2 size={14} />
            <span>{property.areaSqM} m²</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={styles.metricsRow}>
          <span className={styles.metricBadge}>
            <MessageSquare size={12} />
            <span>{property.inquiriesCount} Inquiries</span>
          </span>
          <span className={styles.metricBadge}>
            <Users size={12} />
            <span>{property.applicationsCount} Applications</span>
          </span>
        </div>

        {/* Footer Actions */}
        <div className={styles.cardFooter}>
          <select
            className={styles.statusSelect}
            value={property.status}
            onChange={(e) =>
              onStatusChange(property.id, e.target.value as any)
            }
          >
            <option value="FOR_RENT">Listed for Rent</option>
            <option value="RENTED">Occupied / Leased</option>
            <option value="OFF_MARKET">Off-Market / Pause</option>
          </select>

          <div className={styles.actionsRight}>
            <Link
              href={`/property/${property.id}`}
              className={styles.iconBtn}
              title="View Public Listing"
              target="_blank"
            >
              <ExternalLink size={15} />
            </Link>

            <Link
              href="/inbox"
              className={styles.iconBtn}
              title="View Inquiries & Messages"
            >
              <MessageSquare size={15} />
            </Link>

            <button
              type="button"
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(property.id)}
              title="Delete Property"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
