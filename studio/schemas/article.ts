import { defineArrayMember, defineField, defineType } from "sanity";
import { complianceCheck } from "../lib/compliance";
import { checkedText, photoField, visibleField } from "./fields";

export const article = defineType({
  name: "article",
  title: "Wellness article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => [rule.required().error("Please add a title."), rule.custom(complianceCheck).warning()],
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Click “Generate”. This becomes the article's address.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    checkedText("summary", "Summary", "One or two sentences shown in the article list.", 2),
    defineField({
      name: "body",
      title: "Article text",
      type: "array",
      description: "Keep it general and plain. This is general information, not medical advice.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Small heading", value: "h3" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "Web address" }],
              },
            ],
          },
        }),
      ],
      validation: (rule) => [rule.required(), rule.custom(complianceCheck).warning()],
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      description: "Where the information comes from, e.g. a PubMed article.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "Web address", type: "url", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    photoField,
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    visibleField,
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "image" } },
});
