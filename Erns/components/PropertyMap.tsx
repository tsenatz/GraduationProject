"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Property } from "@/app/generated/prisma";
import { RotateCcw, AlertCircle, Home } from "lucide-react";
import styles from "./PropertyMap.module.css";

export interface PropertyMapProps {
  properties: Property[];
  onBoundsChange: (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => void;
  hoveredPropertyId: string | null;
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: Property | null) => void;
  onPolygonChange?: (polygon: { lat: number; lng: number }[] | null) => void;
}

// OpenMapTiles-compatible tile styles (hosted on OpenFreeMap, zero API key required)
const MAP_STYLES = [
  { id: "liberty", label: "Street", url: "https://tiles.openfreemap.org/styles/liberty" },
  { id: "bright", label: "Bright", url: "https://tiles.openfreemap.org/styles/bright" },
  { id: "positron", label: "Light", url: "https://tiles.openfreemap.org/styles/positron" },
  { id: "satellite", label: "Satellite", url: "satellite-style" },
];

// Fallback Addis Ababa coordinates
const DEFAULT_CENTER: [number, number] = [38.761, 9.010];
const DEFAULT_ZOOM = 12;

function formatBadgePrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = (price / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `ETB ${millions}M`;
  }
  if (price >= 1_000) {
    return `ETB ${(price / 1_000).toFixed(0)}K`;
  }
  return `ETB ${price.toLocaleString()}`;
}

function formatFullPrice(price: number): string {
  return `ETB ${price.toLocaleString()}`;
}

