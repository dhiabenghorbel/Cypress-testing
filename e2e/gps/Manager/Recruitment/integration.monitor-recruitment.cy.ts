import "jquery";
import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : DV46
let results: any = [];
let roles: any = [];
const GPConfig: IGPConfig = {
  id: "AIW41VM1",
  menuPath: { topic: "Recruitment", name: "Monitor recruitment" }
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
    cy.login().then(res => {
      roles = res.roles;
    });
    cy.wait(3000);
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    it("should redirect to Monitor recruitment gp and verify gp's data", () => {
      cy.getBySel("role-button")
        .should("be.visible")
        .click();
      cy.getBySel("roles-list-search-input")
        .should("be.visible")
        .type(roles.managerRoleLabel)
        .then(() => {
          cy.getBySel("roles-list-with-search")
            .should("be.visible")
            .find("li")
            .click();
        });

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(`${GPConfig.id}`);

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
        // results = getValueFromData(data, fetchGpData.dataSearch);

        const lengthZB00 = getLengthFromData(data, "ZB00");
        cy.getBySel("records-length")
          .invoke("text")
          .should("eq", lengthZB00);

        cy.getBySel("paginated-table-row")
          .eq(0)
          .should("be.visible")
          .click();

        cy.window()
          .its("modifiedDataContext")
          .then(context => {
            const modalChanges = context.state.modalChanges;
            results = getValueFromData(modalChanges, fetchGpData.dataSearch);
            cy.get(".modal")
              .should("be.visible")
              .within(() => {
                cy.get(".subtitle-container")
                  .contains("Staffing request identification")
                  .should("be.visible");

                cy.getBySel("LBSRSH")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", results["LBSRSH"]);

                cy.getBySel("IDSR00")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", results["IDSR00"]);

                cy.getBySel("IDOU00")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", results["IDOU00"]);

                cy.getBySel("IDOU00_EXT")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", results["IDOU00_EXT"]);

                cy.get(".date-box[data-test-id='DTFRST'] input")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", formatDateSpain(results["DTFRST"]));

                cy.get(".subtitle-container")
                  .contains("Recruiting status")
                  .should("be.visible");

                const dossier = data[0]["@dossier"];
                const lengthZB1B = getLengthFromData(data, "ZB1B", dossier);
                cy.getRecordsFromTable("ZB1B")
                  .invoke("text")
                  .should("eq", lengthZB1B);

                if (lengthZB1B > 0) {
                  cy.getBySel("paginated-table-row")
                    .eq(0)
                    .should("be.visible")
                    .click();

                  cy.get(".modal")
                    .eq(1)
                    .within(() => {
                      cy.get(".date-box[data-test-id='DTEF00'] input")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", formatDateSpain(results["DTEF00"]));
                      cy.getBySel("STRECR_EXT")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", results["STRECR_EXT"]);

                      cy.getBySel("button-close").click();
                    });
                }

                cy.get(".subtitle-container")
                  .contains("In progress")
                  .should("be.visible");

                cy.get(".table-box")
                  .eq(1)
                  .within(() => {
                    cy.get(".table-cell")
                      .eq(4)
                      .should("be.visible")
                      .invoke("text")
                      .should("eq", results["NBRQFT"]);

                    cy.get(".table-cell")
                      .eq(5)
                      .invoke("text")
                      .should("eq", results["NBRQIN"]);

                    cy.get(".table-cell")
                      .eq(7)
                      .invoke("text")
                      .should("eq", results["NBRHFT"]);

                    cy.get(".table-cell")
                      .eq(8)
                      .invoke("text")
                      .should("eq", results["NBRHIN"]);

                    cy.get(".table-cell")
                      .eq(10)
                      .invoke("text")
                      .should("eq", results["NBHRFT"]);

                    cy.get(".table-cell")
                      .eq(11)
                      .invoke("text")
                      .should("eq", results["NBHRIN"]);
                  });
              });
          });

        cy.getBySel("paginated-table-row").should("be.visible");
      });
    });
  });
}
