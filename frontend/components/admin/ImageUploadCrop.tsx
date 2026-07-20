"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, ImageIcon, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";

interface CropBox { x: number; y: number; w: number; h: number; }
interface ImgLayout { x: number; y: number; w: number; h: number; }

export default function ImageUploadCrop({
  value,
  onChange,
  onPendingChange,
  onRegisterUpload
}: {
  value: string;
  onChange: (url: string) => void;
  onPendingChange?: (hasPending: boolean) => void;
  onRegisterUpload?: (fn: () => Promise<string | null>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgLayout, setImgLayout] = useState<ImgLayout>({ x: 0, y: 0, w: 0, h: 0 });
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<{ type: "move" | "resize"; startX: number; startY: number; startCrop: CropBox } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || "");
  const [fileType, setFileType] = useState("image/jpeg");

  const CANVAS_W = 560;
  const CANVAS_H = 315;

  // Sync fileType and preview with value prop changes
  useEffect(() => {
    setPreview(value || "");
    if (value) {
      const lower = value.toLowerCase();
      if (lower.endsWith(".png")) setFileType("image/png");
      else if (lower.endsWith(".webp")) setFileType("image/webp");
      else setFileType("image/jpeg");
    }
  }, [value]);

  /** Compute where image is drawn inside the canvas maintaining aspect ratio (object-fit:contain) */
  const calcLayout = useCallback((img: HTMLImageElement): ImgLayout => {
    const ia = img.naturalWidth / img.naturalHeight;
    const ca = CANVAS_W / CANVAS_H;
    if (ia > ca) {
      const h = CANVAS_W / ia;
      return { x: 0, y: (CANVAS_H - h) / 2, w: CANVAS_W, h };
    }
    const w = CANVAS_H * ia;
    return { x: (CANVAS_W - w) / 2, y: 0, w, h: CANVAS_H };
  }, []);

  const drawCanvas = useCallback((img: HTMLImageElement, layout: ImgLayout, c: CropBox) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    
    // Background for letterbox areas - slate-800 (#1e293b)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const size = 10;
    const gridStep = size * 2;

    // Draw checkerboard transparency grid inside the image bounds
    ctx.save();
    ctx.beginPath();
    ctx.rect(layout.x, layout.y, layout.w, layout.h);
    ctx.clip();
    for (let px = layout.x - (layout.x % gridStep) - gridStep; px < layout.x + layout.w; px += gridStep) {
      for (let py = layout.y - (layout.y % gridStep) - gridStep; py < layout.y + layout.h; py += gridStep) {
        ctx.fillStyle = "#f3f4f6"; // light gray
        ctx.fillRect(px, py, size, size);
        ctx.fillRect(px + size, py + size, size, size);
        ctx.fillStyle = "#ffffff"; // white
        ctx.fillRect(px + size, py, size, size);
        ctx.fillRect(px, py + size, size, size);
      }
    }
    ctx.restore();

    // Draw image at correct position — NO stretching
    ctx.drawImage(img, layout.x, layout.y, layout.w, layout.h);

    // Dark overlay on top of image
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(layout.x, layout.y, layout.w, layout.h);

    // Reveal crop area with correct source coordinates
    const sx = (c.x - layout.x) / layout.w * img.naturalWidth;
    const sy = (c.y - layout.y) / layout.h * img.naturalHeight;
    const sw = c.w / layout.w * img.naturalWidth;
    const sh = c.h / layout.h * img.naturalHeight;

    // Draw checkerboard inside the crop box first to keep it bright and clear
    ctx.save();
    ctx.beginPath();
    ctx.rect(c.x, c.y, c.w, c.h);
    ctx.clip();
    for (let px = c.x - (c.x % gridStep) - gridStep; px < c.x + c.w; px += gridStep) {
      for (let py = c.y - (c.y % gridStep) - gridStep; py < c.y + c.h; py += gridStep) {
        ctx.fillStyle = "#f3f4f6"; // light gray
        ctx.fillRect(px, py, size, size);
        ctx.fillRect(px + size, py + size, size, size);
        ctx.fillStyle = "#ffffff"; // white
        ctx.fillRect(px + size, py, size, size);
        ctx.fillRect(px, py + size, size, size);
      }
    }
    ctx.restore();

    ctx.drawImage(img, sx, sy, sw, sh, c.x, c.y, c.w, c.h);

    // Crop border
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 2;
    ctx.strokeRect(c.x, c.y, c.w, c.h);

    // Single large resize handle — bottom-right corner only
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(c.x + c.w - 12, c.y + c.h - 12, 22, 22);

    // Thirds grid
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(c.x + (c.w/3)*i, c.y); ctx.lineTo(c.x + (c.w/3)*i, c.y + c.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(c.x, c.y + (c.h/3)*i); ctx.lineTo(c.x + c.w, c.y + (c.h/3)*i); ctx.stroke();
    }
  }, []);

  useEffect(() => {
    if (imgEl && imgLayout.w > 0) drawCanvas(imgEl, imgLayout, crop);
  }, [imgEl, imgLayout, crop, drawCanvas]);

  // Register the upload function with parent so it can trigger it on save
  useEffect(() => {
    if (onRegisterUpload) {
      onRegisterUpload(handleUpload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgEl, imgLayout, crop]);

  const loadFile = (f: File) => {
    setError("");
    if (!f.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Hanya JPEG, PNG, dan WEBP yang didukung.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5 MB.");
      return;
    }
    setFileType(f.type);
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const layout = calcLayout(img);
        setImgLayout(layout);
        setImgEl(img);

        // Initial crop: force 16:9 aspect ratio centered within layout
        let w, h;
        if (layout.w / layout.h > 16 / 9) {
          h = layout.h * 0.8;
          w = h * 16 / 9;
        } else {
          w = layout.w * 0.8;
          h = w * 9 / 16;
        }
        const x = layout.x + (layout.w - w) / 2;
        const y = layout.y + (layout.h - h) / 2;
        setCrop({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
        onPendingChange?.(true);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(f);
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imgEl) return;
    const { x, y } = getCanvasPos(e);
    const isInHandle = x >= crop.x + crop.w - 20 && x <= crop.x + crop.w + 20 && y >= crop.y + crop.h - 20 && y <= crop.y + crop.h + 20;
    const isInBox = x >= crop.x && x <= crop.x + crop.w && y >= crop.y && y <= crop.y + crop.h;
    if (isInHandle) setDragging({ type: "resize", startX: x, startY: y, startCrop: { ...crop } });
    else if (isInBox) setDragging({ type: "move", startX: x, startY: y, startCrop: { ...crop } });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !imgEl) return;
    const { x, y } = getCanvasPos(e);
    const dx = x - dragging.startX, dy = y - dragging.startY;
    const sc = dragging.startCrop, il = imgLayout;
    if (dragging.type === "move") {
      setCrop({
        ...crop,
        x: Math.max(il.x, Math.min(il.x + il.w - sc.w, sc.x + dx)),
        y: Math.max(il.y, Math.min(il.y + il.h - sc.h, sc.y + dy))
      });
    } else {
      // Force 16:9 aspect ratio on resize
      let newW = sc.w + dx;
      let newH = newW * 9 / 16;
      
      const maxW = il.x + il.w - sc.x;
      const maxH = il.y + il.h - sc.y;
      
      if (newW > maxW) {
        newW = maxW;
        newH = newW * 9 / 16;
      }
      if (newH > maxH) {
        newH = maxH;
        newW = newH * 16 / 9;
      }
      if (newW < 40) {
        newW = 40;
        newH = newW * 9 / 16;
      }
      setCrop({ ...crop, w: Math.round(newW), h: Math.round(newH) });
    }
  };

  const onMouseUp = () => setDragging(null);

  const handleUpload = async (): Promise<string | null> => {
    if (!imgEl) return null;
    setUploading(true);
    setError("");
    try {
      const il = imgLayout;
      // Map canvas crop coords to natural image pixels using layout offset
      const srcX = Math.round((crop.x - il.x) / il.w * imgEl.naturalWidth);
      const srcY = Math.round((crop.y - il.y) / il.h * imgEl.naturalHeight);
      const srcW = Math.round(crop.w / il.w * imgEl.naturalWidth);
      const srcH = Math.round(crop.h / il.h * imgEl.naturalHeight);
      
      const offscreen = document.createElement("canvas");
      offscreen.width = srcW; offscreen.height = srcH;
      const ctx = offscreen.getContext("2d")!;
      // Draw image onto offscreen canvas
      ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
      
      const exportType = fileType || "image/jpeg";
      const fileExt = exportType === "image/png" ? "png" : exportType === "image/webp" ? "webp" : "jpg";
      
      const blob = await new Promise<Blob>((res, rej) => offscreen.toBlob(b => b ? res(b) : rej(new Error("gagal")), exportType, 0.9));
      const url = await api.admin.uploadImage(blob, `point_${Date.now()}.${fileExt}`);
      setPreview(url);
      setImgEl(null);
      onChange(url);
      onPendingChange?.(false);
      return url;
    } catch (err: any) {
      setError(err.message || "Gagal mengupload gambar. Periksa koneksi dan coba lagi.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setImgEl(null);
    setImgLayout({ x: 0, y: 0, w: 0, h: 0 });
    setPreview("");
    setError("");
    onChange("");
    onPendingChange?.(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
      />

      {!imgEl && !preview && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50"
        >
          <ImageIcon className="w-7 h-7" />
          <span className="text-xs font-medium">Klik untuk pilih gambar (JPEG/PNG/WEBP, maks 5 MB)</span>
        </button>
      )}

      {imgEl && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="font-semibold text-gray-700">Atur area crop:</span> Seret kotak hijau untuk memindahkan · Seret sudut kanan bawah untuk mengubah ukuran (Rasio 16:9)
          </p>
          <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-slate-800" style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className="w-full h-full cursor-crosshair select-none block"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Mengupload…" : "Potong & Unggah"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
              title="Ganti gambar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {preview && !imgEl && (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ aspectRatio: "16/9" }}>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-semibold hover:bg-gray-100">Ganti</button>
            <button type="button" onClick={reset} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600">Hapus</button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {uploading && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      )}
    </div>
  );
}