export default function PropertyMap({
  properties,
  onBoundsChange,
  hoveredPropertyId,
  selectedPropertyId,
  onSelectProperty,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLDivElement }>>(new Map());
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const boundsDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticMove = useRef<boolean>(false);

  const [currentStyle, setCurrentStyle] = useState<string>("liberty");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  // Determine initial style URL (supports custom ENV if set, otherwise OpenFreeMap)
  const getStyleUrl = (styleId: string): string | maplibregl.StyleSpecification => {
    if (styleId === 'satellite') {
      return {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
          },
          'esri-transportation': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          },
          'esri-labels': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22
          },
          {
            id: 'transportation-layer',
            type: 'raster',
            source: 'esri-transportation',
            minzoom: 0,
            maxzoom: 22
          },
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'esri-labels',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    }
    if (process.env.NEXT_PUBLIC_MAP_STYLE_URL) {
      return process.env.NEXT_PUBLIC_MAP_STYLE_URL;
    }
    if (process.env.NEXT_PUBLIC_MAPTILER_KEY) {
      return `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
    }
    const found = MAP_STYLES.find((s) => s.id === styleId);
    return found ? found.url : MAP_STYLES[0].url;
  };

  // Create popup HTML content for a property
  const createPopupContent = useCallback((property: Property): HTMLDivElement => {
    const card = document.createElement("div");
    card.className = styles.popupCard;

    const imgWrapper = document.createElement("div");
    imgWrapper.className = styles.popupImageWrapper;

    const img = document.createElement("img");
    img.className = styles.popupImage;
    img.src = property.images && property.images.length > 0 ? property.images[0] : "";
    img.alt = property.title;
    img.loading = "lazy";
    img.onerror = () => {
      img.style.display = "none";
    };
    imgWrapper.appendChild(img);

    const badge = document.createElement("div");
    badge.className = styles.popupBadge;
    badge.textContent = property.status === "FOR_RENT" ? "For Rent" : "For Sale";
    imgWrapper.appendChild(badge);

    card.appendChild(imgWrapper);

    const body = document.createElement("div");
    body.className = styles.popupBody;

    const price = document.createElement("div");
    price.className = styles.popupPrice;
    price.textContent = formatFullPrice(property.price);
    body.appendChild(price);

    const specs = document.createElement("div");
    specs.className = styles.popupSpecs;
    specs.textContent = `${property.beds} bds • ${property.baths} ba • ${property.sqft.toLocaleString()} sqft`;
    body.appendChild(specs);

    const title = document.createElement("div");
    title.className = styles.popupTitle;
    title.textContent = property.title;
    body.appendChild(title);

    const address = document.createElement("div");
    address.className = styles.popupAddress;
    address.textContent = `${property.address}, ${property.city}`;
    body.appendChild(address);

    const actionBtn = document.createElement("button");
    actionBtn.className = styles.popupActionBtn;
    actionBtn.textContent = "View Listing";
    actionBtn.onclick = (e) => {
      e.stopPropagation();
      const cardEl = document.getElementById(`property-${property.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        cardEl.classList.add("ring-2");
      }
    };
    body.appendChild(actionBtn);

    card.appendChild(body);
    return card;
  }, []);

  // Open property popup on map
  const openPropertyPopup = useCallback(
    (property: Property) => {
      if (!mapRef.current) return;

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      const popupNode = createPopupContent(property);

      const popup = new maplibregl.Popup({
        offset: [0, -18],
        closeButton: true,
        closeOnClick: false,
        maxWidth: "320px",
      })
        .setLngLat([property.longitude, property.latitude])
        .setDOMContent(popupNode)
        .addTo(mapRef.current);

      popup.on("close", () => {
        popupRef.current = null;
        setActiveProperty(null);
        if (onSelectProperty) onSelectProperty(null);
      });

      popupRef.current = popup;
      setActiveProperty(property);
    },
    [createPopupContent, onSelectProperty]
  );

  const onBoundsChangeRef = useRef(onBoundsChange);
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  const handleStyleChange = (newStyle: string) => {
    setIsLoading(true);
    setLoadError(null);
    setCurrentStyle(newStyle);
  };

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial center detection: if properties are present, center around first or average
    let initialLng = DEFAULT_CENTER[0];
    let initialLat = DEFAULT_CENTER[1];

    if (properties.length > 0) {
      initialLng = properties[0].longitude;
      initialLat = properties[0].latitude;
    }

    let mapInstance: maplibregl.Map | null = null;
    const currentMarkers = markersRef.current;

    try {
      if (typeof window !== "undefined") {
        const workerUrl =
          process.env.NEXT_PUBLIC_MAPLIBRE_WORKER_URL ||
          `${window.location.origin}/maplibre-gl-worker.mjs`;
        maplibregl.setWorkerUrl(workerUrl);
      }

      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: getStyleUrl(currentStyle),
        center: [initialLng, initialLat],
        zoom: DEFAULT_ZOOM,
        attributionControl: { compact: false },
      });

      // Navigation control (zoom in/out, pitch, compass)
      mapInstance.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showCompass: true,
          showZoom: true,
        }),
        "top-right"
      );

      // Map loaded successfully
      mapInstance.on("load", () => {
        setIsLoading(false);

        // Fit to properties bounds if multiple exist
        if (properties.length > 1) {
          isProgrammaticMove.current = true;
          const bounds = new maplibregl.LngLatBounds();
          properties.forEach((p) => bounds.extend([p.longitude, p.latitude]));
          mapInstance?.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 800 });
        }
      });

      // Handle user-initiated map pan/zoom to report bounds to parent search
      mapInstance.on("moveend", (e) => {
        if (!mapInstance) return;

        // Ignore programmatic flyTo / fitBounds
        if (isProgrammaticMove.current) {
          isProgrammaticMove.current = false;
          return;
        }

        if (e.originalEvent) {
          if (boundsDebounceTimer.current) {
            clearTimeout(boundsDebounceTimer.current);
          }
          boundsDebounceTimer.current = setTimeout(() => {
            if (!mapInstance) return;
            const b = mapInstance.getBounds();
            if (b) {
              onBoundsChangeRef.current({
                neLat: b.getNorth(),
                neLng: b.getEast(),
                swLat: b.getSouth(),
                swLng: b.getWest(),
              });
            }
          }, 350);
        }
      });

      mapInstance.on("error", (e) => {
        // Tile or WebGL errors
        if (e.error && e.error.message && !e.error.message.includes("canceled")) {
          console.warn("MapLibre tile event warning:", e.error.message);
        }
      });

      mapRef.current = mapInstance;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initialize MapLibre GL map";
      queueMicrotask(() => {
        setLoadError(msg);
        setIsLoading(false);
      });
    }

    // Window resize observer
    const handleResize = () => {
      mapInstance?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (boundsDebounceTimer.current) {
        clearTimeout(boundsDebounceTimer.current);
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
      currentMarkers.forEach(({ marker }) => marker.remove());
      currentMarkers.clear();
      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, [currentStyle, properties]);

  // Synchronize Markers with current properties
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentMarkers = markersRef.current;
    const nextPropIds = new Set(properties.map((p) => p.id));

    // Remove markers that are no longer in properties list
    currentMarkers.forEach((value, id) => {
      if (!nextPropIds.has(id)) {
        value.marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers for properties
    properties.forEach((property) => {
      if (currentMarkers.has(property.id)) {
        // Marker exists: update classes if needed
        const item = currentMarkers.get(property.id)!;
        const isHovered = hoveredPropertyId === property.id;
        const isSelected = selectedPropertyId === property.id || activeProperty?.id === property.id;

        item.el.className = `${styles.marker} ${
          isSelected ? styles.markerSelected : isHovered ? styles.markerHovered : styles.markerNormal
        }`;
        return;
      }

      // Create new marker DOM element
      const wrapper = document.createElement("div");
      wrapper.className = styles.markerWrapper;

      const badge = document.createElement("div");
      const isHovered = hoveredPropertyId === property.id;
      const isSelected = selectedPropertyId === property.id || activeProperty?.id === property.id;

      badge.className = `${styles.marker} ${
        isSelected ? styles.markerSelected : isHovered ? styles.markerHovered : styles.markerNormal
      }`;

      // Status dot
      const dot = document.createElement("span");
      dot.className = `${styles.markerDot} ${property.status === "FOR_RENT" ? styles.markerDotRent : ""}`;
      badge.appendChild(dot);

      // Price text
      const text = document.createElement("span");
      text.textContent = formatBadgePrice(property.price);
      badge.appendChild(text);

      wrapper.appendChild(badge);

      // Marker click: fly to location, select property and open popup
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mapRef.current) {
          isProgrammaticMove.current = true;
          mapRef.current.flyTo({
            center: [property.longitude, property.latitude],
            zoom: Math.max(mapRef.current.getZoom(), 14),
            duration: 600,
          });
        }
        if (onSelectProperty) {
          onSelectProperty(property);
        }
        openPropertyPopup(property);
      });

      const marker = new maplibregl.Marker({
        element: wrapper,
        anchor: "bottom",
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map);

      currentMarkers.set(property.id, { marker, el: badge });
    });
  }, [properties, hoveredPropertyId, selectedPropertyId, activeProperty, openPropertyPopup, onSelectProperty]);

  // Synchronize external selection (e.g. from parent list click)
  useEffect(() => {
    if (!selectedPropertyId) {
      if (activeProperty && popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
        setActiveProperty(null);
      }
      return;
    }

    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop) {
      if (activeProperty?.id !== prop.id) {
        openPropertyPopup(prop);
        if (mapRef.current) {
          isProgrammaticMove.current = true;
          mapRef.current.flyTo({
            center: [prop.longitude, prop.latitude],
            zoom: Math.max(mapRef.current.getZoom(), 14),
            duration: 600,
          });
        }
      }
    }
  }, [selectedPropertyId, properties, activeProperty, openPropertyPopup]);

  // Reset view to fit all markers
  const handleResetBounds = () => {
    if (!mapRef.current) return;
    if (properties.length === 0) {
      isProgrammaticMove.current = true;
      mapRef.current.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 800,
      });
      return;
    }

    isProgrammaticMove.current = true;
    const bounds = new maplibregl.LngLatBounds();
    properties.forEach((p) => bounds.extend([p.longitude, p.latitude]));
    mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 800 });
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={containerRef} className={styles.mapCanvas} />

      {/* Top Floating Controls */}
      <div className={styles.topControls}>
        <button
          type="button"
          className={styles.controlPill}
          onClick={handleResetBounds}
          title="Fit all properties into view"
          aria-label="Reset map view"
        >
          <RotateCcw size={14} />
          <span>Fit View</span>
        </button>

        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <select
            className={styles.styleDropdown}
            value={currentStyle}
            onChange={(e) => handleStyleChange(e.target.value)}
            aria-label="Select map style"
          >
            {MAP_STYLES.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label} Map
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Count Chip */}
      <div className={styles.statusBadge}>
        <Home size={13} />
        <span>
          {properties.length} {properties.length === 1 ? "home" : "homes"} on map
        </span>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Loading interactive map...</span>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className={styles.errorOverlay}>
          <AlertCircle size={32} color="#b91c1c" />
          <div className={styles.errorTitle}>Map Failed to Load</div>
          <div className={styles.errorDesc}>{loadError}</div>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => handleStyleChange(currentStyle === "liberty" ? "bright" : "liberty")}
          >
            Retry Loading Map
          </button>
        </div>
      )}
    </div>
  );
}
