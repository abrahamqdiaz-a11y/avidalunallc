import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Avida Luna",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "TODO-project-id",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  // The plain-English desk menu (Services, Add-ons, Events, ...) is added in Step 3.
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
