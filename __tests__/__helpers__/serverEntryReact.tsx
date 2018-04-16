// Server entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { Output } from "@launch/app";
import { Context } from "koa";
import * as React from "react";
import * as ReactDOM from "react-dom/server";

/* Local */
import Root from "./root";

// ----------------------------------------------------------------------------

export default function(output: Output) {
  console.log(output.client.mainCss);

  return (ctx: Context) => {
    ctx.body = `
      <!doctype html>
      <html>
        <head>
          <title>React running on Launch.js</title>
          <link rel="stylesheet" type="text/css" href="${output.client.mainCss}">
        </head>
        <body>
          <div id="root">${ReactDOM.renderToString(<Root />)}</div>
          <script src="${output.client.mainJs}"></script>
        </body>
      </html>
    `.replace(/(\s)\s+/g, "$1").trim();
  };
}
