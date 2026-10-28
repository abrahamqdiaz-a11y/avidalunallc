import { defineField, defineType } from "sanity";
import { complianceCheck } from "../lib/compliance";
import { checkedText, orderField, visibleField } from "./fields";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => [rule.required().error("Please add the question."), rule.custom(complianceCheck).warning()],
    }),
    checkedText("answer", "Answer", "A short, plain answer.", 4),
    defineField({
      name: "placement",
      title: "Show on",
      type: "string",
      options: {
        list: [
          { title: "FAQ page", value: "faq" },
          { title: "Services page", value: "services" },
        ],
        layout: "radio",
      },
      initialValue: "faq",
    }),
    orderField,
    visibleField,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "order" } },
});
