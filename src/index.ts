import fetch from "node-fetch";
import Logger from "typescript-logger";
import {
  App,
  Authorization,
  CheckAuthorization,
  SessionResponse,
} from "./Types/Login/Login";
import { HmacSHA1 } from "crypto-js";
import { Configuration } from "./Types/Configuration";
import { RDDResponse } from "./Types/RDD";

const defaultApp: App = {
  app_id: "FreeboxOS-NodeJS",
  app_name: "FreeboxOS NodeJS",
  app_version: "0.0.1",
  device_name: "node",

  app_token: "",
  track_id: "",

  status: "",
  logged_in: false,

  challenge: null,
  password: null,
  session_token: null,

  permissions: {},
};

class Freebox {
  private _configuration?: Configuration;
  private _app: App;
  private log: Logger.Logger;

  constructor(app: App, config?: Configuration) {
    this._app = app || defaultApp;
    this._configuration = config;
    this.log = Logger.LoggerManager.create("FreeboxMain", "red");

    if (!this._app.app_id) {
      throw new Error("app_id must be defined in the app object");
    } else if (!this._app.app_name) {
      throw new Error("app_name must be defined in the app object");
    } else if (!this._app.app_version) {
      throw new Error("app_version must be defined in the app object");
    } else if (!this._app.device_name) {
      throw new Error("device_name must be defined in the app object");
    }
  }

  async login() {
    if (this._configuration?.baseUrl) {
      const resultApiBaseUrl = await fetch(
        "http://mafreebox.freebox.fr/api_version"
      )
        .then((res) => res.json())
        .then((json) => {
          return json as any;
        });
      const parsedRes = JSON.parse(resultApiBaseUrl.data);
      this._configuration.baseUrl = `https://${parsedRes.api_domain}:${parsedRes.https_port}/api/v${parsedRes.api_version}`;
      this.log.debug(
        `API Base URL for ${parsedRes.device_name} : ${this._configuration.baseUrl}`
      );
    }

    const requestAuthorization = await fetch(
      `${this._configuration?.baseUrl}/login/authorize/`,
      {
        method: "POST",
        body: JSON.stringify({
          app_id: this._app.app_id,
          app_name: this._app.app_name,
          app_version: this._app.app_version,
          device_name: this._app.device_name,
        }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return JSON.parse(json as any) as Authorization;
      });

    while (!requestAuthorization.success) {
      this.log.info(
        `Please accept the authorization request on your Freebox Server with token : ${requestAuthorization.result.app_token}`
      );

      const checkAuthorization = await fetch(
        `${this._configuration?.baseUrl}/login/authorize/${requestAuthorization.result.track_id}`
      )
        .then((res) => res.json())
        .then((json) => {
          return JSON.parse(json as any) as CheckAuthorization;
        });

      switch (checkAuthorization.result.status) {
        case "unknown":
          this.log.error("the app_token is invalid or has been revoked");
          break;
        case "pending":
          this.log.info(
            "the user has not confirmed the authorization request yet"
          );
          break;
        case "timeout":
          this.log.error(
            "the user did not confirmed the authorization within the given time"
          );
          break;
        case "granted":
          this.log.info(
            "the app_token is valid and can be used to open a session"
          );
          break;
        case "denied":
          this.log.error("the user denied the authorization request");
          break;
        default:
          this.log.error("Unknown error");
          break;
      }

      setTimeout(() => {}, 1000);
    }

    this._app.app_token = requestAuthorization.result.app_token;

    const sessionsChallenge = await fetch(
      `${this._configuration?.baseUrl}/login/`
    )
      .then((res) => res.json())
      .then((json) => {
        return JSON.parse(json as any) as CheckAuthorization;
      });

    this._app.challenge = sessionsChallenge.result.challenge;

    const SessionStart = {
      app_id: this._app.app_id,
      app_version: this._app.app_version,
      password: HmacSHA1(
        this._app.app_token,
        this._app.challenge as string
      ).toString(),
    };

    this._app.password = SessionStart.password;

    const challenge = await fetch(
      `${this._configuration?.baseUrl}/login/session`,
      {
        method: "POST",
        body: JSON.stringify({
          app_id: this._app.app_id,
          password: this._app.password,
        }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return JSON.parse(json as any) as SessionResponse;
      });

    this._app.session_token = challenge.result.session_token;
  }

  logout() {
    fetch(`${this._configuration?.baseUrl}/login/logout/`, {
      method: "POST",
      body: JSON.stringify({
        app_id: this._app.app_id,
        session_token: this._app.session_token,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        return JSON.parse(json as any) as { success: boolean };
      });

    // TODO: Reset app object
  }

  async rrd() {
    const rrd = await fetch(`${this._configuration?.baseUrl}/rrd/`)
      .then((res) => res.json())
      .then((json) => {
        return JSON.parse(json as any) as RDDResponse;
      });

    return rrd;
  }
}

export default Freebox;
