import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
import { IGPConfig } from "../../../../support/interfaces";

//ENV : MT22
let results: any;
let length: any;
let hasData: boolean = true;

const GPConfig: IGPConfig = {
  id: "AIW400E1",
  menuPath: { topic: "My mobility", name: "Open Positions" }
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
    cy.wait(2000);
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to Open Positions gp and verify the clear button fonctionnality", () => {
      cy.get(".gp-topic-item-hover", { timeout: 20000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.url().should("include", GPConfig.id);

      cy.get(".subtitle-container")
        .contains("Search")
        .should("be.visible");

      cy.getBySel("CDPAYS")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["CDPAYS"]).click();

      cy.getBySel("IDCY00")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDCY00"]).click();

      cy.getBySel("IDJB00")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDJB00"]).click();

      cy.getBySel("IDOU00")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDOU00"]).click();

      cy.getBySel("IDPS00")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.contains(fetchGpData.dataToTypeEmployee["IDPS00"]).click();

      cy.getBySel("IDSR00")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["IDSR00"]);

      cy.getBySel("FLSREX")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["FLSREX"]).click();

      cy.getBySel("clearLabel")
        .should("be.visible")
        .click();

      cy.getBySel("CDPAYS").should("have.value", "");
      cy.getBySel("IDCY00").should("have.value", "");
      cy.getBySel("IDJB00").should("have.value", "");
      cy.getBySel("IDOU00").should("have.value", "");
      cy.getBySel("IDPS00").should("have.value", "");
      cy.getBySel("IDSR00").should("have.value", "");
      cy.getBySel("FLSREX").should("have.value", "");
    });

    it("should be able to search for a specific open position and verify data and submit the application", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/aux-pop/search?**`, method: "POST" }).as("searchdossier");

      cy.getBySel("IDCY00").click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDCY00"]).click();

      cy.getBySel("IDSR00").type(fetchGpData.dataToTypeEmployee["IDSR00"]);

      cy.getBySel("data-submit")
        .contains("Search")
        .click();

      cy.wait(3000);

      cy.getBySel("snackbar-toast").then(toast => {
        if (toast.text().includes("No Data")) {
          hasData = false;
          cy.log("**** NO DATA FOUND ****").wait(2000);
          cy.skipOn(!hasData);
        } else if (toast.text().includes("Search result")) {
          hasData = true;
          cy.wait("@searchdossier", { timeout: 20000 }).then(({ response: { body } }: any) => {
            const data = body.occurrences.occurrence;
            results = getValueFromData(data, fetchGpData.dataSearch);

            length = getLengthFromData(data, "ZB00");
            cy.getBySel("records-length")
              .invoke("text")
              .should("eq", length);

            cy.getBySel("table-body").should("be.visible");
            cy.getBySel("paginated-table-row")
              .eq(0)
              .should("be.visible")
              .click();

            cy.get(".modal")
              .should("be.visible")
              .within(() => {
                cy.get(".subtitle-container")
                  .contains("Job details")
                  .should("be.visible");

                cy.getBySel("LBSRSH")
                  .should("be.visible")
                  .should("have.value", results["LBSRSH"]);

                cy.getBySel("IDSR00")
                  .should("be.visible")
                  .should("have.value", results["IDSR00"]);

                cy.get(".subtitle-container")
                  .contains("Assignments")
                  .should("be.visible");

                cy.getBySel("IDCY00_EXT")
                  .should("be.visible")
                  .should("have.value", results["IDCY00_EXT"]);

                cy.getBySel("IDOU00_EXT")
                  .should("be.visible")
                  .should("have.value", results["IDOU00_EXT"]);

                cy.getBySel("IDESTA_EXT")
                  .should("be.visible")
                  .should("have.value", results["IDESTA_EXT"]);

                cy.getBySel("IDJB00_EXT")
                  .should("be.visible")
                  .should("have.value", results["IDJB00_EXT"]);

                cy.getBySel("IDPS00_EXT")
                  .should("be.visible")
                  .should("have.value", results["IDPS00_EXT"]);

                cy.getBySel("FLSREX_EXT")
                  .should("be.visible")
                  .should("have.value", results["FLSREX_EXT"]);

                cy.get(".subtitle-container")
                  .contains("Assignment dates")
                  .should("be.visible");

                cy.get(".date-box[data-test-id='DTFRST'] input")
                  .should("be.visible")
                  .should("have.value", results["DTFRST"] === undefined ? "" : formatDateSpain(results["DTFRST"]));

                cy.get(".date-box[data-test-id='DTFREN'] input")
                  .should("be.visible")
                  .should("have.value", results["DTFREN"] === undefined ? "" : formatDateSpain(results["DTFREN"]));

                cy.get(".subtitle-container")
                  .contains("Posting details")
                  .should("be.visible");

                cy.getBySel("TXSECT")
                  .should("be.visible")
                  .should("have.value", results["TXSECT"]);

                cy.get(".subtitle-container")
                  .contains("For more information, contact:")
                  .scrollIntoView()
                  .should("be.visible");

                cy.getBySel("MATCLE")
                  .should("be.visible")
                  .should("have.value", results["MATCLE"]);

                cy.getBySel("NBPHON")
                  .should("be.visible")
                  .should("have.value", results["NBPHON"]);

                cy.getBySel("TXEMAI")
                  .should("be.visible")
                  .should("have.value", results["TXEMAI"]);

                cy.get(".subtitle-container")
                  .contains("Application")
                  .scrollIntoView()
                  .should("be.visible");

                cy.get(".date-box[data-test-id='DTOPEN'] input")
                  .should("be.visible")
                  .should("have.value", results["DTOPEN"] === undefined ? "" : formatDateSpain(results["DTOPEN"]));

                cy.get(".date-box[data-test-id='DTFILL'] input")
                  .should("be.visible")
                  .should("have.value", results["DTFILL"] === undefined ? "" : formatDateSpain(results["DTFILL"]));
              });
          });
        }
      });
    });

    it("should redirect to Link an application to an offer, verify the data and submit it", () => {
      cy.skipOn(!hasData);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/AIW02AE1/paramdatav2**`, method: "POST" }).as("AIW02AE1");

      cy.getBySel("path-link")
        .contains("Submit your application")
        .click();

      cy.wait("@AIW02AE1", { timeout: 20000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        results = getValueFromData(data, fetchGpData.applicationDataSearch);

        cy.get(".card-header")
          .contains("Link an application to an offer")
          .should("be.visible");

        cy.url().should("include", "AIW02AE1");

        cy.get(".subtitle-container")
          .contains("Application")
          .should("be.visible");

        cy.get(".date-box[data-test-id='DTAPPL'] input")
          .should("be.visible")
          .should("have.value", formatDateSpain(results["DTAPPL"]));

        cy.getBySel("LBSRSH")
          .should("be.visible")
          .should("have.value", results["LBSRSH"]);

        cy.getBySel("IDSR00")
          .should("be.visible")
          .should("have.value", results["IDSR00"]);

        cy.getBySel("IDSOAP")
          .should("be.visible")
          .should("have.value", results["IDSOAP"]);

        cy.getBySel("IDSOAP_EXT")
          .should("be.visible")
          .should("have.value", results["IDSOAP_EXT"]);

        cy.getBySel("IDOU00")
          .should("be.visible")
          .should("have.value", results["IDOU00"]);

        cy.getBySel("IDOU00_EXT")
          .should("be.visible")
          .should("have.value", results["IDOU00_EXT"]);

        cy.getBySel("IDJB00")
          .should("be.visible")
          .should("have.value", results["IDJB00"]);

        cy.getBySel("IDJB00_EXT")
          .should("be.visible")
          .should("have.value", results["IDJB00_EXT"]);

        cy.getBySel("IDPS00")
          .should("be.visible")
          .should("have.value", results["IDPS00"]);

        cy.getBySel("IDPS00_EXT")
          .should("be.visible")
          .should("have.value", results["IDPS00_EXT"]);

        cy.get(".subtitle-container")
          .contains("Conditions")
          .should("be.visible");

        cy.get(".date-box[data-test-id='DTFOST'] input")
          .should("be.visible")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["DTFOST"]);

        cy.get(".date-box[data-test-id='DTFOEN'] input")
          .should("be.visible")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["DTFOEN"]);

        cy.getBySel("FLPFTI")
          .should("be.visible")
          .find('input[type="radio"]')
          .first()
          .click();

        cy.getBySel("CLEMPL")
          .should("be.visible")
          .click();
        cy.contains(fetchGpData.dataToTypeEmployee["CLEMPL"]).click();

        cy.getBySel("AMSAL")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["AMSAL"]);

        cy.getBySel("DUPARA")
          .should("be.visible")
          .select(fetchGpData.dataToTypeEmployee["DUPARA"].label);

        cy.getBySel("FLSHWK")
          .scrollIntoView()
          .should("be.visible")
          .click();
        cy.getBySel("FLOVWK")
          .should("be.visible")
          .click();
        cy.getBySel("FLROSH").should("be.visible");

        cy.getBySel("FLSASU")
          .scrollIntoView()
          .should("be.visible")
          .click();

        cy.getBySel("TXCOMM")
          .eq(0)
          .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);

        cy.get(".subtitle-container")
          .contains("Comment of the requester")
          .should("be.visible");

        cy.getBySel("TXCOMM")
          .eq(1)
          .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.getBySel("gp-submitted-with-success").should("be.visible");
      });
    });

    it("should redirect to the request and verify the data submitted", () => {
      cy.skipOn(!hasData);

      cy.getBySel("go-to-request").should("be.visible");
      cy.getBySel("go-to-request")
        .click()
        .then(() => {
          cy.url().should("include", "AIW02AE1");
        });

      cy.get(".subtitle-container")
        .contains("Conditions")
        .should("be.visible");

      cy.get(".date-box[data-test-id='DTFOST'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTFOST"]);

      cy.get(".date-box[data-test-id='DTFOEN'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTFOEN"]);

      cy.getBySel("FLPFTI")
        .should("be.visible")
        .find('input[type="radio"]')
        .first()
        .should("be.checked");

      cy.getBySel("CLEMPL")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["CLEMPL"]);

      cy.getBySel("AMSAL")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["AMSAL"]);

      cy.getBySel("DUPARA")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DUPARA"].value);

      cy.get("[data-test-id='FLSHWK'] input")
        .scrollIntoView()
        .should("be.checked");
      cy.get("[data-test-id='FLOVWK'] input").should("be.checked");
      cy.get("[data-test-id='FLROSH'] input").should("not.be.checked");
      cy.get("[data-test-id='FLSASU'] input")
        .scrollIntoView()
        .should("be.checked");

      cy.getBySel("TXCOMM")
        .eq(0)
        .should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);

      cy.get(".subtitle-container")
        .contains("Comment of the requester")
        .should("be.visible");

      cy.getBySel("TXCOMM")
        .eq(1)
        .should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);
    });
  });
}
