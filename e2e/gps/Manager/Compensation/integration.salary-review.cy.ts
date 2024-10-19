import { getLengthFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : MT22
let roles: any = [];
let length: any;
const GPConfig: IGPConfig = {
  id: "ASC647M1",
  menuPath: { topic: "Compensation", name: "Salary review" }
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
    cy.login().then(res => {
      roles = res.roles;
    });
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should switch to the manager role and redirect to Salary review gp", () => {
      cy.getBySel("role-button")
        .should("be.visible")
        .click();

      cy.getBySel("roles-list-search-input")
        .should("be.visible")
        .type(roles.managerRoleLabel)
        .then(() => {
          cy.getBySel("roles-list-with-search")
            .should("be.visible")
            .find("li")
            .click();
        });
      cy.wait(2000);
    });

    it("Should verify Enter salary proposals data", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.wait(2000);
      cy.wait(`@${GPConfig.id}`, { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        length = getLengthFromData(data, "ZE47");

        cy.get(".subtitle-container")
          .contains("Enter salary proposals")
          .should("be.visible");

        cy.getBySel("enter-proposals")
          .should("be.visible")
          .invoke("text")
          .should("eq", "Click on any campaign below to enter the proposals for employees on your team.");

        cy.getBySel("paginated-table-row")
          .eq(0)
          .should("be.visible");

        cy.getRecordsFromTable("ZE47")
          .eq(0)
          .invoke("text")
          .should("eq", length);

        cy.getBySel("paginated-table-row")
          .eq(0)
          .click()
          .then(() => {
            cy.url().should("include", "/ASD640MT");
          });
      });
    });

    it("Should verify Consult proposals data", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();

      cy.get(".subtitle-container", { timeout: 20000 })
        .contains("Consult proposals")
        .should("be.visible");

      cy.getBySel("consult-proposals")
        .should("be.visible")
        .invoke("text")
        .should("eq", "Click on any campaign below to consult the proposals of your subordinates.");

      cy.getBySel("paginated-table-row")
        .eq(1)
        .should("be.visible");

      cy.getRecordsFromTable("ZE47")
        .eq(1)
        .invoke("text")
        .should("eq", length);

      cy.getBySel("paginated-table-row")
        .eq(1)
        .click()
        .then(() => {
          cy.url().should("include", "/ASC640M2");
        });
    });
  });
}
