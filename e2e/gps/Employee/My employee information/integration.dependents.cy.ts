import "jquery";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASW0E5E0",
  menuPath: { topic: "My employee information", name: "Dependents" }
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
    cy.login();
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should open update My employee information and redirect to Dependents gp", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains("My employee information")
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains("Dependents")
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains("Dependents")
        .should("be.visible");
    });

    it("should add a dependent", () => {
      cy.get(".subtitle-container")
        .contains("Dependent list")
        .should("be.visible");
      cy.getBySel("add-button")
        .should("be.visible")
        .click();
      cy.wait(2000);

      cy.getBySel("NOMPAR").type(fetchGpData.dataToTypeEmployee["NOMPAR"]);
      cy.getBySel("PREENF").type(fetchGpData.dataToTypeEmployee["PREENF"]);
      cy.getBySel("SEXENF").click();
      cy.get("li")
        .contains("Male")
        .click();
      cy.get(".date-box[data-test-id='NAIENF'] input").type(fetchGpData.dataToTypeEmployee["NAIENF"]);
      cy.getBySel("TYPPAR").select(fetchGpData.dataToTypeEmployee["TYPPAR"]);
      cy.getBySel("data-submit")
        .contains("Add")
        .click();
    });

    it("should type a comment and submit the request", () => {
      cy.get(".subtitle-container")
        .contains("Comment of the requester")
        .should("be.visible");
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
          cy.url().should("include", GPConfig.id);
        });
    });

    it("should be able to cancel the request from cancel absence request gp", () => {
      cy.getBySel("requests-badge").click();
      cy.getBySel("search-box-text")
        .type(GPConfig.menuPath.name)
        .then(() => {
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(GPConfig.menuPath.name);
            })
            .click();
        });
      cy.wait(3000);
      cy.getBySel("data-submit")
        .contains("Cancel")
        .click();
      cy.getBySel("snackbar-toast").should("have.text", "Canceled");
    });
  });
}
