// 🚀 Launch.js - src/styles.ts tests

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import App from "@launch/app";
import EntryPlugin from "@launch/entry";

/* Local */
import Styles from "../index";

// ----------------------------------------------------------------------------

void new App()
  .production()
  .port(3001)
  .plugin(
    new Styles(),
    new EntryPlugin()
      .client(require.resolve("./__helpers__/clientEntryReact.tsx"))
      .server(require.resolve("./__helpers__/serverEntryReact.tsx")),
  )
  .launch();
