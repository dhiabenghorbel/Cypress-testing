import { asArray } from "../../src/app/infrastructure/processing/general/asArray";
import cyconstants from "./cyconstants";
import { getLengthFromData, getRolesFromLogin, getValueFromData } from "./functions";

// support/commands.ts

Cypress.Commands.add("checkCount", { prevSubject: true }, (subject, count) => {
  if (count) {
    cy.wrap(subject)
      .find(".badge-button .badge-number")
      .should("be.visible")
      .invoke("text")
      .should("eq", count.toString());
  }
});

Cypress.Commands.add("login", () => {
  const { username, password, language } = cyconstants;

  const loginPath = "/login";
  const log = Cypress.log({
    name: "login",
    displayName: "LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false
  });
  cy.location("pathname", { log: false }).then(currentPath => {
    if (currentPath !== loginPath) {
      cy.visit(loginPath);
    }
  });
  log.snapshot("before");

  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/login`, method: "POST" }).as("rolesList");
  cy.getBySel("user\\.login").type(username);
  cy.getBySel("user\\.password").type(password);
  cy.getBySel("language").select(language);
  // Click the login button
  cy.getBySel("button\\.connexion")
    .click()
    .then(() => {
      cy.url().should("include", Cypress.config("baseUrl"));
    });

  cy.wait("@rolesList").then(({ response: { body } }: any) => {
    const rolesList = body.roles && body.roles.role;
    const userDescription = body.userDescription;
    const roles = getRolesFromLogin(asArray(rolesList));
    const result = {
      userDescription,
      roles
    };
    return result;
  });
});

Cypress.Commands.add("changePassword", (username, password, newPassword, newPasswordConfirm, language, LoginModule = "standardLoginModule") => {
  const changePassPath = "/change-password";
  const changePassApiUrl = `${cyconstants.CYPRESS_API_BASE_URL}/login`;
  const log = Cypress.log({
    name: "login",
    displayName: "LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false
  });

  cy.intercept("POST", changePassApiUrl).as("changePassAndLogin");

  cy.location("pathname", { log: false }).then(currentPath => {
    if (currentPath !== changePassPath) {
      cy.visit(changePassPath);
    }
  });

  log.snapshot("before");

  cy.getBySel("user\\.login")
    .clear()
    .type(username);
  cy.getBySel("user\\.password")
    .clear()
    .type(password);
  cy.getBySel("user\\.new-password")
    .clear()
    .type(newPassword);
  cy.getBySel("user\\.password-confirmation")
    .clear()
    .type(newPasswordConfirm);
  cy.getBySel("language").select(language);
  cy.getBySel("button\\.send").click();
});

Cypress.Commands.add(
  "csvToArr",
  { prevSubject: false },
  (fixtureName: string, splitter: string): Cypress.Chainable<any[]> => {
    return cy.fixture(fixtureName).then((fileContent: string) => {
      const lines = fileContent.trim().split("\n");
      const keys = lines[0].split(splitter);
      const formedArr = lines.slice(1).map(line => {
        line = line.replace(new RegExp("\r"), "");
        const values = line.split(splitter);
        const object: any = {};
        keys.forEach((key, index) => {
          const keyy = key.trim();
          return (object[keyy] = values[index]);
        });
        return object;
      });

      return Cypress.Promise.resolve(formedArr);
    });
  }
);

//Test pagination functionalities, testing to ensure proper pagination behavior.
Cypress.Commands.add("paginationTest", () => {
  cy.getBySel("table-pagination").should("be.visible");
  cy.getBySel("rows-per-page").should("be.visible");
  cy.get(".select-input").should("be.visible");
  cy.get("option").then($options => {
    let optionsCount = $options.length;
    for (let i = 5; i <= 5 * optionsCount; i += 5) {
      cy.get(".select-input").select(`${i}`);
    }
    cy.get(".select-input").select("5");
    cy.getBySel("pagination-switches").should("be.visible");
    for (let i = 1; i <= optionsCount; i++) {
      cy.getBySel("table-pagination-page").should("have.text", `${i}/${optionsCount}`);
      if (i !== optionsCount) {
        cy.getBySel("dms-table-chevron-right").click();
      }
    }
  });
});

Cypress.Commands.add("checkTableData", tableData => {
  if (tableData && tableData.length > 0) {
    cy.get(".table-row").should("be.visible");
    cy.getBySel("table-headers").should("be.visible");
    cy.getBySel("table-body").should("be.visible");
    const length = getLengthFromData(tableData);
    cy.getBySel("records-length")
      .invoke("text")
      .should("eq", length);
  } else {
    cy.get("div.card-body")
      .find("div")
      .should("be.visible")
      .then($div => {
        const text = $div.text();
        expect(text.includes("No elements") || text.includes("No documents")).to.be.true;
      });
  }
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test-id=${selector}]`, ...args);
});

