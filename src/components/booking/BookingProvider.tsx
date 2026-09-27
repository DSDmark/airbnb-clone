"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { nightsBetween } from "@/lib/dates";

export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface BookingValue {
  checkIn: Date | null;
  checkOut: Date | null;
  nights: number;
  guests: Guests;
  maxGuests: number;
  nightlyRate: number;
  datePickerOpen: boolean;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setGuests: (guests: Guests) => void;
  openDatePicker: () => void;
  closeDatePicker: () => void;
}

const BookingContext = createContext<BookingValue | null>(null);

/**
 * Trip selection shared by the booking card, its popovers and the sticky
 * subnav CTA. Client-only: there is no booking backend in this clone.
 */
export function BookingProvider({
  maxGuests,
  nightlyRate,
  children,
}: {
  maxGuests: number;
  nightlyRate: number;
  children: ReactNode;
}) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<Guests>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const value = useMemo<BookingValue>(
    () => ({
      checkIn,
      checkOut,
      nights: checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0,
      guests,
      maxGuests,
      nightlyRate,
      datePickerOpen,
      setDates: (inDate, outDate) => {
        setCheckIn(inDate);
        setCheckOut(outDate);
      },
      setGuests,
      openDatePicker: () => setDatePickerOpen(true),
      closeDatePicker: () => setDatePickerOpen(false),
    }),
    [checkIn, checkOut, guests, maxGuests, nightlyRate, datePickerOpen],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function guestSummary({ adults, children, infants, pets }: Guests): string {
  const guests = adults + children;
  const parts = [`${guests} ${guests === 1 ? "guest" : "guests"}`];
  if (infants) parts.push(`${infants} ${infants === 1 ? "infant" : "infants"}`);
  if (pets) parts.push(`${pets} ${pets === 1 ? "pet" : "pets"}`);
  return parts.join(", ");
}
