import type { CSSProperties } from "react";
import { icons, type IconDefinition, type IconName } from "./registry";

interface IconProps {
  name: IconName;
  /** Rendered width and height in px. */
  size?: number;
  /** Overrides the registry stroke width for outline glyphs (e.g. bolder chevrons). */
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/** Decorative glyph; pair it with visible text or an aria-label on the control. */
export function Icon({ name, size = 16, strokeWidth, className, style }: IconProps) {
  const def: IconDefinition = icons[name];
  const outline = def.strokeWidth !== undefined;

  return (
    <svg
      viewBox={def.viewBox}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{
        display: "block",
        flexShrink: 0,
        overflow: "visible",
        ...(outline
          ? { fill: "none", stroke: "currentColor", strokeWidth: strokeWidth ?? def.strokeWidth }
          : { fill: "currentColor" }),
        ...style,
      }}
    >
      {def.paths.map((path, i) => (
        <path key={i} d={path.d} fillRule={path.fillRule} />
      ))}
    </svg>
  );
}

export type { IconName };
