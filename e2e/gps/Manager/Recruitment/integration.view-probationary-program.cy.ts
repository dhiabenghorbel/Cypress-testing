import cyconstants from "../../../../support/cyconstants";
import "jquery";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : MT22
let results: any = [];
let roles: any = [];
let modalResults: any = [];
let hasData: boolean = true;
const GPConfig: IGPConfig = {
  id: "AIC060M2",
  menuPath: { topic: "Recruitment", name: "View probationary program" }
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

    it("should redirect to View probationary program gp and verify gp's data", () => {
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
      cy.wait(3000);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header", { timeout: 25000 })
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(`${GPConfig.id}`);

      cy.getBySel("dossier-list-search-container")
        .should("be.visible")
        .type(fetchGpData.dataToTypeManager["dossier"])
        .find(".select__option")
        .click();

      cy.wait(`@${GPConfig.id}`, { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        results = getValueFromData(data, fetchGpData.dataSearch);

        cy.get(".subtitle-container")
          .contains("Employee")
          .should("be.visible");

        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["MATCLE"]);

        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["NMPRES"]);

        cy.get(".date-box[data-test-id='DTBGPP'] input")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", formatDateSpain(results["DTBGPP"]))
          .then(() => {
            if (results["DTBGPP"] != "") {
              hasData = true;
              cy.get(".date-box[data-test-id='DTTGPP'] input")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", formatDateSpain(results["DTTGPP"]));

              cy.get(".subtitle-container")
                .contains("Probationary Period Decisions")
                .should("be.visible");

              cy.getBySel("DECSN1_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["DECSN1_EXT"]);

              cy.getBySel("DECSN2_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["DECSN2_EXT"]);

              cy.getBySel("DEC1CM")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["DEC1CM"]);

              cy.getBySel("DEC2CM")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["DEC2CM"]);

              cy.getBySel("table-body").should("be.visible");

              const lengthZY64 = getLengthFromData(data, "ZY64");
              cy.getRecordsFromTable("ZY64")
                .invoke("text")
                .should("eq", lengthZY64);
            } else {
              hasData = false;
              cy.skipOn(!hasData);
            }
          });
      });

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**`, method: "POST" }).as("paramdatav2");

      cy.skipOn(!hasData);

      cy.getBySel("paginated-table-row")
        .eq(0)
        .should("be.visible")
        .click();

      cy.wait(2000);

      cy.get(".modal").should("be.visible");

      cy.wait("@paramdatav2", { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        modalResults = getValueFromData(data, fetchGpData.dataSearchModal);

        const lengthZY4N = getLengthFromData(data, "ZY4N");
        cy.getRecordsFromTable("ZY4N")
          .invoke("text")
          .should("eq", lengthZY4N);

        cy.getBySel("paginated-table-row")
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get(".table-cell")
              .eq(0)
              .should("be.visible")
              .invoke("text")
              .should("eq", modalResults["TXQUES"]);

            cy.get(".table-cell")
              .eq(1)
              .invoke("text")
              .should("eq", modalResults["FLRWYN"]);

            cy.get(".table-cell")
              .eq(2)
              .invoke("text")
              .should("eq", modalResults["FLRWRN"]);

            cy.get(".table-cell")
              .eq(3)
              .invoke("text")
              .should("eq", modalResults["TXRWCM"]);
          });

        cy.getBySel("close-modal").click();
      });
    });
  });
}
