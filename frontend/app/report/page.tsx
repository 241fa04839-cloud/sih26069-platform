"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

const reportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  hazardType: z.enum(["flooding", "heatwave", "cyclone", "landslide", "drought", "storm", "other"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  location: z.string().min(2),
  image: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Image must be less than 5MB"),
  honeypot: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: "",
      email: "",
      hazardType: "flooding",
      description: "",
      location: "",
      image: null,
      honeypot: "",
    },
  });

  const { data: awsStations } = useQuery({
    queryKey: ["aws-stations"],
    queryFn: async () => {
      const res = await fetch("/api/aws-stations");
      return res.json();
    },
    enabled: false,
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        const compressed = await compressImage(file);
        const compressedFile = new File([compressed], file.name, { type: file.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(compressedFile);
        (register("image") as any).onChange?.(dataTransfer);
      }
    },
    [register]
  );

  const onSubmit = useCallback(
    async (data: ReportFormData) => {
      if (cooldown > 0) return;
      if (data.honeypot) return;
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("hazardType", data.hazardType);
        formData.append("description", data.description);
        formData.append("location", data.location);
        if (data.image && data.image instanceof File) {
          formData.append("image", data.image);
        }
        if (geolocation) {
          formData.append("latitude", String(geolocation.lat));
          formData.append("longitude", String(geolocation.lng));
        }
        await fetch("/api/reports", { method: "POST", body: formData });
        setSubmitted(true);
        reset();
        setImagePreview(null);
        setGeolocation(null);
        setCooldown(30);
        if (typeof window !== "undefined" && (window as any).plausible) {
          (window as any).plausible("report_submitted");
        }
      } catch (err) {
        console.error("Submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [cooldown, geolocation, reset]
  );

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tactical-green/10">
            <svg className="h-8 w-8 text-tactical-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Incident Reported</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your report has been submitted to the AI verification pipeline.
            You will be notified of the verification status shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 rounded border border-tactical-cyan bg-tactical-cyan/10 px-6 py-3 text-sm font-mono text-tactical-cyan"
          >
            REPORT ANOTHER INCIDENT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-tactical-canvas">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="border-b border-tactical-border pb-4">
          <h1 className="text-2xl font-bold text-white">CITIZEN INCIDENT REPORT</h1>
          <p className="mt-1 text-sm text-gray-400">
            Report a weather-related incident. All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono text-gray-400">
                Full Name *
              </label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-3 py-2 text-sm font-mono text-white focus:border-tactical-cyan"
              />
              {errors.name && <p className="mt-1 text-xs text-tactical-crimson">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-3 py-2 text-sm font-mono text-white focus:border-tactical-cyan"
              />
              {errors.email && <p className="mt-1 text-xs text-tactical-crimson">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400">
              Hazard Type *
            </label>
            <select
              {...register("hazardType")}
              className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-3 py-2 text-sm font-mono text-white focus:border-tactical-cyan"
            >
              <option value="flooding">Flooding</option>
              <option value="heatwave">Heatwave</option>
              <option value="cyclone">Cyclone</option>
              <option value="landslide">Landslide</option>
              <option value="drought">Drought</option>
              <option value="storm">Storm</option>
              <option value="other">Other</option>
            </select>
            {errors.hazardType && <p className="mt-1 text-xs text-tactical-crimson">{errors.hazardType.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400">
              Location Description *
            </label>
            <input
              {...register("location")}
              type="text"
              className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-3 py-2 text-sm font-mono text-white focus:border-tactical-cyan"
              placeholder="e.g., Near Kerala State Water Resources Administration"
            />
            {errors.location && <p className="mt-1 text-xs text-tactical-crimson">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="mt-1 w-full rounded border border-tactical-border bg-tactical-canvas px-3 py-2 text-sm font-mono text-white focus:border-tactical-cyan"
              placeholder="Describe the incident in detail..."
            />
            {errors.description && <p className="mt-1 text-xs text-tactical-crimson">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400">
              Geolocation
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-1 flex items-center gap-2 rounded border border-tactical-border bg-tactical-canvas px-4 py-2 text-sm font-mono text-gray-300 transition-colors hover:border-tactical-cyan hover:text-tactical-cyan"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {geolocation
                ? `Captured: ${geolocation.lat.toFixed(6)}, ${geolocation.lng.toFixed(6)}`
                : "Auto-Capture Location"}
            </button>
            {geolocation && (
              <p className="mt-1 font-mono text-[10px] text-tactical-green">
                ● GPS coordinates auto-captured and embedded in report
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400">
              Image Upload (Optional, max 5MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-xs font-mono text-gray-400 file:mr-4 file:rounded file:border file:border-tactical-border file:bg-tactical-canvas file:px-3 file:py-1.5 file:text-xs file:font-mono file:text-tactical-cyan"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview of uploaded incident image"
                  className="max-h-48 rounded border border-tactical-border"
                />
              </div>
            )}
            {errors.image && <p className="mt-1 text-xs text-tactical-crimson">{errors.image.message}</p>}
          </div>

          <input type="hidden" {...register("honeypot")} />

          <button
            type="submit"
            disabled={isSubmitting || cooldown > 0}
            className="w-full rounded-lg border-2 border-tactical-cyan bg-tactical-cyan/10 py-3 text-sm font-bold uppercase tracking-wider text-tactical-cyan transition-all hover:bg-tactical-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "SUBMITTING TO AI PIPELINE..."
              : cooldown > 0
              ? `COOLDOWN: ${cooldown}s`
              : "SUBMIT REPORT"}
          </button>

          <p className="text-center text-[10px] font-mono text-gray-600">
            By submitting, you agree to our{" "}
            <a href="/terms" className="text-tactical-cyan hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-tactical-cyan hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      const maxDim = 1200;
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height = (height * maxDim) / width;
        width = maxDim;
      } else if (height > maxDim) {
        width = (width * maxDim) / height;
        height = maxDim;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(file);
      }, "image/jpeg", 0.7);
    };
    img.src = URL.createObjectURL(file);
  });
}
