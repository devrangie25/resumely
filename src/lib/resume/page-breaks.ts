const PAGE_PAD_TOP = 40;
const PAGE_PAD_BOTTOM = 40;

function isModern(root: HTMLElement) {
  return root.dataset.resumeFamily === "modern";
}

function readSheetPadding(root: HTMLElement) {
  const style = getComputedStyle(root);
  return {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
  };
}

/** Page 1 uses sheet padding; continuation pages use the same inset (or PAGE_PAD_TOP when full bleed). */
function padTopForPage(page: number, root: HTMLElement) {
  const { top } = readSheetPadding(root);
  if (page === 0) return top;
  return top || PAGE_PAD_TOP;
}

function padBottomForPage(_page: number) {
  return PAGE_PAD_BOTTOM;
}

function scaleOf(root: HTMLElement) {
  const width = root.offsetWidth;
  if (!width) return 1;
  return root.getBoundingClientRect().width / width || 1;
}

function topWithin(node: HTMLElement, root: HTMLElement, scale: number) {
  return (node.getBoundingClientRect().top - root.getBoundingClientRect().top) / scale;
}

function heightOf(node: HTMLElement, scale: number) {
  return node.getBoundingClientRect().height / scale;
}

function isHeading(node: Element | null): node is HTMLElement {
  return node instanceof HTMLElement && /^H[1-3]$/.test(node.tagName);
}

function breakTarget(node: HTMLElement, root: HTMLElement) {
  let current = node;
  while (current.parentElement && current.parentElement !== root) {
    const parent = current.parentElement;
    if (parent.firstElementChild !== current) return node;
    const prev = parent.previousElementSibling;
    if (isHeading(prev)) return prev;
    current = parent;
  }
  return node;
}

