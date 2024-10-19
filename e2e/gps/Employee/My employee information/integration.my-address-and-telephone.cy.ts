import "jquery";
import { IGPConfig } from "../../../../support/interfaces";
import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : MT22
const GPConfig: IGPConfig = {
  id: "ASW00FE0",
  menuPath: { topic: "My employee information", name: "My address & telephone" }
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

  describe("should load the website and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should verify the displayed gp's data and add an address and a telephone number", () => {
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

      cy.get(".subtitle-container")
        .contains("Address")
        .should("be.visible");

      cy.wait(`@${GPConfig.id}`, { timeout: 60000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        const length = getLengthFromData(data, "ZY0F");
        cy.getRecordsFromTable("ZY0F")
          .invoke("text")
          .should("eq", length);

        cy.getBySel("add-button")
          .should("be.visible")
          .click();
        cy.wait(2000);

        cy.getBySel("TYPADD")
          .should("be.visible")
          .click();
        cy.contains(fetchGpData.dataToTypeEmployee["TYPADD"]).click();

        cy.getBySel("TEMADD")
          .should("be.visible")
          .should("not.be.checked");

        cy.getBySel("CDPAYS")
          .should("be.visible")
          .click();
        cy.contains("li", fetchGpData.dataToTypeEmployee["CDPAYS"]).click();

        cy.get(".date-box[data-test-id='DATDEB'] input")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["DATDEB"]);

        cy.get(".date-box[data-test-id='DATFIN'] input")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["DATFIN"]);

        cy.getBySel("NUMVFR")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["NUMVFR"]);

        cy.getBySel("BISTFR")
          .should("be.visible")
          .select(fetchGpData.dataToTypeEmployee["BISTFR"]);

        cy.getBySel("VOIEFR")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["VOIEFR"]);

        cy.getBySel("CPADFR")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["CPADFR"]);

        cy.getBySel("COMMFR")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["COMMFR"]);

        cy.getBySel("CODPFR").should("be.visible");

        cy.getBySel("BURDFR")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["BURDFR"]);

        cy.getBySel("INSEFR").should("be.visible");

        cy.getBySel("data-submit")
          .contains("Add")
          .click();
        cy.wait(2000);

        cy.get(".subtitle-container")
          .contains("Contact information")
          .should("be.visible");

        cy.getBySel("EMAILS")
          .should("be.visible")
          .should("have.value", results["EMAILS"]);

        cy.selectValueFromCodelist("INTLCL", "CDCODE", fetchGpData.dataToTypeEmployee["CDCODE"]);

        cy.getBySel("TELHOM")
          .should("be.visible")
          .should("have.value", results["TELHOM"]);

        cy.getBySel("TELHOM")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["TELHOM"]);

        cy.selectValueFromCodelist("INTLHM", "CDCODE", fetchGpData.dataToTypeEmployee["CDCODE"]);

        cy.getBySel("TELCEL")
          .should("be.visible")
          .should("have.value", results["TELCEL"]);

        cy.getBySel("TELCEL")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["TELCEL"]);

        cy.selectValueFromCodelist("INTLFX", "CDCODE", fetchGpData.dataToTypeEmployee["CDCODE"]);

        cy.getBySel("TELFAX")
          .should("be.visible")
          .should("have.value", results["TELFAX"]);

        cy.getBySel("TELFAX")
          .should("be.visible")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["TELFAX"]);

        cy.get(".subtitle-container")
          .contains("Comment of the requester")
          .should("be.visible");

        cy.getBySel("TXCOMM").type(fetchGpData.dataToTypeEmployee["TXCOMM"]);

        cy.get(".standard-button")
          .contains("Submit")
          .click();

        cy.getBySel("gp-submitted-with-success").should("be.visible");
        cy.getBySel("go-to-request").should("be.visible");
        cy.getBySel("go-to-request")
          .click()
          .then(() => {
            cy.url().should("include", GPConfig.id);
          });
        cy.wait(2000);
        cy.getBySel("data-submit")
          .scrollIntoView()
          .contains("Cancel")
          .should("be.visible")
          .click();
      });
    });
  });
}
