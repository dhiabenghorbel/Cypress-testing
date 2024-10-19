import { cyConf, envsAndUsers } from "./envsAndUsers";

const env = envsAndUsers[cyConf.env];
const user = env.users[cyConf.user];

const cyconstants = {
  username: user.username,
  password: user.password,
  language: "en",
  loginModule: "standardLoginModule",
  CYPRESS_API_BASE_URL: `${env.url}/hr-business-services-rest/business-services`,
  CYPRESS_HRASPACE_URL: `${env.HRSpaceUrl}`,
  employeeRole: user.roles.employeeRole,
  managerRole: user.roles.managerRole,
  managerRoleApprover: user.roles.managerRoleApprover ? user.roles.managerRoleApprover : undefined
};

export default cyconstants;
