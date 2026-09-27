"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

/**
 * Photo tour / lightbox state lives in the URL, the same way Airbnb does it
 * (`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=<photoId>`), and React subscribes to
 * it. Each overlay pushes a history entry, so Back closes the top-most overlay
 * and a copied URL deep-links straight into it.
 */

const MODAL_PARAM = "modal";
const ITEM_PARAM = "modalItem";
const TOUR_MODAL = "PHOTO_TOUR_SCROLLABLE";
const URL_CHANGE = "gallery:urlchange";
/** Marks history entries this provider pushed, so closing can safely go Back. */
const PUSHED_FLAG = "__galleryPushed";

interface GalleryUrlState {
  tourOpen: boolean;
  photoId: string | null;
}

interface GalleryContextValue extends GalleryUrlState {
  /** Room the tour should scroll to once it opens (consumed by the tour). */
  pendingRoomId: string | null;
  openTour: (roomId?: string) => void;
  closeTour: () => void;
  openPhoto: (photoId: string) => void;
  /** Swap the photo shown in the lightbox without adding history entries. */
  showPhoto: (photoId: string) => void;
  closePhoto: () => void;
  consumePendingRoom: () => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE, onChange);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

function parse(search: string): GalleryUrlState {
  const params = new URLSearchParams(search);
  const tourOpen = params.get(MODAL_PARAM) === TOUR_MODAL;
  return { tourOpen, photoId: tourOpen ? params.get(ITEM_PARAM) : null };
}

function buildUrl(state: GalleryUrlState): string {
  const url = new URL(window.location.href);
  url.searchParams.delete(MODAL_PARAM);
  url.searchParams.delete(ITEM_PARAM);
  if (state.tourOpen) url.searchParams.set(MODAL_PARAM, TOUR_MODAL);
  if (state.tourOpen && state.photoId) url.searchParams.set(ITEM_PARAM, state.photoId);
  return `${url.pathname}${url.search}${url.hash}`;
}

function navigate(state: GalleryUrlState, mode: "push" | "replace") {
  const url = buildUrl(state);
  if (mode === "push") window.history.pushState({ ...window.history.state, [PUSHED_FLAG]: true }, "", url);
  else window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(URL_CHANGE));
}

/** Close an overlay: step Back over an entry we pushed, otherwise rewrite the URL
 *  in place (deep link) so the visitor is never sent off the site. */
function unwind(state: GalleryUrlState) {
  if (window.history.state?.[PUSHED_FLAG]) window.history.back();
  else navigate(state, "replace");
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const state = useMemo(() => parse(search), [search]);
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);

  const value = useMemo<GalleryContextValue>(
    () => ({
      ...state,
      pendingRoomId,
      openTour: (roomId) => {
        setPendingRoomId(roomId ?? null);
        if (!state.tourOpen) navigate({ tourOpen: true, photoId: null }, "push");
      },
      closeTour: () => unwind({ tourOpen: false, photoId: null }),
      openPhoto: (photoId) => navigate({ tourOpen: true, photoId }, "push"),
      showPhoto: (photoId) => navigate({ tourOpen: true, photoId }, "replace"),
      closePhoto: () => unwind({ tourOpen: true, photoId: null }),
      consumePendingRoom: () => setPendingRoomId(null),
    }),
    [state, pendingRoomId],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used inside <GalleryProvider>");
  return ctx;
}
