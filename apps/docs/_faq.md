Collection of frequently asked questions with ideas on how to troubleshoot and resolve them.

## Unexpected behavior after installing or bumping dependencies

This error often occurs when multiple conflicting versions of ReactiveDOT are installed. To resolve this, try the following steps:

1. **Ensure all ReactiveDOT dependencies are up to date**

1. **Clean and reinstall dependencies:**  
   Delete your `node_modules` folder and reinstall dependencies. You can do this manually or use [npkill](https://npkill.js.org/):

   ```sh
   npx npkill
   ```

1. **Deduplicate dependencies:**  
   Some package manager does not deduplicate dependencies by default and may create duplicates when updating packages. To fix this, run dedupe:

   ```sh
   #NPM
   npm dedupe

   # Yarn
   yarn dedupe

   #PNPM
   pnpm dedupe
   ```
