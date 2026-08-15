export const SITE_ORIGIN = "https://socialsolutions.netlify.app";
export const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/cfopen-share.png`;

export function absoluteSiteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}
