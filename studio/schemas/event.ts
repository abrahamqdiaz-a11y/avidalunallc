import { defineField, defineType } from "sanity";
import { checkedText, photoField, visibleField } from "./fields";

const time = (name: string, title: string, required: boolean) =>
  defineField({
    name,
    title,
    type: "string",
    description: "24-hour time, e.g. 18:30 for 6:30pm.",
    validation: (rule) => [
      ...(required ? [rule.required().error("Please add a start time.")] : []),
      rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "time" }).error("Use HH:MM, e.g. 09:00 or 18:30."),
    ],
  });

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  description: "Public events and pop-ups. Events disappear from the website automatically after their date.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("Please add a title.").max(80),
    }),
    defineField({
      name: "slug",
      title: "Short name for links",
      type: "slug",
      description: "Click “Generate”. Used for the event sign-up tag in Mailchimp.",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required().error("Please add the date."),
    }),
    time("startTime", "Start time", true),
    time("endTime", "End time", false),
    defineField({
      name: "place",
      title: "Place",
      type: "string",
      description: "Business name and city, e.g. “Main Street Studio, Lakewood Ranch”.",
      validation: (rule) => rule.required().error("Please add the place."),
    }),
    checkedText("description", "Short description", "One or two sentences about the event.", 3),
    defineField({ name: "link", title: "Link (optional)", type: "url", description: "e.g. the host's event page." }),
    photoField,
    visibleField,
  ],
  orderings: [{ title: "Date", name: "date", by: [{ field: "date", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});
