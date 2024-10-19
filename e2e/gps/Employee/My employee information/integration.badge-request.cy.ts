import { getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
import "jquery";
//ENV : DV46
let results: any = {};
const GPConfig: IGPConfig = {
  id: "ASW0ESE0",
  menuPath: { topic: "My employee information", name: "Badge request" }
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

    it("should be able to redirect to badge request gp", () => {
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
        results = getValueFromData(data, fetchGpData.dataSearch);
      });
    });

    it("should verify user data", () => {
      cy.get(".subtitle-container")
        .contains("Employee")
        .should("be.visible");

      cy.getBySel("NMPRES")
        .should("be.visible")
        .should("have.value", results["NMPRES"]);
      cy.getBySel("MATCLE")
        .should("be.visible")
        .should("have.value", results["MATCLE"]);
      cy.get(".subtitle-container")
        .contains("Application for a transfer card")
        .should("be.visible");
      cy.getBySel("note-identityCardRenewal")
        .contains("Identification card renewal application")
        .should("be.visible");
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

    it("should delete the request", () => {
      cy.getBySel("requests-badge").click();
      cy.getBySel("search-box-text")
        .type(GPConfig.menuPath.name)
        .then(() => {
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include("Badge request");
            })
            .first()
            .click();
          cy.getBySel("data-submit")
            .contains("Cancel")
            .click();
        });
    });
  });
}
