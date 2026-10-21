import { defineField } from "sanity";
import { complianceCheck } from "../lib/compliance";

export const visibleField = defineField({
  name: "visible",
  title: "Show on the website",
  type: "boolean",
  description: "Turn off to hide this without deleting it.",
  initialValue: true,
});

export const orderField = defineField({
  name: "order",
  title: "Order",
  type: "number",
  description: "Lower numbers show first (1, 2, 3...).",
  validation: (rule) => rule.integer().min(0),
});

export const photoField = defineField({
  name: "image",
  title: "Photo",
  type: "image",
  description: "Optional. Use your own photos. No photos of needles, IV bags or clients without permission.",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Describe the photo",
      type: "string",
      description: "A short description for people using screen readers, e.g. “Shary setting up a red light panel”.",
      validation: (rule) => rule.required().warning("Please describe the photo."),
    }),
  ],
});

export const priceField = (description: string) =>
  defineField({
    name: "price",
    title: "Price (US dollars)",
    type: "number",
    description,
    validation: (rule) => rule.min(1).max(1000).precision(2),
  });

/** Plain text with the soft medical-claim check. */
export const checkedText = (name: string, title: string, description: string, rows = 3, required = true) =>
  defineField({
    name,
    title,
    type: "text",
    rows,
    description,
    validation: (rule) => [
      ...(required ? [rule.required().error("Please fill this in.")] : []),
      rule.custom(complianceCheck).warning(),
    ],
  });
