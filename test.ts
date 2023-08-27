import Freebox from "./src";

const test = new Freebox({
  app_id: "test",
  app_name: "test",
  app_version: "0.0.1",
  device_name: "test",
});

test.login();