function marginTopPx(value: string) {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clearBreaks(root: HTMLElement) {
  root.querySelectorAll("[data-page-spacer]").forEach((node) => node.remove());
  root.querySelectorAll<HTMLElement>("[data-break-margin]").forEach((node) => {
    node.style.marginTop = node.dataset.breakMargin ?? "";
    delete node.dataset.breakMargin;
    delete node.dataset.breakPush;
  });
  root.querySelectorAll<HTMLElement>("[data-page-paint]").forEach((node) => {
    node.style.backgroundColor = node.dataset.pagePaintColor ?? "";
    node.style.backgroundImage = node.dataset.pagePaintImage ?? "";
    node.style.backgroundRepeat = "";
    node.style.backgroundSize = "";
    node.style.backgroundPosition = "";
    delete node.dataset.pagePaint;
    delete node.dataset.pagePaintColor;
    delete node.dataset.pagePaintImage;
  });
  root.style.minHeight = "";
  root.querySelectorAll<HTMLElement>("article").forEach((article) => {
    article.style.minHeight = "";
    article.style.height = "";
    article.style.gridTemplateRows = "";
    article
      .querySelectorAll<HTMLElement>(":scope > aside, aside[data-resume-sidebar-full]")
      .forEach((aside) => {
        aside.style.alignSelf = "";
        aside.style.height = "";
      });
  });
}

function pushDown(target: HTMLElement, gap: number) {
  if (!target.dataset.breakMargin) {
    target.dataset.breakMargin = target.style.marginTop;
  }
  const pushed = parseFloat(target.dataset.breakPush ?? "0") + gap;
  target.dataset.breakPush = String(pushed);
  const basePx = marginTopPx(target.dataset.breakMargin ?? "");
  target.style.marginTop = `${basePx + pushed}px`;
}

function pullUp(target: HTMLElement, amount: number) {
  if (amount <= 0) return;
  if (!target.dataset.breakMargin) {
    target.dataset.breakMargin = target.style.marginTop;
  }
  const pushed = Math.max(0, parseFloat(target.dataset.breakPush ?? "0") - amount);
  target.dataset.breakPush = String(pushed);
  const basePx = marginTopPx(target.dataset.breakMargin ?? "");
  target.style.marginTop = pushed > 0 ? `${basePx + pushed}px` : target.dataset.breakMargin;
}

/** Remove extra top whitespace when a page starts below the continuation inset. */
function trimContinuationTopSpacing(
  root: HTMLElement,
  pageHeight: number,
  pages: number,
) {
  if (pages <= 1) return;
  const scale = scaleOf(root);
  const leaves = [...root.querySelectorAll<HTMLElement>("[data-resume-block]")].filter(
    (node) => !node.querySelector("[data-resume-block]"),
  );

  for (let page = 1; page < pages; page += 1) {
    const padTop = padTopForPage(page, root);
    if (padTop <= 0) continue;
    const pageStart = page * pageHeight;
    const minTop = pageStart + padTop;
    let firstOnPage: { node: HTMLElement; top: number } | null = null;

    for (const leaf of leaves) {
      const top = topWithin(leaf, root, scale);
      const height = heightOf(leaf, scale);
      if (height <= 0 || top + height <= pageStart + 1) continue;
      if (top >= (page + 1) * pageHeight - 1) continue;
      if (!firstOnPage || top < firstOnPage.top) {
        firstOnPage = { node: leaf, top };
      }
    }

    if (!firstOnPage || firstOnPage.top <= minTop + 2) continue;
    pullUp(firstOnPage.node, firstOnPage.top - minTop);
  }
}

/** Keep the bottom inset on every page except the last. */
function enforceContinuationBottomSpacing(
  root: HTMLElement,
  pageHeight: number,
  pages: number,
) {
  if (pages <= 1) return;
  let guard = 0;
  while (guard++ < 24) {
    const scale = scaleOf(root);
    const leaves = [...root.querySelectorAll<HTMLElement>("[data-resume-block]")].filter(
      (node) => !node.querySelector("[data-resume-block]"),
    );
    let moved = false;

    for (const leaf of leaves) {
      const top = topWithin(leaf, root, scale);
      const height = heightOf(leaf, scale);
      if (height <= 0) continue;
      const bottom = top + height;
      const startPage = Math.floor(Math.max(top, 0) / pageHeight);
      if (startPage >= pages - 1) continue;
      const padBottom = padBottomForPage(startPage);
      const limit = (startPage + 1) * pageHeight - padBottom;
      if (bottom <= limit + 1) continue;

      const nextPage = startPage + 1;
      const nextTop = nextPage * pageHeight + padTopForPage(nextPage, root);
      const gap = nextTop - top;
      if (gap < 4) continue;
      pushDown(leaf, gap);
      moved = true;
      break;
    }

    if (!moved) break;
  }
}

function pieceThatCrosses(
  node: HTMLElement,
  root: HTMLElement,
  pageHeight: number,
  scale: number,
): HTMLElement | null {
  const children = [...node.children].filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

  for (const child of children) {
    const top = topWithin(child, root, scale);
    const height = heightOf(child, scale);
    const bottom = top + height;
    const page = Math.floor(Math.max(top, 0) / pageHeight);
    const padTop = padTopForPage(page, root);
    const padBottom = padBottomForPage(page);
    const usable = pageHeight - padTop - padBottom;
    const limit = (page + 1) * pageHeight - padBottom;
    if (bottom <= limit + 1) continue;
    if (height <= usable) return child;
    return (
      pieceThatCrosses(child, root, pageHeight, scale) ??
      (height <= pageHeight ? child : null)
    );
  }

  return null;
}

function sameColor(a: string, b: string) {
  return a.replace(/\s/g, "") === b.replace(/\s/g, "");
}

function sidebarMarginBackground(
  pageHeight: number,
  pages: number,
  rootPadTop: number,
  padBottom: number,
  bg: string,
) {
  const stops: string[] = [];
  for (let page = 0; page < pages; page += 1) {
    const topPad = page === 0 ? rootPadTop : PAGE_PAD_TOP;
    const start = page * pageHeight;
    const end = start + pageHeight;
    stops.push(
      `transparent ${start}px`,
      `transparent ${start + topPad}px`,
      `${bg} ${start + topPad}px`,
      `${bg} ${end - padBottom}px`,
      `transparent ${end - padBottom}px`,
      `transparent ${end}px`,
    );
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

function paintPageMargins(
  root: HTMLElement,
  pageHeight: number,
  pages: number,
) {
  const scale = scaleOf(root);
  const pageBg = getComputedStyle(root).backgroundColor;
  const { top: rootPadTop } = readSheetPadding(root);
  const padBottom = PAGE_PAD_BOTTOM;
  const maskHeight = pages * pageHeight;
  root.querySelectorAll("aside, article > div").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const height = heightOf(node, scale);
    if (height < pageHeight * 0.75) return;
    const bg = getComputedStyle(node).backgroundColor;
    if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)" || sameColor(bg, pageBg)) {
      return;
    }
    const top = topWithin(node, root, scale);
    node.dataset.pagePaint = "true";
    node.dataset.pagePaintColor = node.style.backgroundColor;
    node.dataset.pagePaintImage = node.style.backgroundImage;
    node.style.backgroundColor = "transparent";
    node.style.backgroundImage = sidebarMarginBackground(
      pageHeight,
      pages,
      rootPadTop,
      padBottom,
      bg,
    );
    node.style.backgroundRepeat = "no-repeat";
    node.style.backgroundSize = `100% ${maskHeight}px`;
    node.style.backgroundPosition = `0px ${-top}px`;
  });
}

