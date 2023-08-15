const { newEnforcer } = require("casbin");
const path = require("path");

const CONF_DIR = path.join(path.resolve(__dirname, '..'), 'conf');
const BASE_NAME = "rbac_with_domains";

(async () => {
  const enforcer = await newEnforcer(
    `${CONF_DIR}/${BASE_NAME}_model.conf`,
    `${CONF_DIR}/${BASE_NAME}_policy.csv`
  );

  // Super admin can be declared in 2 forms:
  // - either "root"
  // - or "sudo" which is belonging to "admin" group of both ["domain1", "domain2"]
  const subArr = ["alice", "bob", "sudo", "root"]; // the user that wants to access a resource.
  const domArr = [
    { key: "domain1", value: ["data1"] },
    { key: "domain2", value: ["data2"] },
  ]; // the domain that is going to be accessed.
  const actArr = ["read", "write"]; // the operation that the user performs on the resource.

  for (const sub of subArr) {
    for (const dom of domArr) {
      console.info(`[${dom.key}]`);
      for (const obj of dom.value) {
          for (const act of actArr) {
              const result = await enforcer.enforce(sub, dom.key, obj, act);
              console.info(
                `  - Checking with sub=${sub}, obj=${obj}, act=${act}, result=${result}`
              );
          }
      }
    }
  }
})();
