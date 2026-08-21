import { defineConfig } from 'astro/config';

export default defineConfig({
  // Custom domain (with a CNAME record pointing at GitHub Pages):
  site: 'https://terragohan.com',
  //
  // If you deploy as a project page instead (https://<user>.github.io/<repo>),
  // use:
  //   site: 'https://<user>.github.io',
  //   base: '/<repo>',
});

