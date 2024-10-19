import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
import "jquery";
// ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASCSALE0",
  menuPath: { topic: "My employee information", name: "My personal details" }
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

    it("should redirect to my personal details gp and verify gp's data", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.wait(2000);
      cy.get(".card-header", { timeout: 25000 })
        .contains("My personal details")
        .should("be.visible");
      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.wait(2000);
        cy.get(".subtitle-container")
          .contains("Employee information")
          .should("be.visible");
        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("have.value", results["NMPRES"]);

        cy.get('[data-test-id="DATNAI"] input')
          .should("be.visible")
          .should("have.value", results["DATNAI"]);

        cy.getBySel("VILNAI")
          .should("be.visible")
          .should("have.value", results["VILNAI"]);
        cy.getBySel("PAYNAI_EXT")
          .should("be.visible")
          .should("have.value", results["PAYNAI_EXT"]);
        cy.getBySel("SITFAM_EXT")
          .should("be.visible")
          .should("have.value", results["SITFAM_EXT"]);
        cy.get('[data-test-id="DATSIT"] input')
          .should("be.visible")
          .should("have.value", results["DATSIT"]);

        cy.get(".subtitle-container")
          .contains("Address")
          .should("be.visible");

        cy.getBySel("ZONADA")
          .should("be.visible")
          .should("have.value", results["ZONADA"]);
        cy.getBySel("ZONADB")
          .should("be.visible")
          .should("have.value", results["ZONADB"]);
        cy.getBySel("ZONADC")
          .should("be.visible")
          .should("have.value", results["ZONADC"]);
        cy.getBySel("ZONADD")
          .should("be.visible")
          .should("have.value", results["ZONADD"]);
        cy.getBySel("CDPAYS_EXT")
          .should("be.visible")
          .should("have.value", results["CDPAYS_EXT"]);
        cy.getBySel("NUMTEL")
          .should("be.visible")
          .should("have.value", results["NUMTEL"]);

        cy.get(".subtitle-container")
          .contains("Dependents")
          .should("be.visible");

        length = getLengthFromData(data, "ZYE5");
        cy.getBySel("records-length")
          .invoke("text")
          .should("contain", length);

        cy.get(".subtitle-container")
          .contains("Emergency contacts")
          .should("be.visible");

        length = getLengthFromData(data, "ZYPP");
        cy.getBySel("records-length")
          .invoke("text")
          .should("contain", length);
      });
    });
  });
}
