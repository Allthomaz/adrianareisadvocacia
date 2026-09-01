import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { site } from "./src/data/site";

export default defineConfig({
  site: site.url,
  output: "static",
  redirects: {
    "/sobre": "/#sobre",
    "/atuacao": "/#atuacao",
    "/atuacao/direito-civil": "/#atuacao",
    "/atuacao/direito-trabalhista": "/#atuacao",
    "/atuacao/direito-previdenciario": "/#atuacao",
    "/contato": "/#como-comecar",
    "/conteudos": "/",
  },
  integrations: [sitemap({ filter: (page) => page === `${site.url}/` })],
  vite: {
    plugins: [tailwindcss()],
  },
});
