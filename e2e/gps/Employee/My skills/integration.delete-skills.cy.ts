import "jquery";
import { IGPConfig } from "../../../../support/interfaces";
import { getLengthFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : DV46
let roles: any = {};
let length: number;
const GPConfig: IGPConfig = {
  id: "ASW03DE0",
  menuPath: { topic: "My skills", name: "Update my skills" }
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
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to my skills gp and delete the skill added", () => {
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

        length = getLengthFromData(data, "ZY3D");
        cy.getBySel("records-length")
          .invoke("text")
          .should("contain", length);

        if (length > 0) {
          cy.findRowInTable(fetchGpData.dataToTypeEmployee["IDSK00"])
            .should("be.visible")
            .within(() => {
              cy.getBySel("delete")
                .should("be.visible")
                .click();
            });
          cy.getBySel("TXCOMM")
            .scrollIntoView()
            .type(fetchGpData.dataToTypeEmployee["TXCOMM"], { force: true });
          cy.getBySel("data-submit")
            .contains("Submit")
            .should("be.visible")
            .click();

          cy.getBySel("gp-submitted-with-success").should("be.visible");
          cy.getBySel("go-to-request").should("be.visible");
          cy.getBySel("go-to-request")
            .click()
            .then(() => {
              cy.url().should("include", GPConfig.id);
            });
        }
      });
    });

    it("should switch on manager role and approve the request", () => {
      if (length > 0) {
        const requestLabel = "Skill profile updated";

        cy.getBySel("role-button")
          .should("be.visible")
          .click()
          .then(() => {
            cy.getBySel("roles-list-search-input")
              .should("be.visible")
              .type(roles.managerRoleApproverLabel);
            cy.get("li")
              .contains(roles.managerRoleApproverLabel)
              .click();
            cy.getBySel("tasks-badge").click();
            cy.get(".fa-arrows-rotate").click();

            cy.getBySel("search-box-text").type(requestLabel);

            cy.wait(2000);
            cy.getBySel("paginated-table-row")
              .eq(0)
              .should("be.visible")
              .click();
            cy.getBySel("STATUX")
              .scrollIntoView()
              .should("be.visible")
              .select(fetchGpData.dataToTypeManager["STATUX"]);
            cy.getBySel("data-submit")
              .contains("Submit")
              .click();
          });
      }
    });
  });
}
