import coreConfig from "./core.config";
import viewConfig from "./view.config";

export default () => {
  return [...coreConfig, ...viewConfig];
};
