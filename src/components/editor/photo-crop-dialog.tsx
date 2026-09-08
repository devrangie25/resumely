"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VIEW = 260;
const OUTPUT = 512;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PhotoCropDialog({
  open,
  imageSrc,
  onOpenChange,
  onCropped,
}: {
  open: boolean;
  imageSrc: string | null;
  onOpenChange: (open: boolean) => void;
  onCropped: (file: File) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setImageSize({ w: 0, h: 0 });
    setError(null);
  }, [open, imageSrc]);

  function coverScale() {
    if (!imageSize.w || !imageSize.h) return 1;
    return Math.max(VIEW / imageSize.w, VIEW / imageSize.h);
  }

  function clampOffset(x: number, y: number, nextZoom = zoom) {
    const scale = coverScale() * nextZoom;
    const maxX = Math.max(0, (imageSize.w * scale - VIEW) / 2);
    const maxY = Math.max(0, (imageSize.h * scale - VIEW) / 2);
    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY),
    };
  }

  async function apply() {
    if (!imageSrc) return;
    setError(null);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    try {
      await image.decode();
    } catch {
      setError("Could not read that image. Try uploading it again.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const context = canvas.getContext("2d");
    if (!context) return;
    const scale = coverScale() * zoom;
    const displayWidth = image.naturalWidth * scale;
    const displayHeight = image.naturalHeight * scale;
    const left = (VIEW - displayWidth) / 2 + offset.x;
    const top = (VIEW - displayHeight) / 2 + offset.y;
    const sourceSize = VIEW / scale;
    context.drawImage(
      image,
      -left / scale,
      -top / scale,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT,
      OUTPUT,
    );
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!blob) return;
    onCropped(new File([blob], "resume-photo.jpg", { type: "image/jpeg" }));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop photo</DialogTitle>
          <DialogDescription>
            Drag to reposition and zoom until the face sits in the circle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid justify-items-center gap-4">
          <div
            className="relative overflow-hidden rounded-full bg-zinc-200"
            style={{ width: VIEW, height: VIEW, touchAction: "none" }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                x: event.clientX,
                y: event.clientY,
                ox: offset.x,
                oy: offset.y,
              };
            }}
            onPointerMove={(event) => {
              if (!dragRef.current) return;
              setOffset(
                clampOffset(
                  dragRef.current.ox + event.clientX - dragRef.current.x,
                  dragRef.current.oy + event.clientY - dragRef.current.y,
                ),
              );
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
          >
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                draggable={false}
                className="pointer-events-none max-w-none select-none"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${coverScale() * zoom})`,
                  transformOrigin: "center center",
                }}
                onLoad={(event) => {
                  setImageSize({
                    w: event.currentTarget.naturalWidth,
                    h: event.currentTarget.naturalHeight,
                  });
                }}
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/80" />
          </div>
          <label className="grid w-full gap-1.5 text-sm">
            <span className="text-muted-foreground">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => {
                const nextZoom = Number(event.target.value);
                setZoom(nextZoom);
                setOffset((current) => clampOffset(current.x, current.y, nextZoom));
              }}
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void apply()}>
            Apply crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
