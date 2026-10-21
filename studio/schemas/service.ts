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
          { title: "Vitamin boost or injection", value: "vitamin" },
          { title: "By consultation", value: "consultation" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Please choose a category."),
    }),
    checkedText("description", "Short description", "One or two plain sentences about the experience. No health promises."),
    priceField("Leave empty if you don't want a price shown. Must match your Hydreight price."),
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
