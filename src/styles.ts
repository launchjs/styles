// 🚀 Launch.js - Styles class

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import App, {
  ILaunchConfig,
  ILaunchPlugin,
} from "@launch/app";

// ----------------------------------------------------------------------------

// Types
type ModuleSettings = [string, { modules: boolean }];

/* HELPERS */

// Returns string RegEx and modules settings based on style file extension
function getExtensionSettings(ext: string): ModuleSettings[] {
  return [
    [`^(?!.*\\.global\\.${ext}$).*\\.${ext}$`, { modules: true }],
    [`\\.global\\.${ext}$`, { modules: false }],
  ];
}

// Rules configuration for each style file extension
const rules = [
  {
    ext: "css",
    use: [],
  },
  {
    ext: "s(c|a)ss",
    use: [
      {
        loader: "resolve-url-loader",
      },
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

// Defaults to use with `css-loader` in all environments
const cssLoaderDefaults = {
  // No need to minimize-- CSSNano already did it for us
  minimize: false,

  // Format for 'localised' CSS modules
  localIdentName: "[local]-[hash:base64]",

  // Retain the loader pipeline
  importLoaders: 1,
};

function* generateDevRules() {
  for (const loader of rules) {
    // Iterate over CSS/SASS/LESS and yield local and global mod configs
    for (const mod of getExtensionSettings(loader.ext)) {
      yield {
        test: new RegExp(mod[0]),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            query: Object.assign({}, cssLoaderDefaults, {
              // Use sourcemaps in development
              sourceMap: true,
            }, mod[1]),
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            },
          },
          ...loader.use,
        ],
      };
    }
  }
}

export default class Styles implements ILaunchPlugin {
  public getLaunchConfig(config: ILaunchConfig, app: App) {

    if (app.config.production) {

      /* PRODUCTION */

    } else {

      /* DEVELOPMENT */
      config.client.merge(
        {
          module: {
            rules: [...generateDevRules()],
          },
        },
      );
    }

    return config;
  }
}
