"use client";

export const SIDEBAR_EXPANDED_STORAGE_KEY = "sidebar:expanded";
export const SIDEBAR_EXPANDED_EVENT = "sidebar:expanded-change";

type SidebarExpandedChangeDetail = {
  expanded: boolean;
};

export function readSidebarExpanded(fallback: boolean) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const saved = window.localStorage.getItem(SIDEBAR_EXPANDED_STORAGE_KEY);
  if (saved === null) {
    return fallback;
  }

  return saved === "1";
}

export function writeSidebarExpanded(expanded: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SIDEBAR_EXPANDED_STORAGE_KEY,
    expanded ? "1" : "0",
  );
  window.dispatchEvent(
    new CustomEvent<SidebarExpandedChangeDetail>(SIDEBAR_EXPANDED_EVENT, {
      detail: { expanded },
    }),
  );
}

export function subscribeToSidebarExpandedChange(
  onChange: (expanded: boolean) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (event: Event) => {
    const sidebarEvent = event as CustomEvent<SidebarExpandedChangeDetail>;
    onChange(sidebarEvent.detail.expanded);
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key !== SIDEBAR_EXPANDED_STORAGE_KEY || event.newValue === null) {
      return;
    }

    onChange(event.newValue === "1");
  };

  window.addEventListener(SIDEBAR_EXPANDED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(SIDEBAR_EXPANDED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
