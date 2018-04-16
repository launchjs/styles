// 🚀 Launch.js - root React component (for testing)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";

/* Local */
import css from "./styles.scss";

// ----------------------------------------------------------------------------

console.log("css ->", css);

export default () => (
  <h1 className={css.test}>Testing</h1>
);
