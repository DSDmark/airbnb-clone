/*
 * Reference capture snippet — run by a person, in their own browser.
 *
 * The reference page sits behind Vercel BotID, which (deliberately) refuses
 * automated browsers, and this project does not try to get around that.
 * Instead: open the reference normally, open DevTools → Console, paste this
 * whole file and press Enter. It walks the page's overlays the way a visitor
 * would and downloads `reference-content.json` with
 *   - visible text per view (page, photo tour, lightbox, dialogs),
 *   - every image URL in DOM order with its alt text and box,
 *   - photo-tour rooms with their photo URLs,
 *   - a measurement census (boxes, fonts, colours) of the page.
 * It records content and measurements only — no markup, class names or code.
 * Drop the file into reference/ and ask the agent to sync src/data/listing.ts.
 */
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = { title: document.title, url: location.href, capturedAt: new Date().toISOString(), views: {}, errors: [] };

  const images = (root) =>
    [...root.querySelectorAll("img")].map((img) => {
      const r = img.getBoundingClientRect();
      return { src: img.currentSrc || img.src, alt: img.alt, box: [r.x, r.y + scrollY, r.width, r.height].map(Math.round) };
    });
  const topDialog = () => [...document.querySelectorAll('[role="dialog"], [aria-modal="true"]')].pop();
  const button = (pattern) =>
    [...document.querySelectorAll('button, a, [role="button"]')].find((el) =>
      pattern.test((el.getAttribute("aria-label") || "") + " " + (el.textContent || "")),
    );
  const escape = async () => {
    document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await sleep(900);
  };
  const step = async (name, fn) => {
    try {
      await fn();
      console.log("✓", name);
    } catch (error) {
      out.errors.push(`${name}: ${error.message}`);
      console.warn("✗", name, error);
    }
  };

  // Scroll once so lazy sections render.
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
    scrollTo(0, y);
    await sleep(120);
  }
  scrollTo(0, 0);
  await sleep(500);

  await step("page", async () => {
    const main = document.querySelector("main") || document.body;
    out.views.page = { text: main.innerText, images: images(main) };
  });

  await step("census", async () => {
    const rows = [];
    for (const el of (document.querySelector("main") || document.body).querySelectorAll("*")) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
      if (!own) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      rows.push({ text: own.slice(0, 60), box: [r.x, r.y + scrollY, r.width, r.height].map(Math.round), font: `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`, color: cs.color });
    }
    out.views.census = rows;
  });

  await step("photo tour", async () => {
    button(/show all photos/i).click();
    await sleep(2000);
    const dialog = topDialog();
    // Photos below the fold mount lazily: scroll the tour through first.
    const scroller = [...dialog.querySelectorAll("*")].find((el) => el.scrollHeight > el.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(el).overflowY));
    if (scroller) {
      for (let y = 0; y < scroller.scrollHeight; y += 500) {
        scroller.scrollTop = y;
        await sleep(200);
      }
      scroller.scrollTop = 0;
      await sleep(400);
    }
    const headings = [...dialog.querySelectorAll("h2, h3")];
    // A room's container is the widest ancestor holding its photos but no other room heading.
    const roomOf = (heading) => {
      let node = heading;
      let best = heading.parentElement;
      while (node.parentElement && node.parentElement !== dialog) {
        node = node.parentElement;
        const others = headings.filter((h) => h !== heading && node.contains(h));
        if (others.length) break;
        if (node.querySelector("img")) best = node;
      }
      return best;
    };
    const rooms = headings.map((heading) => {
      const section = roomOf(heading);
      return { title: heading.textContent.trim(), text: section.innerText, images: images(section).map((i) => i.src) };
    });
    out.views.photoTour = { text: dialog.innerText, rooms, images: images(dialog) };
  });

  await step("lightbox", async () => {
    const dialog = topDialog();
    const photo = [...dialog.querySelectorAll("button, [role=button]")].find((b) => b.querySelector("img") && b.getBoundingClientRect().width > 300);
    photo.click();
    await sleep(1500);
    const viewer = topDialog();
    out.views.lightbox = { text: viewer.innerText, images: images(viewer) };
    await escape();
    await escape();
  });

  for (const [name, pattern] of [
    ["description", /show more about this place|^\s*show more\s*$/i],
    ["amenities", /show all \d+ amenities/i],
    ["reviews", /show all \d+ reviews/i],
  ]) {
    await step(name, async () => {
      button(pattern).click();
      await sleep(1800);
      const dialog = topDialog();
      out.views[name] = { text: dialog.innerText, images: images(dialog) };
      await escape();
    });
  }

  const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "reference-content.json" });
  link.click();
  console.log("Saved reference-content.json", out.errors.length ? out.errors : "(no errors)");
})();
