import { getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
import "jquery";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASW018E0",
  menuPath: { topic: "My employee information", name: "My name & marital status" }
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
    it("should redirect to my name & marital status gp and be able to verify and update employee information", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains("My employee information")
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains("My name & marital status")
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains("My name & marital status")
        .should("be.visible");
      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.get(".subtitle-container")
          .contains("Employee information")
          .should("be.visible");

        cy.getBySel("QUALIT").click();
        cy.contains(results["QUALIT_EXT"]).click();
        cy.getBySel("NOMUSE")
          .should("be.visible")
          .should("have.value", results["NOMUSE"]);
        cy.getBySel("PRENOM")
          .should("be.visible")
          .should("have.value", results["PRENOM"]);
        cy.getBySel("PRENO2")
          .should("be.visible")
          .should("have.value", results["PRENO2"])
          .type("test prenom 2");
        cy.getBySel("NOMPAT")
          .should("be.visible")
          .should("have.value", results["NOMPAT"])
          .type("test birth name");
      });
    });

    it("should add a family situation", () => {
      cy.get(".subtitle-container")
        .contains("Family situation")
        .should("be.visible");

      cy.getBySel("add-button")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.getBySel("SITFAM").click();
      cy.get("li")
        .contains(fetchGpData.dataToTypeEmployee["SITFAM"])
        .click();
      cy.get(".date-box[data-test-id='DATSIT'] input")
        .click()
        .type(fetchGpData.dataToTypeEmployee["DATSIT"]);
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
