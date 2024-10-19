import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import "jquery";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : DV46
let results: any = [];

const GPConfig: IGPConfig = {
  id: "ATW0RHE1",
  menuPath: { topic: "My training", name: "Professional interview" }
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

    it("should redirect to professional interview gp and verify gp's data", () => {
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
        results = getValueFromData(data, fetchGpData.dataSearch);

        cy.get(".subtitle-container")
          .contains("Employee")
          .should("be.visible");

        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("have.value", results["MATCLE"]);
        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("have.value", results["NMPRES"]);
        cy.getBySel("DATNAI")
          .should("be.visible")
          .should("have.value", results["DATNAI"]);
        cy.getBySel("AGEAJO")
          .should("be.visible")
          .should("have.value", results["AGEAJO"]);
        cy.getBySel("AGEMJO")
          .should("be.visible")
          .should("have.value", results["AGEMJO"]);

        cy.get(".subtitle-container")
          .contains("Service")
          .should("be.visible");

        cy.getBySel("DATAN1")
          .should("be.visible")
          .should("have.value", results["DATAN1"]);
        cy.getBySel("DUSEYE")
          .should("be.visible")
          .should("have.value", results["DUSEYE"]);
        cy.getBySel("DUSEMO")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["DUSEMO"]);
        cy.getBySel("DUSEDA")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["DUSEDA"]);

        cy.get(".subtitle-container")
          .contains("Professional interview history")
          .should("be.visible");

        length = getLengthFromData(data, "ZYRH", undefined, "DOMS0SAL-EmployeeID");
        cy.getBySel("records-length")
          .invoke("text")
          .should("eq", length);

        if (length > 0) {
          const resultsModal = getValueFromData(data, fetchGpData.dataSearchModal);

          cy.getBySel("paginated-table-row")
            .find(".table-cell")
            .each($cell => {
              if ($cell.text().trim() !== "") {
                cy.wrap($cell)
                  .closest('[data-test-id="paginated-table-row"]')
                  .click();
              }
            });

          // .find("table-cell")
          // .invoke("text") // Extrae el texto del div
          // .should("not.be.empty") // Verifica que no esté vacío
          // .click();

          cy.get(".date-box[data-test-id='DTRH00'] input")
            .should("be.visible")
            .should("have.value", resultsModal["DTRH00"] === undefined ? "" : formatDateSpain(resultsModal["DTRH00"]));

          cy.get(".date-box[data-test-id='DTEF00'] input")
            .should("be.visible")
            .should("have.value", resultsModal["DTEF00"] === undefined ? "" : formatDateSpain(resultsModal["DTEF00"]));

          cy.getBySel("NMPRES")
            .should("be.visible")
            .should("have.value", resultsModal["NMPRES"]);

          cy.getBySel("close-button")
            .should("be.visible")
            .click();
        }
      });
    });

    it("should submit a request successfully", () => {
      cy.get(".subtitle-container")
        .contains("New request")
        .scrollIntoView()
        .should("be.visible");

      cy.getBySel("DTEA00")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DTEA00"]);
      cy.getBySel("DTLA00")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DTLA00"]);

      cy.getBySel("data-submit")
        .contains("Submit")
        .click();
      cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
      cy.getBySel("gp-submitted-with-success").should("be.visible");
      cy.getBySel("go-to-request").should("be.visible");
      cy.getBySel("go-to-request")
        .click()
        .then(() => {
          cy.wait(2000);
          cy.url().should("include", GPConfig.id);
        });
    });
  });
}
