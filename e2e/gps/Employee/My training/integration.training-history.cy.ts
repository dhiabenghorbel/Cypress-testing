import { IGPConfig } from "../../../../support/interfaces";
import { formatDateSpain, minutesToTime } from "../../../../../src/app/infrastructure/processing/general/time";
import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : MT22
const GPConfig: IGPConfig = {
  id: "ATC04AE0",
  menuPath: { topic: "My training", name: "Training history" }
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
    cy.wait(3000);
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to Training history gp and verify gp's data", () => {
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

      cy.wait(`@${GPConfig.id}`, { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);
        const length = getLengthFromData(data, "ZY4A");

        cy.getBySel("records-length")
          .invoke("text")
          .should("eq", length);

        if (parseInt(length) > 0) {
          cy.getBySel("table-body").should("be.visible");
          cy.getBySel("paginated-table-row")
            .eq(0)
            .click();

          cy.get(".modal")
            .should("be.visible")
            .within(() => {
              cy.getBySel("LBCLSH")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["LBCLSH"]);
              cy.getBySel("NBHOUR")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", minutesToTime(results["NBHOUR"]));
              cy.get(".date-box[data-test-id='DTEFCL'] input")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", formatDateSpain(results["DTEFCL"]));
              cy.get(".date-box[data-test-id='DTENCL'] input")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", formatDateSpain(results["DTENCL"]));
              cy.getBySel("VARATE")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["VARATE"]);
              cy.getBySel("FLPAFA_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["FLPAFA_EXT"]);

              cy.getBySel("close-button")
                .contains("Close")
                .click();
            });
        }
      });
    });
  });
}
