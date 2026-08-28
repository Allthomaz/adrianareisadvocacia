import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Placeholder técnico: substituir apenas após a cliente confirmar o domínio.
  site: "https://adriana-reis-advocacia.example",
  output: "static",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
