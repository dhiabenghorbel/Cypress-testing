import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : MT22
let roles: any = [];

const GPConfig: IGPConfig = {
  id: "ASC640M1",
  menuPath: { topic: "Compensation", name: "Compensation guidelines (salary)" }
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
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to Compensation guidelines and verify the data displayed", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**`, method: "POST" }).as(GPConfig.id);

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

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains(GPConfig.menuPath.topic)
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains("Salary review")
        .click();

      cy.getBySel("paginated-table-row", { timeout: 25000 })
        .eq(0)
        .click()
        .then(() => {
          cy.url().should("include", "/ASD640MT");
        });

      cy.getBySel("link-cell")
        .eq(0)
        .scrollIntoView()
        .should("be.visible")
        .click()
        .then(() => {
          cy.url().should("include", GPConfig.id);
        });

      cy.get(".card-header")
        .contains(GPConfig.menuPath.name)
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
          .should("be.disabled")
          .should("have.value", results["NMPRES"]);

        cy.getBySel("SOCCLE")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["SOCCLE"]);

        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["MATCLE"]);

        cy.getBySel("IDJB00_EXT")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["IDJB00_EXT"]);

        cy.getBySel("IDOU00_EXT")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["IDOU00_EXT"]);

        cy.getBySel("IDPS00")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["IDPS00"]);

        cy.get(".date-box[data-test-id='DATENT'] input")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", formatDateSpain(results["DATENT"]));

        cy.getBySel("QUALIF_EXT")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["QUALIF_EXT"]);

        cy.getBySel("NMMANG")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["NMMANG"]);

        cy.get(".subtitle-container")
          .contains("Compensation history")
          .should("be.visible");

        const lengthZY32 = getLengthFromData(data, "ZY32");
        cy.getRecordsFromTable("ZY32")
          .invoke("text")
          .should("eq", lengthZY32);

        cy.get(".subtitle-container")
          .contains("Evaluation")
          .should("be.visible");

        const lengthZY3O = getLengthFromData(data, "ZY3O");
        cy.getRecordsFromTable("ZY3O")
          .invoke("text")
          .should("eq", lengthZY3O);

        if (parseInt(lengthZY3O) > 0) {
          cy.get(".table-box")
            .eq(1)
            .within(() => {
              cy.get(".table-cell")
                .eq(11)
                .click();
            });
          cy.wait(1000);

          cy.get(".modal")
            .should("be.visible")
            .within(() => {
              cy.get(".date-box[data-test-id='DTREVW'] input")
                .should("be.disabled")
                .should("have.value", formatDateSpain(results["DTREVW"]));

              cy.getBySel("STAEVL_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["STAEVL_EXT"]);

              cy.getBySel("LIBNOT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["LIBNOT"]);

              cy.getBySel("RVRANW")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["RVRANW"]);

              cy.getBySel("RTOBSC")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["RTOBSC"]);

              cy.getBySel("LIBOBJ")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["LIBOBJ"]);

              cy.getBySel("RTTSSC")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["RTTSSC"]);

              cy.getBySel("LIBTAC")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["LIBTAC"]);

              cy.getBySel("TXEMCM")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["TXEMCM"]);

              cy.getBySel("TXRWCM")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", results["TXRWCM"]);

              cy.getBySel("close-button").click();
            });
        }

        cy.get(".subtitle-container")
          .contains("Increase guidelines")
          .should("be.visible");

        cy.getBySel("FLPATI_EXT")
          .should("be.visible")
          .should("have.value", results["FLPATI_EXT"]);

        cy.getBySel("RTPDHR")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["RTPDHR"]);

        cy.getBySel("AMANN")
          .should("be.disabled")
          .should("have.value", results["AMANN"]);

        cy.getBySel("IDCUR")
          .eq(0)
          .should("be.disabled")
          .should("have.value", results["IDCUR"]);

        cy.getBySel("RTCOMP")
          .should("be.disabled")
          .should("have.value", results["RTCOMP"]);

        cy.getBySel("AMSLY")
          .should("be.disabled")
          .should("have.value", results["AMSLY"]);

        cy.getBySel("IDCUR")
          .eq(1)
          .should("be.disabled")
          .should("have.value", results["IDCUR"]);

        cy.getBySel("RTRGPN")
          .should("be.disabled")
          .should("have.value", results["RTRGPN"]);

        cy.getBySel("RTPACP")
          .should("be.disabled")
          .should("have.value", results["RTPACP"]);

        cy.getBySel("PERMIN")
          .should("be.disabled")
          .should("have.value", results["PERMIN"]);

        cy.getBySel("PERMAX")
          .should("be.disabled")
          .should("have.value", results["PERMAX"]);

        cy.getBySel("AMMIN")
          .should("be.disabled")
          .should("have.value", results["AMMIN"]);

        cy.getBySel("AMMAX")
          .should("be.disabled")
          .should("have.value", results["AMMAX"]);
      });
    });
  });
}
