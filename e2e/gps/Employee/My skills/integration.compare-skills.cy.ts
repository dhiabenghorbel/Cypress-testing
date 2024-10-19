import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
import "jquery";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASCSALE2",
  menuPath: { topic: "My skills", name: "Compare skills" }
};
const fetchGpData = dataMapping[cyConf.env][cyConf.user][GPConfig.id];

if (fetchGpData === undefined) {
  it("Should log an error message for an invalid environment configuration", () => {
    cy.log("Integration testing cannot proceed due to an invalid environment configuration. Please verify the environment settings.");
    cy.skipOn(true);
  });
} else {
  const barTypes = ["Bar", "Line", "Pie", "Area"];

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

    it("should verify skills data and be able to change the chart type", () => {
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
        const GpData = body.occurrences.occurrence;
        if (GpData.length > 1) {
          const skillsData = getValueFromData(GpData, fetchGpData.dataSearch);

          cy.get(".subtitle-container")
            .contains("Skills")
            .should("be.visible");

          length = getLengthFromData(GpData, "ZY3D");
          cy.getRecordsFromTable("ZY3D")
            .invoke("text")
            .should("eq", length);

          if (length > 0) {
            cy.getBySel("table-body").should("be.visible");
            cy.wait(2000);
            cy.getBySel("paginated-table-row")
              .eq(0)
              .should("be.visible")
              .click();

            cy.getBySel("IDSK00_EXT")
              .should("be.visible")
              .should("have.value", skillsData["IDSK00_EXT"]);

            cy.getBySel("LVPROF_EXT")
              .should("be.visible")
              .should("have.value", skillsData["LVPROF_EXT"]);

            cy.getBySel("LVREQX_EXT")
              .should("be.visible")
              .should("have.value", skillsData["LVREQX_EXT"]);

            cy.getBySel("close-button")
              .contains("Close")
              .click();

            cy.get(".subtitle-container")
              .contains("Skills chart")
              .should("be.visible");
            cy.get(".chartjs-render-monitor").should("be.visible");
            barTypes.forEach(type => {
              cy.getBySel("chart-select")
                .should("be.visible")
                .within(() => {
                  cy.get(".select-input").select(type);

                  cy.get(".chartjs-render-monitor").should("be.visible");
                });
            });
          }
        }
      });
    });
  });
}
