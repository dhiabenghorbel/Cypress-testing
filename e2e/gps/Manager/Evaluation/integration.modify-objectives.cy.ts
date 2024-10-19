import { IGPConfig } from "../../../../support/interfaces";
import cyconstants from "../../../../support/cyconstants";
import "jquery";
import { getLengthFromData, getValueFromData, uploadFile } from "../../../../support/functions";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV: DV46

let roles: any = [];
let lengthZY3O: string;
let hasCampaigns: boolean;

const GPConfig: IGPConfig = {
  id: "ASW03OP2",
  menuPath: { topic: "Evaluation", name: "Modify objectives" }
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

    it("should redirect to modify objectives gp and verify gp's data", () => {
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
        .contains(GPConfig.menuPath.name)
        .click();
      cy.get(".card-header")
        .contains(GPConfig.menuPath.name, { timeout: 25000 })
        .should("be.visible");
    });

    // STEP 1

    it("should click on an employee and display the list of campaigns", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(`${GPConfig.id}`);

      cy.getBySel("dossier-list-search-container")
        .should("be.visible")
        .type(fetchGpData.dataToTypeManager["dossier"])
        .find(".select__option")
        .click();

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        lengthZY3O = getLengthFromData(data, "ZY3O");
        cy.getRecordsFromTable("ZY3O")
          .invoke("text")
          .should("eq", lengthZY3O)
          .then(() => {
            if (parseInt(lengthZY3O) === 0) {
              hasCampaigns = false;
              cy.log("***** NO CAMPAIGNS FOUND *****").wait(3000);
            } else if (parseInt(lengthZY3O) > 0) {
              hasCampaigns = true;
            }
          });
      });
    });

    it("should click on a campaign and fill out the data", () => {
      cy.skipOn(!hasCampaigns);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**&startpop=${fetchGpData.dataToTypeManager["dossier"]}`, method: "POST" }).as(
        `${GPConfig.id}`
      );
      cy.getBySel("table-body").should("be.visible");
      cy.getBySel("paginated-table-row")
        .should("be.visible")
        .then($lines => {
          const linesValues = Array.from($lines).map(line => line.innerText.trim());
          const index = linesValues.findIndex(lineStr => lineStr.includes(fetchGpData.dataToTypeManager["campaign"]));
          return $lines[index];
        })
        .click();

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        if (results["FLGOAL"] === "1") {
          cy.get(".subtitle-container")
            .contains("Objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03NGU").should("be.visible");
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
          if (results["FLGOCO"] === "1") {
            cy.getBySel("TXEMCM").should("be.visible");
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
          .contains("Attached File")
          .should("be.visible");

        uploadFile("BLOB01", fetchGpData.dataToTypeManager["BLOB01"]).then(() => {
          cy.wait(2000);
        });

        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.getBySel("gp-submitted-with-success").should("be.visible");
        cy.wait(2000);
      });
    });

    // STEP 2

    it("should switch to employee role and validate the task", () => {
      const taskLabel = "The objectives sheet has been reopened by your manager";

      cy.skipOn(!hasCampaigns);

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
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(taskLabel);
            })
            .click();
        });

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearchTasks);

        if (results["FLGOAL"] === "1") {
          cy.get(".subtitle-container")
            .contains("Objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03NGS").should("be.visible");
          const lengthZY3N = getLengthFromData(data, "ZY3N");
          cy.getRecordsFromTable("ZY3N")
            .invoke("text")
            .should("eq", lengthZY3N);
          cy.getBySel("delete")
            .eq(1)
            .scrollIntoView()
            .should("be.visible")
            .click();
          cy.getBySel("add-button")
            .eq(0)
            .scrollIntoView()
            .should("be.visible")
            .click();
          cy.getBySel("DTTARG")
            .should("be.visible")
            .type(fetchGpData.dataToTypeEmployee["DTTARG"]);
          cy.getBySel("RTWGHT")
            .should("be.visible")
            .type(fetchGpData.dataToTypeEmployee["RTWGHT"]);
          cy.getBySel("TXOBSH")
            .should("be.visible")
            .type(fetchGpData.dataToTypeEmployee["TXOBSH"]);
          cy.getBySel("FLPROB").should("be.visible");
          cy.getBySel("TXOBLG")
            .should("be.visible")
            .type(fetchGpData.dataToTypeEmployee["TXOBLG"]);
          if (results["FLGOMS"] === "1") {
            cy.getBySel("TXMESR")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["TXMESR"]);
          }
          if (results["FLGOCO"] === "1") {
            cy.getBySel("TXEMCM")
              .should("be.visible")
              .should("have.value", results["TXEMCM"]);
          }
          if (results["FLGMCO"] === "1") {
            cy.getBySel("TXRWCM").should("be.visible");
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
        }

        // cy.get('[data-test-id="BLOB01"]').should("have.attr", "filename", fetchGpData.dataToTypeManager["BLOB01"]);

        cy.get(".subtitle-container")
          .contains("Approval")
          .scrollIntoView()
          .should("be.visible");

        cy.getByDataForm("ASTWT1A2").should("be.visible");
        cy.getBySel("STATUX")
          .should("be.visible")
          .select(fetchGpData.dataToTypeEmployee["STATUX"]);
        cy.getBySel("TXCOMM").type(fetchGpData.dataToTypeManager["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.wait(2000);
      });
    });

    // STEP 3

    it("should switch to manager role to validate the task", () => {
      const taskLabel = "objectives sheet of evaluation campaign";

      cy.skipOn(!hasCampaigns);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);

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
      cy.getBySel("tasks-badge").click();
      cy.getBySel("search-box-text")
        .type(taskLabel)
        .then(() => {
          cy.getBySel("table-body").should("be.visible");
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(taskLabel);
            })
            .click();
        });

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearchTasks);

        if (results["FLGOAL"] === "1") {
          cy.get(".subtitle-container")
            .contains("Objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03NGS").should("be.visible");
          const lengthZY3N = getLengthFromData(data, "ZY3N");
          cy.getRecordsFromTable("ZY3N")
            .invoke("text")
            .should("eq", lengthZY3N);
          cy.getBySel("delete")
            .eq(0)
            .should("be.visible")
            .click();
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
          if (results["FLGOCO"] === "1") {
            cy.getBySel("TXEMCM").should("be.visible");
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

          cy.selectValueFromCodelist("IDSKRQ", "CDCODE", fetchGpData.dataToTypeEmployee["CDCODE"]);

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

        // cy.get('[data-test-id="BLOB01"]').should("have.attr", "filename", fetchGpData.dataToTypeManager["BLOB01"]);

        cy.get(".subtitle-container")
          .contains("Approval")
          .should("be.visible");
        cy.getByDataForm("ASTWT1A2")
          .eq(0)
          .should("be.visible");
        cy.getBySel("USNAME")
          .scrollIntoView()
          .should("be.visible")
          .should("have.value", results["USNAME"]);
        cy.getBySel("STATUX")
          .eq(0)
          .should("be.visible")
          .should("have.value", results["STATUX"]);
        cy.getBySel("TXCOMM")
          .eq(0)
          .should("be.visible")
          .should("have.value", results["TXCOMM"]);

        cy.get(".subtitle-container")
          .contains("Approval")
          .should("be.visible");
        cy.getByDataForm("ASTWT1A2")
          .eq(1)
          .should("be.visible");
        cy.getBySel("STATUX")
          .eq(1)
          .should("be.visible")
          .select(fetchGpData.dataToTypeManager["STATUX"]);
        cy.getBySel("TXCOMM")
          .eq(1)
          .should("be.visible")
          .type(fetchGpData.dataToTypeManager["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.wait(2000);
      });
    });

    // STEP 4

    it("should switch to employee role to validate the task", () => {
      cy.skipOn(!hasCampaigns);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);

      const taskLabel = "Validate objectives sheet of evaluation campaign";

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
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(taskLabel);
            })
            .click();
        });

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearchTasks);

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

        // cy.get('[data-test-id="BLOB01"]').should("have.attr", "filename", fetchGpData.dataToTypeManager["BLOB01"]);

        cy.get(".subtitle-container")
          .contains("Approval")
          .eq(0)
          .scrollIntoView()
          .should("be.visible");
        cy.getByDataForm("ASTWT1A2")
          .eq(0)
          .should("be.visible");
        cy.getBySelFromForm("ASTWT1A2", "USNAME")
          .should("be.visible")
          .should("have.value", results["USNAME"]);
        cy.getBySelFromForm("ASTWT1A2", "STATUX")
          .eq(0)
          .should("be.visible")
          .should("have.value", results["STATUX"]);
        cy.getBySelFromForm("ASTWT1A2", "TXCOMM")
          .eq(0)
          .should("be.visible")
          .should("have.value", results["TXCOMM"]);

        cy.getByDataForm("ASTWT1A2")
          .eq(1)
          .should("be.visible");
        cy.getBySelFromForm("ASTWT1A2", "STATUX")
          .eq(1)
          .should("be.visible")
          .should("have.value", results["STATUX"]);
        cy.getBySelFromForm("ASTWT1A2", "TXCOMM")
          .eq(1)
          .should("be.visible")
          .should("have.value", results["TXCOMM"]);

        cy.get(".subtitle-container")
          .contains("Employee approval")
          .should("be.visible");

        cy.getByDataForm("ASTWT1A1").should("be.visible");
        cy.getBySelFromForm("ASTWT1A1", "STATUX")
          .scrollIntoView()
          .should("be.visible")
          .select(fetchGpData.dataToTypeEmployee["STATUX"]);
        cy.getBySelFromForm("ASTWT1A1", "TXCOMM")
          .should("be.visible")
          .type(fetchGpData.dataToTypeManager["TXCOMM"]);
        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.wait(2000);
      });
    });
  });
}
