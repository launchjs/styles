# 🚀 Launch.js - CSS/Sass/Less/PostCSS preset

[![Build Status](https://travis-ci.org/launchjs/app.svg?branch=master)](https://travis-ci.org/launchjs/styles) ![npm](https://img.shields.io/npm/dt/@launch/styles.svg?style=flat-square) ![license](https://img.shields.io/github/license/launchjs/styles.svg?style=flat-square)

Adds CSS, Sass and LESS compilation to [Launch.js](https://github.com/launchjs/app) apps.

## Features

- Universal - works in the browser and via server-side rendering
- [PostCSS v6](http://postcss.org/) with [next-gen CSS](http://cssnext.io/) and [CSSNano](http://cssnano.co/)
- [SASS](http://sass-lang.com) and [LESS](http://lesscss.org/) support (also parsed through PostCSS)
- Automatic vendor prefixing - write modern CSS, and let the compiler take care of browser compatibility
- Mix and match SASS, LESS and regular CSS - without conflicts!
- CSS modules - your classes are hashed automatically, to avoid namespace clashes
- Compatible with Foundation, Bootstrap, Material and more. Simply configure via a `.global.(css|less|s(c|a)ss)` import to preserve class names
* Hot reloading + sourcemaps in development
- Creates a single `assets/css/styles.css` file (`assets/css/styles.[contenthash].css` in production)
* Easy referencing via SSR at `output.client.mainCss`

**TODO**

* Auto chunking, with async loading of imported chunks
* An easy way to reference which chunks were loaded via SSR, to include in the initial HTML render

## Quick start

Bootstrap Launch.js in the usual way, and add this preset as a plugin:

```ts
import App from "@launch/app";
import Styles from "@launch/styles";

void new App()
  .serverEntry("someServerEntry.tsx");
  .clientEntry("someClientEntry.tsx");
  .plugin(new Styles()) // <-- add the plugin here
  .launch()
```

In any of your app files, you can then import CSS/Sass/Less and use as normal:

```ts
// Assuming we're inside a file in/imported by the client/server entry
import css from "./someStyleFile.css";

console.log(css.headline); // <-- if there's a .headline class, it will show the localised class name

// Now we can use it wherever we like. In React, for example:
export default () => (
  <h1 className={css.headline}>This badboy will get styled</h1>
);
```

## What this preset does

It lets you handle stylesheet files universally. Specific details for each environment are below:

**In all environments:**

It compiles `.css`, `.s(c|a)ss` and `.less` files into a single file, which can be loaded via SSR by referencing the `output.client.mainCss` variable.

The compilation pipeline on the server is:

[sass-loader](https://github.com/webpack-contrib/sass-loader) (for `.s(c|a)ss`) or [less-loader](https://github.com/webpack-contrib/less-loader) (for `.less`) -> [PostCSS](http://postcss.org/) -> [css-loader](https://github.com/webpack-contrib/css-loader)

On the client, [Mini-CSS-Extract](https://github.com/webpack-contrib/mini-css-extract-plugin) is added to extract the resulting CSS into a file.

**In development:**

In dev mode, `assets/css/styles.css` will be generated with sourcemaps.

Changes made to underlying CSS/SASS/LESS files will be hot-reloaded in the browser, via [css-hot-loader](https://github.com/shepherdwind/css-hot-loader) (in development).

**In production:**

In production, `assets/css/styles.[contenthash].css` is generated. _[contenthash]_ is automatically replaced by Webpack to allow file versioning based on content.

Because the content hash changes whenever the file changes, avoid hard-coding the name of the file via SSR; instead, use `output.client.mainCss`, which will always contain the most recent compiled version.

## PostCSS options

By default, this preset uses [CSSNext](http://cssnext.io/) and [CSSNano](http://cssnano.co/) PostCSS plugins to enable 'future' CSS syntax and minification.

These defaults can be disabled/added to by using the `.postcss()` method mentioned further below.

## Customising

An instance of `Styles` contains methods for customising compilation. Use like so:

```ts
import App from "@launch/app";
import Styles from "@launch/styles";

void new App().plugin(
  new Styles()
    .postcss({  // <-- for example, customising PostCSS
      plugins() {
        return [
          require("somePostCSSPlugin")(),
        ];
      }
    }),
);
```

## Methods

### `postcss(options: IPostCSSConfig | boolean)`

Passing in `false` disables PostCSS compilation.

Passing in options replaces the defaults. `IPostCSSConfig` has this shape:

```ts
interface IPostCSSConfig {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  plugins?: any[] | ((loader: any) => any[]);
  sourceMap?: string | boolean;
}
``` 

## Gotchas

[Mini-CSS-Extract](https://github.com/webpack-contrib/mini-css-extract-plugin) doesn't play nicely with [style-loader](https://github.com/webpack-contrib/style-loader) at present, so [css-hot-loader](https://github.com/shepherdwind/css-hot-loader) was chosen instead.

One side-effect of that choice is that the resulting `style.css` file _must_ be included in the initial HTML loaded by the browser via SSR. Unlike style-loader, css-hot-loader doesn't 'inject' styles in the resulting Javascript bundle; it simply reloads any `.css` loaded into the DOM when its file changes.

Therefore, you must include a `<link rel="stylesheet" type="text/css" href="${output.client.mainCss}">` in your server-side render if you want hot-reloading to work properly.

## License

MIT