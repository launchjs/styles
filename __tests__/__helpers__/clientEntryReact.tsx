// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as React from "react";
import * as ReactDOM from "react-dom";

/* Local */
import Root from "./root"; // <-- same root import as on the server

// ----------------------------------------------------------------------------

// Attach our `<Root />` component to <div id="root"> in our SSR'd HTML output
ReactDOM.hydrate(<Root />, document.getElementById("root"));
