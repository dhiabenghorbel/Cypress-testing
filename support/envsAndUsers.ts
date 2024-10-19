export const cyConf = {
  env: "DV46",
  user: "MBKF"
};

export const envsAndUsers: any = {
  DV46: {
    url: "http://localhost:8181/http://dlnxhradev01.ptx.fr.sopra:28546",
    HRSpaceUrl: "http://dlnxhradev01.ptx.fr.sopra:20546",
    users: {
      MBKF: {
        username: "MBKF",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(ATRSALTT03)",
          managerRole: "MMGRHIE(000000000INT001)"
        }
      },
      OKHIARIF: {
        username: "OKHIARIF",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(CNACERADR01)",
          managerRole: "MMGRHIE(000000000CERCON01)"
        }
      }
    }
  },
  MT22: {
    url: "http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522",
    HRSpaceUrl: "http://dlnxhradev02.ptx.fr.sopra:30522",
    users: {
      GPUMCO2: {
        username: "GPUMCO2",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(ATRGP4U0000)",
          managerRole: "MMGRHIE(000000000GP4U-001)"
        }
      },
      GPUMCO1: {
        username: "GPUMCO1",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(ATRGP4U0002)",
          managerRole: "MMGRHIE(000000000GP4U-002)",
          managerRoleApprover: "MMGRHIE(000000000GP4U-001)"
        }
      },
      GP4UMIN1: {
        username: "GP4UMIN1",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(ATRATS26)",
          managerRole: "MMGRHIE(000000000INT116)"
        }
      },
      GP4UEIN3: {
        username: "GP4UEIN3",
        password: "HR",
        roles: {
          employeeRole: "EMPLOYEE(ATRATS422613)"
        }
      }
    }
  }
};
