import { defineField, defineType } from "sanity";
import { complianceCheck } from "../lib/compliance";
import { checkedText, orderField, photoField, priceField, visibleField } from "./fields";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Plain and simple, e.g. “Recovery”. Avoid medical words like “hangover” or “migraine”.",
      validation: (rule) => [
        rule.required().error("Please add a name."),
        rule.max(60),
        rule.custom(complianceCheck).warning(),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "IV drip", value: "iv" },
          { title: "Drip add-in (added to an IV)", value: "boost" },
          { title: "Vitamin injection", value: "vitamin" },
          { title: "By consultation", value: "consultation" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Please choose a category."),
    }),
    checkedText("description", "Short description", "One or two plain sentences about the experience. No health promises."),
    defineField({
      name: "goodFor",
      title: "Good for",
      type: "string",
      description: "IV drips only. A few short words, e.g. “Training · Endurance · Rest days”. No health promises.",
      hidden: ({ document }) => document?.category !== "iv",
      validation: (rule) => [rule.max(60), rule.custom(complianceCheck).warning()],
    }),
    priceField("Leave empty if you don't want a price shown. Must match your Hydreight price."),
    defineField({
      name: "optionName",
      title: "Upgrade name",
      type: "string",
      description: "Optional. One upgrade shown on the same card, e.g. “With chromium”.",
      hidden: ({ document }) => document?.category !== "iv",
      validation: (rule) => [rule.max(40), rule.custom(complianceCheck).warning()],
    }),
    defineField({
      name: "optionPrice",
      title: "Upgrade price (US dollars)",
      type: "number",
      description: "The full price with the upgrade, e.g. 240. Must match your Hydreight price.",
      hidden: ({ document }) => document?.category !== "iv",
      validation: (rule) => rule.min(1).max(1000).precision(2),
    }),
    defineField({
      name: "showPrice",
      title: "Show the price",
      type: "boolean",
      description: "Only turn on once you've confirmed this price matches Hydreight.",
      initialValue: false,
    }),
    photoField,
    orderField,
    visibleField,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "category", media: "image" } },
});
