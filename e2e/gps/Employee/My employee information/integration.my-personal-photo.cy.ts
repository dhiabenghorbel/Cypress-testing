import "jquery";
import { uploadFile } from "../../../../support/functions";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";

//ENV : DV46 - MT22
const GPConfig: IGPConfig = {
  id: "ASW000E0",
  menuPath: { topic: "My employee information", name: "My personal photo" }
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

    it("should open update My employee information and redirect to My personal photo gp", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");
    });

    it("should add an image", () => {
      uploadFile("BLOB01", fetchGpData.dataToTypeEmployee["BLOB01"]).then(() => {
        cy.wait(2000);
      });
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
    });

    it("should go to the request and check data", () => {
      cy.getBySel("go-to-request").should("be.visible");
      cy.getBySel("go-to-request")
        .click()
        .then(() => {
          cy.url().should("include", GPConfig.id);
        });
      cy.get('[data-test-id="BLOB01"]').should("have.attr", "filename", fetchGpData.dataToTypeEmployee["BLOB01"]);
      cy.getBySel("TXCOMM").should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);
    });
  });
}
