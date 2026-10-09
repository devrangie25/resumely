import { createRoot } from "react-dom/client";

import { ResumePreview } from "@/components/resume/resume-preview";
import { paginateResume } from "@/lib/resume/page-breaks";
import type { ResumeContent, TemplateId } from "@/lib/resume/schema";

function waitForImages(root: ParentNode) {
  const images = [...root.querySelectorAll("img")];
  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function generateResumePdfBlob({
  content,
  templateId,
}: {
  content: ResumeContent;
  templateId: TemplateId;
}) {
  const { toCanvas } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:0;top:0;z-index:-1;pointer-events:none;background:#ffffff;";
  document.body.appendChild(host);

  const ruler = document.createElement("div");
  ruler.style.width = "210mm";
  ruler.style.height = "297mm";
  host.appendChild(ruler);

  const mount = document.createElement("div");
  host.appendChild(mount);
  const root = createRoot(mount);
  let sheet: HTMLElement | null = null;

  try {
    root.render(
      <ResumePreview content={content} templateId={templateId} chrome={false} />,
    );
    await nextFrame();
    await nextFrame();
    await document.fonts.ready;
    await waitForImages(mount);

    sheet = mount.querySelector<HTMLElement>("[data-resume-sheet]");
    if (!sheet) {
      throw new Error("Resume preview did not render.");
    }

    const pageWidth = ruler.offsetWidth;
    const pageHeight = ruler.offsetHeight;

    const backgroundColor = getComputedStyle(sheet).backgroundColor || "#ffffff";
    const frame = document.createElement("div");
    frame.style.width = `${pageWidth}px`;
    frame.style.height = `${pageHeight}px`;
    frame.style.overflow = "hidden";
    frame.style.backgroundColor = backgroundColor;
    host.appendChild(frame);
    const capture = sheet.cloneNode(true);
    if (!(capture instanceof HTMLElement)) {
      throw new Error("Resume preview did not render.");
    }
    frame.appendChild(capture);
    const pages = paginateResume(capture, pageHeight);
    await nextFrame();

    const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });

    for (let index = 0; index < pages; index += 1) {
      capture.style.transform = `translateY(${-index * pageHeight}px)`;
      const canvas = await toCanvas(frame, {
        pixelRatio: 2,
        backgroundColor,
        width: pageWidth,
        height: pageHeight,
      });
      const image = canvas.toDataURL("image/png");
      if (index > 0) pdf.addPage();
      pdf.addImage(image, "PNG", 0, 0, 210, 297);
    }

    return pdf.output("blob");
  } finally {
    try {
      root.unmount();
    } catch {
      // Page layout inserts nodes outside React. That must not fail the download.
    }
    host.remove();
  }
}

export function safeResumeFilename(title: string) {
  return title.trim().replace(/[^\w\- ]+/g, "") || "resume";
}
