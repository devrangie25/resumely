import { Font } from "@react-pdf/renderer";

export const PDF_SANS = "ResumeSans";
export const PDF_SANS_BOLD = "ResumeSans-Bold";
export const PDF_SERIF = "ResumeSerif";
export const PDF_SERIF_BOLD = "ResumeSerif-Bold";
export const PDF_SERIF_ITALIC = "ResumeSerif-Italic";

let registered = false;
let loading: Promise<void> | null = null;

export function pdfBodyFont(font: "sans" | "serif") {
  return font === "serif" ? PDF_SERIF : PDF_SANS;
}

export function pdfBoldFont(font: "sans" | "serif") {
  return font === "serif" ? PDF_SERIF_BOLD : PDF_SANS_BOLD;
}

export async function registerResumeFonts() {
  if (registered) return;
  if (loading) {
    await loading;
    return;
  }

  loading = (async () => {
    Font.register({
      family: PDF_SANS,
      src: "/fonts/Geist-Regular.ttf",
    });
    Font.register({
      family: PDF_SANS_BOLD,
      src: "/fonts/Geist-Bold.ttf",
    });
    Font.register({
      family: PDF_SERIF,
      src: "/fonts/SourceSerif4-Regular.ttf",
    });
    Font.register({
      family: PDF_SERIF_BOLD,
      src: "/fonts/SourceSerif4-Bold.ttf",
    });
    Font.register({
      family: PDF_SERIF_ITALIC,
      src: "/fonts/SourceSerif4-It.ttf",
    });

    await Promise.all([
      Font.load({ fontFamily: PDF_SANS }),
      Font.load({ fontFamily: PDF_SANS_BOLD }),
      Font.load({ fontFamily: PDF_SERIF }),
      Font.load({ fontFamily: PDF_SERIF_BOLD }),
      Font.load({ fontFamily: PDF_SERIF_ITALIC }),
    ]);

    registered = true;
    loading = null;
  })();

  await loading;
}
