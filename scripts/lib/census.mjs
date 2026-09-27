// Browser-side "style census": for every visible element under `root`, record
// its box and the computed styles that matter for visual parity. It records
// measurements only — never markup, class names or source — so the clone is
// written from numbers, not copied.
//
// Injected with page.evaluate(`(${census.toString()})(selector)`).

export function census(rootSelector = "body") {
  const root = document.querySelector(rootSelector) ?? document.body;
  const sx = window.scrollX;
  const sy = window.scrollY;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return [r.x + sx, r.y + sy, r.width, r.height].map((v) => Math.round(v * 10) / 10);
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.opacity !== "0";
  };

  const text = [];
  const controls = [];
  const images = [];
  const surfaces = [];

  for (const el of root.querySelectorAll("*")) {
    if (!visible(el) || el.closest("svg")) continue;
    const cs = getComputedStyle(el);
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent.trim())
      .join(" ")
      .trim();

    if (own && !["SCRIPT", "STYLE"].includes(el.tagName)) {
      text.push({
        text: own.slice(0, 80),
        tag: el.tagName.toLowerCase(),
        box: box(el),
        font: `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        decoration: cs.textDecorationLine,
      });
    }

    if (el.matches("button, a, input, select, [role=button]")) {
      controls.push({
        label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 60),
        tag: el.tagName.toLowerCase(),
        box: box(el),
        padding: cs.padding,
        radius: cs.borderRadius,
        background: cs.backgroundColor,
        backgroundImage: cs.backgroundImage === "none" ? undefined : cs.backgroundImage.slice(0, 160),
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        shadow: cs.boxShadow,
        transition: cs.transition,
      });
    }

    if (el.tagName === "IMG") {
      images.push({ alt: el.alt.slice(0, 60), box: box(el), fit: cs.objectFit, src: el.currentSrc || el.src });
    }

    if (cs.boxShadow !== "none" || cs.borderTopStyle !== "none" || cs.borderBottomStyle !== "none") {
      surfaces.push({
        tag: el.tagName.toLowerCase(),
        box: box(el),
        shadow: cs.boxShadow,
        radius: cs.borderRadius,
        borderTop: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        borderBottom: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`,
      });
    }
  }

  return {
    url: location.href,
    viewport: [innerWidth, innerHeight],
    documentHeight: document.documentElement.scrollHeight,
    text,
    controls,
    images,
    surfaces,
  };
}

// Frame-by-frame recorder for overlay animations: samples opacity/transform of
// every dialog each animation frame and keeps only the frames that changed.
export function recordMotion(durationMs = 1200) {
  const frames = [];
  const t0 = performance.now();
  let previous = "";
  return new Promise((resolve) => {
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      const state = [...document.querySelectorAll('[role="dialog"], [aria-modal="true"]')].map((d) => {
        const cs = getComputedStyle(d);
        return `${d.getAttribute("aria-label") ?? ""} op=${cs.opacity} tf=${cs.transform} anim=${cs.animationName}/${cs.animationDuration}/${cs.animationTimingFunction}`;
      });
      const key = JSON.stringify(state);
      if (key !== previous) {
        frames.push({ t, state });
        previous = key;
      }
      if (t < durationMs) requestAnimationFrame(tick);
      else resolve(frames);
    };
    requestAnimationFrame(tick);
  });
}
