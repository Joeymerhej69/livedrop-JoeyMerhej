# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

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
