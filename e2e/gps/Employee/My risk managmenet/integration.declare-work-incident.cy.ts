import "jquery";
import { getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
// ENV : DV46
let results: any = [];
const GPConfig: IGPConfig = {
  id: "ARD0NJE0",
  menuPath: { topic: "My risk management", name: "Declare work incident" }
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
      });
    });

    it("Fill the circumstances of the incident", () => {
      cy.get(".subtitle-container")
        .contains("Circumstances of the incident")
        .should("be.visible");

      cy.getBySel("DTACCN")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DTACCN"]);
      cy.getBySel("DUACCN")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DUACCN"]);
      cy.getBySel("TIPO")
        .should("be.visible")
        .select(fetchGpData.dataToTypeEmployee["TIPO"]);
      cy.getBySel("CAUSA").click();
      cy.contains(fetchGpData.dataToTypeEmployee["CAUSA"]).click();
      cy.getBySel("LUGAR").click();
      cy.contains(fetchGpData.dataToTypeEmployee["LUGAR"]).click();
      cy.getBySel("CODEPI").click();
      cy.contains(fetchGpData.dataToTypeEmployee["CODEPI"]).click();
      cy.getBySel("CODETR").click();
      cy.contains(fetchGpData.dataToTypeEmployee["CODETR"]).click();
      cy.getBySel("ACTVIC")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["ACTVIC"]);
      cy.getBySel("NATAC0")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["NATAC0"]);
      cy.getBySel("OBJVIC")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["OBJVIC"]);
    });

    it("should fill treatment and consequences of incident blanks and submit the request", () => {
      cy.get(".subtitle-container")
        .contains("Treatment and consequences of incident")
        .should("be.visible");

      cy.get(".date-box[data-test-id='FECBAJ'] input")
        .scrollIntoView()
        .should("be.visible")
        .clear()
        .type(fetchGpData.dataToTypeEmployee["FECBAJ"]);
      cy.get(".date-box[data-test-id='FECALT'] input")
        .scrollIntoView()
        .should("be.visible")
        .clear()
        .type(fetchGpData.dataToTypeEmployee["FECALT"]);
      cy.getBySel("LESION")
        .should("be.visible")
        .clear()
        .type(fetchGpData.dataToTypeEmployee["LESION"]);

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

    it("Should verify all the request data", () => {
      cy.getBySel("NMPRES")
        .should("be.visible")
        .should("have.value", results["NMPRES"]);
      cy.getBySel("MATCLE")
        .should("be.visible")
        .should("have.value", results["MATCLE"]);

      cy.get(".subtitle-container")
        .contains("Circumstances of the incident")
        .should("be.visible");

      cy.get(".date-box[data-test-id='DTACCN'] input")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTACCN"]);
      cy.get(".date-box[data-test-id='DUACCN'] input")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["DUACCN"]);
      cy.getBySel("TIPO")
        .should("be.disabled")
        .should("contain", fetchGpData.dataToTypeEmployee["TIPO"]);
      cy.getBySel("CAUSA")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["CAUSA"]);
      cy.getBySel("LUGAR")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["LUGAR"]);
      cy.getBySel("CODEPI")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["CODEPI"]);
      cy.getBySel("CODETR")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["CODETR"]);
      cy.getBySel("ACTVIC")
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["ACTVIC"]);
      cy.getBySel("NATAC0")
        .scrollIntoView()
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["NATAC0"]);
      cy.getBySel("OBJVIC")
        .scrollIntoView()
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["OBJVIC"]);

      cy.get(".subtitle-container")
        .contains("Treatment and consequences of incident")
        .scrollIntoView()
        .should("be.visible");

      cy.get(".date-box[data-test-id='FECBAJ'] input")
        .scrollIntoView()
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["FECBAJ"]);
      cy.get(".date-box[data-test-id='FECALT'] input")
        .scrollIntoView()
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["FECALT"]);
      cy.getBySel("LESION")
        .scrollIntoView()
        .should("be.disabled")
        .should("have.value", fetchGpData.dataToTypeEmployee["LESION"]);
    });

    it("should delete the request", () => {
      cy.getBySel("data-submit")
        .contains("Delete")
        .click();

      cy.getBySel("snackbar-toast").should("have.text", "Removed");
      cy.getBySel("gp-submitted-with-success").should("be.visible");
    });
  });
}
