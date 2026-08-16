export const SITE_ORIGIN = import.meta.env.VITE_SITE_URL ?? "https://cf.org.tr";
export const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/cfopen-share.png`;

export function absoluteSiteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}
