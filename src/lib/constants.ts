// Single source of truth for values that may change later.
// Sanity `siteSettings` overrides the contact values at runtime when it is configured.

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "YourRNShary@gmail.com";

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || CONTACT_EMAIL;

export const HYDREIGHT_BOOKING_URL =
  process.env.HYDREIGHT_BOOKING_URL || "https://booking.hydreight.com/widget-business/an92x";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.avidaluna.com";

export const PHONE_DISPLAY = "(941) 348-6972";
export const PHONE_TEL = "tel:9413486972";

export const LEGAL_NAME = "Avida Luna LLC";
export const BRAND_NAME = "Avida Luna Wellness";
export const LEGAL_LINE = `${LEGAL_NAME}, doing business as ${BRAND_NAME}`;

export const NO_MEDICAL_INFO_NOTE = "Please don't include medical information here.";
