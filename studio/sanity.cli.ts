import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "TODO-project-id",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Hosting choice is decided at Checkpoint 1 (avidaluna.sanity.studio or /studio on the site).
  studioHost: "avidaluna",
});
