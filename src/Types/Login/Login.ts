/**
 * @link https://dev.freebox.fr/sdk/os/login/ "Request authorization response"
 */
interface Authorization {
  success: boolean;
  result: {
    app_token: string;
    track_id: string;
  };
}

interface CheckAuthorization {
  success: boolean;
  result: {
    status: string | LoginStatus;
    challenge: string;
  };
}

/**
 * @link https://dev.freebox.fr/sdk/os/login/ "Request authorization"
 */
interface App {
  app_id: string;
  app_name: string;
  app_version: string | number;
  device_name: string;

  app_token?: string;
  track_id?: string;

  status?: string;
  logged_in?: LoginStatus | boolean;

  challenge?: string | null;
  password?: string | null;
  session_token?: string | null;

  permissions?: {} /* TODO */;
}

interface SessionResponse {
  success: boolean;
  result: {
    challenge: string;
    session_token: string;
    permissions: {} /* TODO */;
  };
}

/**
 * @link https://dev.freebox.fr/sdk/os/login/ "Track authorization progress"
 */
enum LoginStatus {
  unknown = "the app_token is invalid or has been revoked",
  pending = "the user has not confirmed the authorization request yet",
  timeout = "the user did not confirmed the authorization within the given time",
  granted = "the app_token is valid and can be used to open a session",
  denied = "the user denied the authorization request",
}

export {
  type CheckAuthorization,
  type Authorization,
  type App,
  type SessionResponse,
};
