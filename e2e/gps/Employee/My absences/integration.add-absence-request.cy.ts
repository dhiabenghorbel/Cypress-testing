import "jquery";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : MT22
let roles: any = [];
let userDescription: any = [];

const GPConfig: IGPConfig = {
  id: "ASW0AGE0",
  menuPath: { topic: "My absences", name: "Absence request" }
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

    cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/login`, method: "POST" }).as("rolesList");

    cy.login().then(res => {
      roles = res.roles;
      userDescription = res.userDescription;
    });
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    describe("should be able to add an absence request from absence request gp", () => {
      it("should open My absences and redirect to absence request gp", () => {
        cy.get(".gp-topic-item-hover", { timeout: 25000 })
          .contains(GPConfig.menuPath.topic)
          .click();
        cy.get(".gp-menu-list-label-container")
          .contains(GPConfig.menuPath.name)
          .click();
        cy.get(".card-header", { timeout: 25000 })
          .contains(GPConfig.menuPath.name)
          .should("be.visible");
      });

      it("should add an absence request", () => {
        cy.get(".subtitle-container")
          .contains("Absence request")
          .should("be.visible");

        cy.getBySel("add-button")
          .should("be.visible")
          .click();
        cy.wait(2000);

        cy.getBySel("MOTIFA")
          .should("be.visible")
          .click();
        cy.contains(fetchGpData.dataToTypeEmployee["MOTIFA"]).click();

        cy.get(".date-box[data-test-id='DATDEB'] input")
          .should("be.visible")
          .type(fetchGpData.dataToTypeEmployee["DATDEB"]);
        cy.get(".date-box[data-test-id='DATFIN'] input")
          .should("be.visible")
          .clear()
          .type(fetchGpData.dataToTypeEmployee["DATFIN"]);

        cy.getBySel("TEMDEB")
          .should("be.visible")
          .click();
        cy.getBySel("TEMFIN").should("be.visible");
        cy.getBySel("data-submit")
          .contains("Add")
          .click();
      });

      it("should type a comment and submit the request and verify the request data", () => {
        cy.get(".subtitle-container")
          .contains("Comment of the requester")
          .should("be.visible");
        cy.getBySel("TXCOMM").type(fetchGpData.dataToTypeEmployee["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.getBySel("gp-submitted-with-success").should("be.visible");
        cy.getBySel("go-to-request").should("be.visible");
        cy.getBySel("go-to-request")
          .click()
          .then(() => {
            cy.url().should("include", GPConfig.id);
          });

        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("have.value", userDescription.name);
        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("have.value", userDescription.matcle);

        cy.getBySel("paginated-table-row").click();
        cy.getBySel("MOTIFA_EXT")
          .should("be.visible")
          .should("have.value", fetchGpData.dataToTypeEmployee["MOTIFA"]);
        cy.get(".date-box[data-test-id='DATDEB'] input")
          .should("be.visible")
          .should("have.value", fetchGpData.dataToTypeEmployee["DATDEB"]);
        cy.get(".date-box[data-test-id='DATFIN'] input")
          .should("be.visible")
          .should("have.value", fetchGpData.dataToTypeEmployee["DATFIN"]);

        cy.get("[data-test-id='TEMDEB'] input").should("be.checked");
        cy.get("[data-test-id='TEMFIN'] input").should("not.be.checked");

        cy.getBySel("close-button").click();
        cy.getBySel("TXCOMM")
          .should("be.visible")
          .should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);
      });

      it("should switch to manager role to validate the request ", () => {
        cy.getBySel("role-button")
          .should("be.visible")
          .click();
        cy.getBySel("roles-list-search-input")
          .should("be.visible")
          .type(roles.managerRoleApproverLabel)
          .then(() => {
            cy.getBySel("roles-list-with-search")
              .should("be.visible")
              .find("li")
              .click();
          });
        cy.wait(2000);
        cy.getBySel("tasks-badge").click();
        cy.getBySel("search-box-text")
          .type(fetchGpData.dataToTypeEmployee["DATFIN"])
          .then(() => {
            cy.getBySel("paginated-table-row")
              .should("be.visible")
              .then($lines => {
                const linesValues = Array.from($lines).map(line => line.innerText.trim());
                expect(linesValues[0]).to.include(fetchGpData.dataToTypeEmployee["DATFIN"]);
              })
              .click();
          });
        cy.wait(3000);
        cy.getBySel("NMPRES")
          .should("be.visible")
          .should("have.value", userDescription.name);
        cy.getBySel("MATCLE")
          .should("be.visible")
          .should("have.value", userDescription.matcle);
        cy.get(".subtitle-container")
          .contains("Approval")
          .scrollIntoView()
          .should("be.visible");

        cy.getBySel("STATUX")
          .should("be.visible")
          .select(fetchGpData.dataToTypeManager["STATUX"]);
        cy.getBySelFromForm("ANTWT103", "TXCOMM").type(fetchGpData.dataToTypeManager["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
      });
    });
  });
}
