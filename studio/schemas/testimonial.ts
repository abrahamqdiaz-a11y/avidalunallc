import { defineField, defineType } from "sanity";
import { checkedText, visibleField } from "./fields";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  description:
    "No health results or medical claims in testimonials. The section stays hidden on the website until at least one testimonial is shown.",
  fields: [
    checkedText(
      "quote",
      "Quote",
      "Their words about the experience (for example how easy or relaxing it was). No health results or medical claims in testimonials.",
      4,
    ),
    defineField({
      name: "firstName",
      title: "First name",
      type: "string",
      description: "First name only.",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: "permission",
      title: "I have this person's written permission to publish this",
      type: "boolean",
      initialValue: false,
      validation: (rule) =>
        rule.custom((v) => (v === true ? true : "You need written permission before publishing a testimonial.")),
    }),
    visibleField,
  ],
  preview: { select: { title: "firstName", subtitle: "quote" } },
});
