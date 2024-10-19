import "jquery";
import { IGPConfig } from "../../../../support/interfaces";
import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData } from "../../../../support/functions";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASW00IE0",
  menuPath: { topic: "My employee information", name: "My bank details" }
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

    it("should open update My employee information and redirect to My bank details gp", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.wait(2000);
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const length = getLengthFromData(data, "ZY0I");
        cy.getRecordsFromTable("ZY0I")
          .invoke("text")
          .should("eq", length);
      });
    });

    it("should add a bank account", () => {
      cy.get(".subtitle-container")
        .contains("Bank accounts")
        .should("be.visible");
      cy.getBySel("add-button")
        .should("be.visible")
        .click();
      cy.wait(2000);

      cy.getBySel("LIBBEN")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LIBBEN"]);
      cy.getBySel("CDPAYS")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["CDPAYS"]).click();
      cy.get(".date-box[data-test-id='DATDEB'] input")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DATDEB"]);
      cy.get(".date-box[data-test-id='DATFIN'] input")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DATFIN"]);
      cy.getBySel("LIBBAN")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LIBBAN"]);

      cy.getBySel("data-submit")
        .should("be.visible")
        .contains("Add")
        .click();
    });

    it("should type a comment and submit the request", () => {
      cy.get(".subtitle-container")
        .contains("Comment of the requester")
        .should("be.visible");
      cy.getBySel("TXCOMM")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);
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
