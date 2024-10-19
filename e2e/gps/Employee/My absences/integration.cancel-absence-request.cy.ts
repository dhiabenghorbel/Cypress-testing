import "jquery";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { getLengthFromData } from "../../../../support/functions";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : MT22
let roles: any = [];
let userDescription: any = [];

const GPConfig: IGPConfig = {
  id: "ASW0AGE1",
  menuPath: { topic: "My absences", name: "Cancel absence request" }
};
const fetchGpData = dataMapping[cyConf.env][cyConf.user][GPConfig.id];

if (fetchGpData === undefined) {
  it("Should log an error message for an invalid environment configuration", () => {
    cy.log("Integration testing cannot proceed due to an invalid environment configuration. Please verify the environment settings.");
    cy.skipOn(true);
  });
} else {
  before(() => {
    cy.clearCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    cy.visit("/login");

    cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/login`, method: "POST" }).as("rolesList");

    cy.login().then(res => {
      roles = res.roles;
      userDescription = res.userDescription;
    });
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should cancel the request and switch to manager role to validate the request", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);

      cy.getBySel("role-button")
        .should("be.visible")
        .click();
      cy.getBySel("roles-list-search-input")
        .should("be.visible")
        .type(roles.employeeRoleLabel)
        .then(() => {
          cy.getBySel("roles-list-with-search")
            .should("be.visible")
            .find("li")
            .click();
        });
      cy.wait(2000);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.get(".subtitle-container")
        .contains("Cancel absence")
        .should("be.visible");
      cy.wait(`@${GPConfig.id}`, { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        length = getLengthFromData(data, "ZYAG");
        cy.getBySel("records-length")
          .invoke("text")
          .should("contain", length);
        if (length > 0) {
          cy.get(".row-button").click();

          cy.getBySel("TXCOMM").type(fetchGpData.dataToTypeEmployee["TXCOMM"]);
          cy.getBySel("data-submit")
            .contains("Submit")
            .click();
          cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
          cy.getBySel("gp-submitted-with-success").should("be.visible");
          cy.getBySel("go-to-request").should("be.visible");
          cy.getBySel("go-to-request")
            .click()
            .then(() => {
              cy.url().should("include", "/ASW0AGE1");
            });

          cy.getBySel("role-button")
            .should("be.visible")
            .click();
          cy.getBySel("roles-list-search-input")
            .should("be.visible")
            .type(roles.managerRoleApproverLabel)
            .then(() => {
              cy.getBySel("roles-list-with-search")
                .should("be.visible")
                .find("li")
                .click();
            });
          cy.wait(2000);
          cy.getBySel("tasks-badge").click();
          cy.getBySel("search-box-text")
            .type(fetchGpData.dataToTypeManager["DATFIN"])
            .then(() => {
              cy.getBySel("paginated-table-row")
                .should("be.visible")
                .then($lines => {
                  const linesValues = Array.from($lines).map(line => line.innerText.trim());
                  expect(linesValues[0]).to.include(fetchGpData.dataToTypeManager["DATFIN"]);
                })
                .click();
            });
          cy.wait(3000);

          cy.get(".subtitle-container")
            .contains("Approval")
            .scrollIntoView()
            .should("be.visible");

          cy.getBySel("STATUX")
            .should("be.visible")
            .should("be.visible")
            .select("Approved");

          cy.getBySelFromForm("ANTWT103", "TXCOMM").type(fetchGpData.dataToTypeManager["TXCOMM"]);
          cy.getBySel("data-submit")
            .contains("Submit")
            .click();
          cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        }
      });
    });
  });
}
