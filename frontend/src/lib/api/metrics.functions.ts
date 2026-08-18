// Metrik sayacının tarayıcıdan çağrılabilen ucu.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const hit = z.object({
  slug: z.string().min(1),
  id: z.string().min(1),
});

/** Makale sayfası açıldığında bir kez çağrılır. */
export const recordView = createServerFn({ method: "POST" })
  .inputValidator(hit)
  .handler(async ({ data }) => {
    const { increment } = await import("../metrics.server");
    try {
      return await increment(data.slug, data.id, "views");
    } catch {
      return { views: 0, downloads: 0 };
    }
  });

/** PDF veya XML indirme bağlantısına tıklandığında çağrılır. */
export const recordDownload = createServerFn({ method: "POST" })
  .inputValidator(hit)
  .handler(async ({ data }) => {
    const { increment } = await import("../metrics.server");
    try {
      return await increment(data.slug, data.id, "downloads");
    } catch {
      return { views: 0, downloads: 0 };
    }
  });
