const { newEnforcer } = require("casbin");
const path = require("path");

const CONF_DIR = path.join(path.resolve(__dirname, '..'), 'conf');
const BASE_NAME = "rbac_with_resource_roles";

(async () => {
  const enforcer = await newEnforcer(
    `${CONF_DIR}/${BASE_NAME}_model.conf`,
    `${CONF_DIR}/${BASE_NAME}_policy.csv`
  );

  const subArr = ["alice", "bob", "john"]; // the user that wants to access a resource.
  const objArr = ["data1", "data2"]; // the resource that is going to be accessed.
  const actArr = ["read", "write"]; // the operation that the user performs on the resource.

  for (const sub of subArr) {
    for (const obj of objArr) {
        for (const act of actArr) {
            const result = await enforcer.enforce(sub, obj, act);
            console.info(
              `Checking with sub=${sub}, obj=${obj}, act=${act}, result=${result}`
            );
        }
    }
  }
})();
