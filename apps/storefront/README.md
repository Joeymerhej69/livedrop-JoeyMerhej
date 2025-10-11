## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # Storefront (Week 4)

    Minimal Storefront app used for the Week 4 assignment.

    Run instructions:

    1) install
    npm install
    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material  (used mui because tailwind was not working properly)


    2) dev

      npm run dev
      npm run storybook

    3) build

       npm run build

    4) test

       npm run test

    Notes:
    - This app is intentionally minimal: focus is on the single checkout journey and the Ask Support panel.

```