Cypress.Commands.add("getByDataForm", (selector, ...args) => {
  return cy.get(`[data-form=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test-id*=${selector}]`, ...args);
});

Cypress.Commands.add("getByVal", (selector, ...args) => {
  return cy.get(`[value=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelFromForm", (formId, selector, ...args) => {
  return cy.get(`div[data-form=${formId}] [data-test-id=${selector}]`, ...args);
});

Cypress.Commands.add("getRecordsFromTable", (dataSection, ...args) => {
  return cy.get(`div[data-test-id=${dataSection}] [data-test-id="records-length"]`, ...args);
});

Cypress.Commands.add("getBlobnameFromDataSection", (dataSection, ...args) => {
  return cy.get(`div[data-test-id=${dataSection}] [data-test-id="file-blob-name"]`, ...args);
});

Cypress.Commands.add("searchDataFromTable", (data, index) => {
  const lineToSearch = data[0][index];
  cy.getBySel("search-box-text")
    .type(lineToSearch)
    .then(() => {
      cy.getBySel("paginated-table-row")
        .should("be.visible")
        .then($lines => {
          const linesValues = Array.from($lines).map(line => {
            return line.innerText.trim();
          });
          expect(linesValues[0]).to.include(lineToSearch.trim().replace(/\s+/g, " "));
        });
    });
});

Cypress.Commands.add("findRowInTable", value => {
  return cy.getBySel("paginated-table-row").filter((index, row) => {
    return Cypress.$(row)
      .find(".table-cell")
      .text()
      .includes(value);
  });
});

Cypress.Commands.add("selectValueFromCodelist", (codelistField, modalInputField, value) => {
  cy.getBySel(codelistField)
    .should("be.visible")
    .click();
  cy.getBySel("codelist-modal").within(() => {
    if (modalInputField && value) {
      cy.getBySel(modalInputField)
        .should("be.visible")
        .type(value);
      cy.getBySel("search-button")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.getBySel("paginated-table-row").eq(0);
      cy.contains(".table-cell", value)
        .should("be.visible")
        .click();
    } else if (value) {
      cy.findRowInTable(value)
        .should("be.visible")
        .click();
    } else {
      cy.getBySel("paginated-table-row")
        .eq(0)
        .should("be.visible")
        .click();
    }
  });

  let isModalOpened = false;

  cy.get("body").then($body => {
    if ($body.find(".modal").length > 0) {
      isModalOpened = true;
    }
  });

  cy.window()
    .its("modifiedDataContext")
    .then(context => {
      const modifiedData = context.state.modifiedData;
      const modalChanges = context.state.modalChanges;
      const nameExt = `${codelistField}_EXT`;
      let extValue;
      if (isModalOpened) {
        extValue = getValueFromData(modalChanges, [{ dataItem: { name: nameExt } }], true);
      } else {
        extValue = getValueFromData(modifiedData, [{ dataItem: { name: nameExt } }], true);
      }

      cy.getBySel(nameExt)
        .should("be.visible")
        .should("have.value", extValue[nameExt]);
    });
});