export function paginateResume(root: HTMLElement, pageHeight: number) {
  if (!pageHeight) return 1;
  clearBreaks(root);

  let guard = 0;
  while (guard++ < 48) {
    const scale = scaleOf(root);
    const leaves = [...root.querySelectorAll<HTMLElement>("[data-resume-block]")].filter(
      (node) => !node.querySelector("[data-resume-block]"),
    );
    let moved = false;

    for (const heading of root.querySelectorAll("h2, h3")) {
      if (!(heading instanceof HTMLElement)) continue;
      const headingTop = topWithin(heading, root, scale);
      const headingPage = Math.floor(Math.max(headingTop, 0) / pageHeight);
      const padTop = padTopForPage(headingPage, root);
      if (padTop <= 0) continue;
      const headingStart = headingPage * pageHeight;
      if (headingTop < headingStart + padTop - 1) {
        const gap = headingStart + padTop - headingTop;
        if (gap > 2) {
          pushDown(heading, gap);
          moved = true;
          break;
        }
      }
    }
    if (moved) continue;

    for (const leaf of leaves) {
      const scaleNow = scaleOf(root);
      const top = topWithin(leaf, root, scaleNow);
      const height = heightOf(leaf, scaleNow);
      if (height <= 0) continue;
      const bottom = top + height;
      const startPage = Math.floor(Math.max(top, 0) / pageHeight);
      const padTop = padTopForPage(startPage, root);
      const padBottom = padBottomForPage(startPage);
      const limit = (startPage + 1) * pageHeight - padBottom;
      const usable = pageHeight - padTop - padBottom;
      const pageStart = startPage * pageHeight;
      const needsTopInset = padTop > 0 && top < pageStart + padTop - 1 && height <= usable;
      let target = leaf;

      if (!needsTopInset && bottom <= limit + 1) continue;

      if (height > usable) {
        const piece = pieceThatCrosses(leaf, root, pageHeight, scaleNow);
        if (!piece) continue;
        target = piece;
        const targetTop = topWithin(piece, root, scaleNow);
        const targetHeight = heightOf(piece, scaleNow);
        const piecePage = Math.floor(Math.max(targetTop, 0) / pageHeight);
        const piecePadTop = padTopForPage(piecePage, root);
        const piecePadBottom = padBottomForPage(piecePage);
        const pieceUsable = pageHeight - piecePadTop - piecePadBottom;
        if (targetHeight > pieceUsable) continue;
        const pieceLimit = (piecePage + 1) * pageHeight - piecePadBottom;
        if (targetTop + targetHeight <= pieceLimit + 1) continue;
      }

      const anchor = needsTopInset ? leaf : breakTarget(target, root);
      const anchorTop = topWithin(anchor, root, scaleOf(root));
      const targetTop = topWithin(target, root, scaleOf(root));
      const anchorPage = Math.floor(Math.max(anchorTop, 0) / pageHeight);
      const insetPage = needsTopInset ? anchorPage : anchorPage + 1;
      const nextPadTop = padTopForPage(insetPage, root);
      const nextTop = needsTopInset
        ? anchorPage * pageHeight + nextPadTop
        : insetPage * pageHeight + nextPadTop;
      const gapFrom = needsTopInset ? anchorTop : targetTop;
      const gap = nextTop - gapFrom;
      if (gap < 4) continue;
      pushDown(anchor, gap);
      moved = true;
      break;
    }

    if (!moved) break;
  }

  let pages = Math.max(1, Math.ceil((root.scrollHeight - 1) / pageHeight));
  trimContinuationTopSpacing(root, pageHeight, pages);
  enforceContinuationBottomSpacing(root, pageHeight, pages);
  trimContinuationTopSpacing(root, pageHeight, pages);
  pages = Math.max(1, Math.ceil((root.scrollHeight - 1) / pageHeight));
  const scale = scaleOf(root);
  const paddingBottom = parseFloat(getComputedStyle(root).paddingBottom) || 0;
  root.style.minHeight = `${pages * pageHeight}px`;
  const fillToPageEdge = isModern(root);
  root.querySelectorAll<HTMLElement>("article").forEach((article) => {
    const articleTop = topWithin(article, root, scale);
    const height = Math.max(pages * pageHeight - paddingBottom - articleTop, 0);
    article.style.minHeight = `${height}px`;
    if (!fillToPageEdge) return;
    article.style.height = `${height}px`;
    if (getComputedStyle(article).display === "grid") {
      article.style.gridTemplateRows = article.dataset.resumeStretchRows ?? "1fr";
    }
    article
      .querySelectorAll<HTMLElement>(":scope > aside, aside[data-resume-sidebar-full]")
      .forEach((aside) => {
        if (aside.classList.contains("h-fit")) return;
        aside.style.alignSelf = "stretch";
        aside.style.height = "100%";
      });
  });
  paintPageMargins(root, pageHeight, pages);
  return Math.max(1, Math.ceil((root.scrollHeight - 1) / pageHeight));
}
