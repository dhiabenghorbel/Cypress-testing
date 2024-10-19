import "jquery";
import cyconstants from "../../../../support/cyconstants";
import { getValueFromData } from "../../../../support/functions";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : DV46
const GPConfig: IGPConfig = {
  id: "ASCSALE1",
  menuPath: { topic: "My employee information", name: "Administrative data" }
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

    it("should redirect to Administrative data gp and verify gp's data", () => {
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
      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.wait(2000);

        cy.get(".subtitle-container")
          .contains("Employee")
          .should("be.visible");

        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("have.value", results["NMPRES"]);
        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("have.value", results["MATCLE"]);
        cy.getBySel("STEMPL_EXT")
          .should("be.visible")
          .should("have.value", results["STEMPL_EXT"]);

        cy.getBySel("CGSTAT_EXT")
          .should("be.visible")
          .should("have.value", results["CGSTAT_EXT"]);

        cy.getBySel("CLASSI_EXT")
          .should("be.visible")
          .should("have.value", results["CLASSI_EXT"]);

        cy.getBySel("QUALIF_EXT")
          .should("be.visible")
          .should("have.value", results["QUALIF_EXT"]);
        cy.get('[data-test-id="DATAN1"] input')
          .should("be.visible")
          .should("have.value", results["DATAN1"]);
        cy.getBySel("DUSEYE")
          .should("be.visible")
          .should("have.value", results["DUSEYE"]);

        cy.getBySel("DUSEMO")
          .should("be.visible")
          .should("have.value", results["DUSEMO"]);

        cy.getBySel("DUSEDA")
          .should("be.visible")
          .should("have.value", results["DUSEDA"]);

        cy.get(".subtitle-container")
          .contains("Contract details")
          .should("be.visible");

        cy.getBySel("NATCON_EXT")
          .should("be.visible")
          .should("have.value", results["NATCON_EXT"]);

        cy.getBySel("TYPCON_EXT")
          .should("be.visible")
          .should("have.value", results["TYPCON_EXT"]);
        cy.get('[data-test-id="DATCON"] input')
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["DATCON"]);
        cy.get('[data-test-id="DATFIN"] input')
          .should("be.visible")
          .should("have.value", results["DATFIN"]);
        cy.getBySel("DURANN")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["DURANN"]);

        cy.getBySel("DURMOI")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["DURMOI"]);

        cy.getBySel("CODTRA_EXT")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["CODTRA_EXT"]);

        cy.get(".subtitle-container")
          .contains("Assignment")
          .should("be.visible");

        cy.get('[data-test-id="DTEF00"] input')
          .should("be.visible")
          .should("be.visible")
          .should("have.value", results["DTEF00"]);

        cy.getBySel("IDPS00_EXT")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["IDPS00_EXT"]);

        cy.getBySel("IDJB00_EXT")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["IDJB00_EXT"]);

        cy.getBySel("RTASSI")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["RTASSI"]);

        cy.getBySel("IDESTA_EXT")
          .should("be.visible")
          .should("have.value", results["IDESTA_EXT"]);
      });
    });
  });
}
