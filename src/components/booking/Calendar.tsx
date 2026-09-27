"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons/Icon";
import {
  addDays,
  addMonths,
  formatLongDate,
  formatMonth,
  isSameDay,
  monthGrid,
  startOfDay,
} from "@/lib/dates";
import { cx } from "@/lib/cx";
import styles from "./Calendar.module.css";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface CalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  /** Earliest selectable day (today). */
  minDate: Date;
  onSelect: (date: Date) => void;
}

/**
 * Two-month range calendar implementing the ARIA grid pattern: one tab stop,
 * arrows move by day/week, PageUp/PageDown by month, Home/End to week edges.
 */
export function Calendar({ checkIn, checkOut, minDate, onSelect }: CalendarProps) {
  const today = startOfDay(minDate);
  const [firstMonth, setFirstMonth] = useState(() => addMonths(checkIn ?? today, 0));
  const [focused, setFocused] = useState<Date>(checkIn ?? today);
  const [hovered, setHovered] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const keyboardMove = useRef(false);

  const months = [firstMonth, addMonths(firstMonth, 1)];
  const canGoBack = firstMonth > addMonths(today, 0);

  useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focused.getTime()}"]`)?.focus();
  }, [focused, firstMonth]);

  const moveFocus = (next: Date) => {
    const clamped = next < today ? today : next;
    keyboardMove.current = true;
    setFocused(clamped);
    const firstOfClamped = addMonths(clamped, 0);
    if (firstOfClamped < firstMonth) setFirstMonth(firstOfClamped);
    else if (firstOfClamped > months[1]) setFirstMonth(addMonths(clamped, -1));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => new Date(focused.getFullYear(), focused.getMonth() - 1, focused.getDate()),
      PageDown: () => new Date(focused.getFullYear(), focused.getMonth() + 1, focused.getDate()),
      Home: () => addDays(focused, -focused.getDay()),
      End: () => addDays(focused, 6 - focused.getDay()),
    };
    const next = map[event.key];
    if (!next) return;
    event.preventDefault();
    moveFocus(next());
  };

  const rangeEnd = checkOut ?? (checkIn && hovered && hovered > checkIn ? hovered : null);

  return (
    <div className={styles.calendar} ref={gridRef} onKeyDown={onKeyDown} onMouseLeave={() => setHovered(null)}>
      <button
        type="button"
        className={cx(styles.nav, styles.navPrev)}
        aria-label="Go back to switch to the previous month."
        disabled={!canGoBack}
        onClick={() => setFirstMonth(addMonths(firstMonth, -1))}
      >
        <Icon name="calendarPrev" size={12} />
      </button>
      <button
        type="button"
        className={cx(styles.nav, styles.navNext)}
        aria-label="Move forward to change to the next month."
        onClick={() => setFirstMonth(addMonths(firstMonth, 1))}
      >
        <Icon name="calendarNext" size={12} />
      </button>

      {months.map((month) => (
        <div key={month.getTime()} className={styles.month}>
          <h3 className={styles.monthTitle} id={`month-${month.getTime()}`}>
            {formatMonth(month)}
          </h3>
          <ul className={styles.weekdays} aria-hidden="true">
            {WEEKDAYS.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <table className={styles.grid} role="grid" aria-labelledby={`month-${month.getTime()}`}>
            <tbody>
              {monthGrid(month).map((week, w) => (
                <tr key={w}>
                  {week.map((day, d) => {
                    if (!day) return <td key={d} aria-hidden="true" />;
                    const past = day < today;
                    const start = isSameDay(day, checkIn);
                    const end = isSameDay(day, checkOut);
                    const inRange = !!checkIn && !!rangeEnd && day > checkIn && day < rangeEnd;
                    const label = `${day.getDate()}, ${WEEKDAY_NAMES[day.getDay()]}, ${formatLongDate(day)}. ${
                      past ? "Past dates can’t be selected." : start ? "Selected as check-in date." : end ? "Selected as checkout date." : "Available."
                    }`;
                    return (
                      <td
                        key={d}
                        role="gridcell"
                        aria-selected={start || end}
                        className={cx(inRange && styles.inRange, start && rangeEnd && styles.rangeStart, (end || isSameDay(day, rangeEnd)) && checkIn && styles.rangeEnd)}
                      >
                        <button
                          type="button"
                          data-day={day.getTime()}
                          tabIndex={isSameDay(day, focused) ? 0 : -1}
                          aria-label={label}
                          aria-disabled={past || undefined}
                          className={cx(styles.day, past && styles.past, (start || end) && styles.selected)}
                          onClick={() => !past && onSelect(day)}
                          onMouseEnter={() => !past && setHovered(day)}
                          onFocus={() => setFocused(day)}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
