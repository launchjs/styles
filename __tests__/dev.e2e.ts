// 🚀 Launch.js - src/styles.ts tests

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import App from "@launch/app";

/* Local */
import Styles from "../index";

// ----------------------------------------------------------------------------

const styles = new Styles();

void new App()
  .clientEntry("__helpers__/clientEntryReact.tsx")
  .serverEntry("__helpers__/serverEntryReact.tsx")
  .plugin(styles)
  .launch();
