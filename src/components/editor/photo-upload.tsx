"use client";

import { useRef, useState } from "react";

import { PhotoCropDialog } from "@/components/editor/photo-crop-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUpload({
  resumeId,
  photoUrl,
  onChange,
}: {
  resumeId: string;
  photoUrl: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "image/jpeg") {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Keep the photo under 2 MB.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError("Sign in again to upload a photo.");
      setPending(false);
      return;
    }

    const path = `${userData.user.id}/${resumeId}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("resume-photos")
      .upload(path, file, { upsert: true, contentType: "image/jpeg" });

    if (uploadError) {
      setError(uploadError.message);
      setPending(false);
      return;
    }

    const { data } = supabase.storage.from("resume-photos").getPublicUrl(path);
    onChange(`${data.publicUrl}?t=${Date.now()}`);
    setPending(false);
  }

  function openFile(file: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Keep the photo under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleRemove() {
    if (!photoUrl) return;
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.storage
        .from("resume-photos")
        .remove([
          `${userData.user.id}/${resumeId}.jpg`,
          `${userData.user.id}/${resumeId}.png`,
          `${userData.user.id}/${resumeId}.webp`,
        ]);
    }
    onChange("");
    setPending(false);
  }

  return (
    <div className="grid gap-2 sm:col-span-2">
      <Label htmlFor="resume-photo">Profile photo</Label>
      <p className="text-xs text-muted-foreground">
        Shown on Modern designs. Crop after you choose a file. JPG, PNG, or
        WebP, up to 2 MB.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Resume photo"
            className="size-16 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
            No photo
          </div>
        )}
        <input
          ref={inputRef}
          id="resume-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) openFile(file);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Uploading..." : photoUrl ? "Replace photo" : "Upload photo"}
        </Button>
        {photoUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => setCropSrc(photoUrl)}
          >
            Crop photo
          </Button>
        ) : null}
        {photoUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={handleRemove}
          >
            Remove photo
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <PhotoCropDialog
        open={Boolean(cropSrc)}
        imageSrc={cropSrc}
        onOpenChange={(open) => {
          if (!open) setCropSrc(null);
        }}
        onCropped={(file) => {
          void uploadFile(file);
        }}
      />
    </div>
  );
}
