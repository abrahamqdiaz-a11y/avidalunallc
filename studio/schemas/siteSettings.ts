import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact info",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "Shown in the footer and the call button, e.g. (941) 348-6972.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Shown on the website. Change it here if you switch to a business address.",
      initialValue: "YourRNShary@gmail.com",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "serviceArea",
      title: "Service area",
      type: "string",
      description: "e.g. “Lakewood Ranch, Sarasota and Bradenton, FL”.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "instagram", title: "Instagram link", type: "url" }),
    defineField({ name: "facebook", title: "Facebook link", type: "url" }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "text",
      rows: 3,
      description: "The short note at the bottom of every page.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact info" }) },
});
