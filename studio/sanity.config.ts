import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes, SINGLETON_TYPES } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "Avida Luna",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "p388w82e",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Hide one-of-a-kind documents from the "Create new" menu.
    templates: (templates) => templates.filter((t) => !SINGLETON_TYPES.has(t.schemaType)),
  },
  document: {
    // Singletons can be edited and published, but not duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter((a) => a.action && ["publish", "discardChanges", "restore"].includes(a.action))
        : actions,
  },
});
