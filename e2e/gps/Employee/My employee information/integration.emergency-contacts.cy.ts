import "jquery";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASW0PPE0",
  menuPath: { topic: "My employee information", name: "Emergency contacts" }
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

    it("should open update My employee information and redirect to emergency contacts gp", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains("My employee information")
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");
    });

    it("should add an emergency contact", () => {
      cy.get(".subtitle-container")
        .contains(GPConfig.menuPath.name)
        .should("be.visible");
      cy.getBySel("add-button")
        .should("be.visible")
        .click();
      cy.wait(2000);

      cy.getBySel("QUALIT")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["QUALIT"]).click();
      cy.getBySel("NOMPPP")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["NOMPPP"]);
      cy.getBySel("PRENOM")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["PRENOM"]);
      cy.getBySel("NUMORD")
        .should("be.visible")
        .select(fetchGpData.dataToTypeEmployee["NUMORD"]);
      cy.getBySel("TYPPER")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["TYPPER"]).click();
      cy.getBySel("TELPHO")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["TELPHO"]);
      cy.getBySel("NBPALT")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["NBPALT"]);
      cy.getBySel("EMAILS")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["EMAILS"]);
      cy.getBySel("ADREPP")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["ADREPP"]);
      cy.getBySel("COMPLE")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["COMPLE"]);
      cy.getBySel("ADZIPB")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["ADZIPB"]);
      cy.getBySel("BURDPP")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["BURDPP"]);
      cy.getBySel("ADCNTR")
        .scrollIntoView()
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["ADCNTR"]).click();

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

    it("should delete the request", () => {
      cy.wait(3000);
      cy.getBySel("data-submit")
        .contains("Cancel")
        .click();

      cy.getBySel("snackbar-toast").should("have.text", "Canceled");
    });
  });
}
