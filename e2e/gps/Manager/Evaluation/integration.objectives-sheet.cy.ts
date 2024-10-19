import { IGPConfig } from "../../../../support/interfaces";
import cyconstants from "../../../../support/cyconstants";
import "jquery";
import { getLengthFromData, getValueFromData, uploadFile } from "../../../../support/functions";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";

//ENV: DV46

let roles: any = [];
let hasTask: boolean = false;

const GPConfig: IGPConfig = {
  id: "ASW03OP0",
  menuPath: { topic: "Evaluation", name: "Objectives sheet" }
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

    it("should find a task and click on it", () => {
      const taskLabel = "Set objectives for evaluation campaign";

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
      cy.wait(2000);
      cy.getBySel("tasks-badge").click();

      cy.getBySel("search-box-text")
        .type(taskLabel)
        .then(() => {
          cy.getBySel("table-body").then($tableBody => {
            if ($tableBody.find('[data-test-id="paginated-table-row"]').length === 0) {
              hasTask = false;
              cy.log("******* NO TASKS FOUND *******").wait(3000);
            } else {
              cy.getBySel("paginated-table-row")
                .eq(0)
                .should("be.visible");
              cy.contains(".table-cell", taskLabel).click();
              hasTask = true;
            }
          });
        });
    });

    // STEP 1

    it("should fill out the task data and validate it", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);

      cy.skipOn(!hasTask);

      cy.get(".card-header")
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.wait(2000);

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.getByDataForm("ASF03OCP").should("be.visible");

        if (results["FLGOAL"] === "1") {
          cy.get(".subtitle-container")
            .contains("Objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03NGS").should("be.visible");
          const lengthZY3N = getLengthFromData(data, "ZY3N");
          cy.getRecordsFromTable("ZY3N")
            .invoke("text")
            .should("eq", lengthZY3N)
            .then(() => {
              if (lengthZY3N > 0) {
                cy.getBySel("delete")
                  .eq(0)
                  .should("be.visible")
                  .click();
              }
            });
          cy.getBySel("add-button")
            .eq(0)
            .scrollIntoView()
            .should("be.visible")
            .click();
          cy.getBySel("DTTARG")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["DTTARG"]);
          cy.getBySel("RTWGHT")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["RTWGHT"]);
          cy.getBySel("TXOBSH")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["TXOBSH"]);
          cy.getBySel("FLPROB").should("be.visible");
          cy.getBySel("TXOBLG")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["TXOBLG"]);
          if (results["FLGOMS"] === "1") {
            cy.getBySel("TXMESR")
              .should("be.visible")
              .type(fetchGpData.dataToTypeManager["TXMESR"]);
          }
          if (results["FLGMCO"] === "1") {
            cy.getBySel("TXRWCM")
              .should("be.visible")
              .type(fetchGpData.dataToTypeManager["TXRWCM"]);
          }
          cy.getBySel("data-submit")
            .should("be.visible")
            .contains("Add")
            .click();
          cy.wait(2000);
        }
        if (results["FLSKRW"] === "1") {
          cy.get(".subtitle-container")
            .contains("Skills")
            .should("be.visible");
          cy.getByDataForm("ASF036GS").should("be.visible");
          const lengthZY36 = getLengthFromData(data, "ZY36");
          cy.getRecordsFromTable("ZY36")
            .invoke("text")
            .should("eq", lengthZY36);

          cy.getBySel("add-button")
            .eq(1)
            .should("be.visible")
            .click();

          cy.wait(2000);

          cy.selectValueFromCodelist("IDSKRQ", "CDCODE", fetchGpData.dataToTypeManager["CDCODE"]);

          const LVPROF = fetchGpData.dataToTypeManager["LVPROF"];
          cy.getBySel("LVPROF")
            .should("be.visible")
            .click();
          cy.contains("li", LVPROF).click();

          const FLIMPO = fetchGpData.dataToTypeManager["FLIMPO"];
          cy.getBySel("FLIMPO")
            .should("be.visible")
            .click();
          cy.contains("li", FLIMPO).click();

          cy.getBySel("data-submit")
            .should("be.visible")
            .contains("Add")
            .click();
          cy.wait(2000);
        }

        cy.get(".subtitle-container")
          .contains("Add document")
          .should("be.visible");

        uploadFile("BLOB01", fetchGpData.dataToTypeManager["BLOB01"]).then(() => {
          cy.wait(2000);
        });

        cy.get(".subtitle-container")
          .contains("Manager's note")
          .should("be.visible");

        cy.getByDataForm("ASTWT101").should("be.visible");
        cy.getBySel("TXCOMM")
          .should("be.visible")
          .type(fetchGpData.dataToTypeManager["TXCOMM"]);

        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.wait(2000);
      });
    });

    // STEP 2

    it("should switch to employee role and validate the task", () => {
      const taskLabel = "Validate objectives sheet of evaluation campaign";

      cy.skipOn(!hasTask);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);

      cy.getBySel("role-button")
        .should("be.visible")
        .click();
      cy.getBySel("roles-list-search-input")
        .should("be.visible")
        .type(roles.employeeRoleLabel)
        .then(() => {
          cy.getBySel("roles-list-with-search")
            .should("be.visible")
            .find("li")
            .click();
        });
      cy.wait(3000);
      cy.getBySel("tasks-badge").click();
      cy.getBySel("search-box-text")
        .type(taskLabel)
        .then(() => {
          cy.getBySel("table-body").should("be.visible");
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible");
          cy.contains(".table-cell", taskLabel).click();
        });

      cy.get(".card-header").then($header => {
        if ($header.text() != GPConfig.menuPath.name) {
          return;
        } else {
          cy.get(".card-header")
            .contains(GPConfig.menuPath.name)
            .should("be.visible");

          cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
            const data = body.occurrences.occurrence;
            const results = getValueFromData(data, fetchGpData.dataSearch);

            cy.get(".subtitle-container")
              .contains("Basic Data")
              .should("be.visible");

            cy.wait(2000);

            cy.getByDataForm("ASF03OCP").should("be.visible");
            if (results["FLGOAL"] === "1") {
              cy.get(".subtitle-container")
                .contains("Objectives")
                .should("be.visible");
              cy.getByDataForm("ASF03NGS").should("be.visible");
              const lengthZY3N = getLengthFromData(data, "ZY3N");
              cy.getRecordsFromTable("ZY3N")
                .invoke("text")
                .should("eq", lengthZY3N);
            }

            if (results["FLSKRW"] === "1") {
              cy.get(".subtitle-container")
                .contains("Skills")
                .should("be.visible");
              cy.getByDataForm("ASF036GS").should("be.visible");
              const lengthZY36 = getLengthFromData(data, "ZY36");
              cy.getRecordsFromTable("ZY36")
                .invoke("text")
                .should("eq", lengthZY36);
            }

            cy.get(".subtitle-container")
              .contains("Add document")
              .scrollIntoView()
              .should("be.visible");
            cy.get('[data-test-id="ZY3O"]').then(blob => {
              if (blob.find('[data-test-id="file-blob-name"]').length === 0) {
                return;
              } else {
                cy.getBlobnameFromDataSection("ZY3O")
                  .scrollIntoView()
                  .should("be.visible")
                  .invoke("text")
                  .should("eq", results["BLOB01"]);
              }
            });

            cy.get(".subtitle-container")
              .contains("Manager's note")
              .scrollIntoView()
              .should("be.visible");

            cy.getByDataForm("ASTWT101")
              .eq(0)
              .scrollIntoView()
              .should("be.visible");
            cy.getBySelFromForm("ASTWT101", "TXCOMM")
              .scrollIntoView()
              .should("be.visible")
              .should("have.value", results["TXCOMM"]);

            cy.get(".subtitle-container")
              .contains("Employee approval")
              .should("be.visible");

            cy.getByDataForm("ASTWT1A1").should("be.visible");
            cy.getBySel("STATUX")
              .should("be.visible")
              .select(fetchGpData.dataToTypeManager["STATUX"]);

            cy.getBySelFromForm("ASTWT1A1", "TXCOMM")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);

            cy.getBySel("data-submit")
              .contains("Submit")
              .click();
            cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
            cy.wait(2000);
          });
        }
      });
    });
  });
}
