// 🚀 Launch.js - src/styles.ts tests

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import App, { Config, ILaunchConfig } from "@launch/app";

/* Local */
import Styles from "../src/styles";

// ----------------------------------------------------------------------------

// Types
type ConfigLoader = (app: App) => Config;

const clientWebpack: ConfigLoader = require("@launch/app/dist/src/webpack/client").default;
const serverWebpack: ConfigLoader = require("@launch/app/dist/src/webpack/server").default;

function getBaseConfig(app: App): ILaunchConfig {
  return {
    client: clientWebpack(app),
    server: serverWebpack(app),
  };
}

describe("src/styles.ts", () => {

  test("should get dev styles", async () => {
    const app = new App().production(false);
    const styles = new Styles();

    const baseConfig = getBaseConfig(app);
    const config = styles.getLaunchConfig(baseConfig, app);

    expect(config.client.config.module.rules.length).toBeGreaterThan(6);
  });
});
