# Claros landing page

A static site for GitHub Pages. No build step: `index.html`, `styles.css`, `script.js`, `favicon.svg`, `.nojekyll` and the `img/` folder are the whole site, all linked with relative paths, so it works at a project address like `https://<username>.github.io/claros/`.

## Contact form

The "Founding office spots" form near the end of `index.html` sends to your Formspree form (ID `xkjrrqde`), and messages arrive at the email on your Formspree account. Once the site is live, send one test from the page; Formspree may ask you to confirm the form by email the first time.

## Put it on GitHub Pages

1. On GitHub, create a new **public** repository named `claros`.
2. Upload everything in this folder, keeping the `img/` folder and the `.nojekyll` file (it's hidden on a Mac; press Cmd+Shift+. in Finder to see it).
3. In the repository, open **Settings > Pages**. Under "Build and deployment", pick **Deploy from a branch**, then branch `main` and folder `/ (root)`, and save.
4. After a minute or two the site is at `https://<username>.github.io/claros/`.

To use a custom domain later, add it under Settings > Pages > Custom domain and point the domain's DNS at GitHub Pages.
