// 🚀 Launch.js - Styles class

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import App, {
  ILaunchConfig,
  ILaunchPlugin,
} from "@launch/app";

import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Loader } from "webpack";

// ----------------------------------------------------------------------------

// Types
type ModuleSettings = [string, { modules: boolean }];

export interface IPostCSSConfig {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  plugins?: any[] | ((loader: any) => any[]);
  sourceMap?: string | boolean;
}

export interface IStylesConfig {
  postcss?: boolean | IPostCSSConfig;
}

export interface IRule {
  ext: string;
  use: Loader[];
}

/* HELPERS */

// Returns string RegEx and modules settings based on style file extension
function getExtensionSettings(ext: string): ModuleSettings[] {
  return [
    [`^(?!.*\\.global\\.${ext}$).*\\.${ext}$`, { modules: true }],
    [`\\.global\\.${ext}$`, { modules: false }],
  ];
}

// Rules configuration for each style file extension
const rules: IRule[] = [
  {
    ext: "css",
    use: [],
  },
  {
    ext: "s(c|a)ss",
    use: [
      "resolve-url-loader",
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    ext: "less",
    use: ["less-loader"],
  },
];

// Cache configuration
const cache = new WeakMap<Styles, IStylesConfig>();

export default class Styles implements ILaunchPlugin {

  // --------------------------------------------------------------------------
  /* PUBLIC METHODS */
  // --------------------------------------------------------------------------

  /* CONSTRUCTOR */
  public constructor() {
    cache.set(this, {
      postcss: {
        plugins() {
          return [
            require("postcss-nested")(),
            require("postcss-cssnext")({
              features: {
                autoprefixer: false,
              },
            }),
            require("cssnano")({
              preset: "advanced",
            }),
          ];
        },
      },
    });
  }

  /* OPTIONS */
  public postcss(opt: boolean | IPostCSSConfig): this {
    cache.get(this)!.postcss = opt;

    return this;
  }

  /* LAUNCH.JS */
  public initLaunchJs(config: ILaunchConfig, app: App): ILaunchConfig {
    const c = cache.get(this)!;

    // Create generator to get rules
    function *generateRules(isClient = true) {

      // Source maps depend on us being in development
      const sourceMap = !app.config.production;

      for (const loader of rules) {
        // Iterate over CSS/SASS/LESS and yield local and global mod configs
        for (const [test, modules] of getExtensionSettings(loader.ext)) {

          // Build the use rules
          const use = [
            // CSS hot loading on the client, in development
            (isClient && !app.config.production) && "css-hot-loader",

            // Add MiniCSS if we're on the client
            isClient && MiniCssExtractPlugin.loader,

            // Set-up `css-loader`
            {
              // If we're on the server, we only want to output the name
              loader: isClient ? "css-loader" : "css-loader/locals",

              options: {
                // Calculate how many loaders follow this one
                importLoaders: loader.use.length + (c.postcss ? 1 : 0),

                // Format for 'localised' CSS modules
                localIdentName: "[local]-[hash:base64]",

                // No need to minimize-- CSSNano already did it for us
                minimize: false,

                // Specify whether this is a global or local module
                modules,

                // Add sourcemaps if we're in dev
                sourceMap,
              },
            },

            // Add PostCSS if we need it
            c.postcss && {
              loader: "postcss-loader",
              options: {
                // Pass in the PostCSS options
                ...c.postcss as object,

                ident: "postcss",

                // Enable sourcemaps in development
                sourceMap,
              },
            },

            // Copy over the loader's specific rules
            ...loader.use,
          ];

          // Yield the full rule
          yield {
            test: new RegExp(test),

            // Remove all falsy values
            use: use.filter(l => l) as Loader[],
          };
        }
      }
    }

    // Set-up the client config
    config.client.merge({

      // Use `MiniCssExtractPlugin` in both dev and production, because
      // the server will need access to it in its initial render
      module: {
        rules: [...generateRules()],
      },

      // The client bundle will be responsible for building the resulting
      // CSS file; ensure compilation is dumped into a single chunk
      optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              chunks: "all",
              enforce: true,
              name: "main",
              test: new RegExp(
                `\\.${rules.map(rule => `(${rule.ext})`).join("|")}$`,
              ),
            },
          },
        },
      },

      // Add `MiniCssExtractPlugin`
      plugins: [
        new MiniCssExtractPlugin({
          chunkFilename: "assets/css/[id].css",
          filename: `assets/css/[name]${app.config.production ? ".[contenthash]" : ""}.css`,
        }),
      ],
    });

    // Add the server config
    config.server.merge({
      module: {
        rules: [...generateRules(false)],
      },
    });

    return config;
  }
}
