import "jquery";
import { checkTableTemplate, getLengthFromData, getValueFromData, uploadFile } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
import { default as tableTemplate1 } from "../../../../../src/GP4You/table-templates/AS/ASF03WGS/ASF03WGS-table-1";
import { default as tableTemplate2 } from "../../../../../src/GP4You/table-templates/AS/ASF03WGS/ASF03WGS-table-2";
//ENV: DV46

let roles: any = [];
let hasTask = true;

const GPConfig: IGPConfig = {
  id: "ASW03OP4",
  menuPath: { topic: "Evaluation", name: "Evaluate year N and set N + 1" }
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
      const taskLabel = "Fill in evaluation for campaign";

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
              cy.log("******* NO TASKS FOUND *******").wait(3000);
              hasTask = false;
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

      cy.log("STEP 1");

      cy.get(".card-header")
        .should("be.visible")
        .then($header => {
          if ($header.text() != GPConfig.menuPath.name) {
            hasTask = false;
            cy.log("******* NO TASKS FOUND *******");
            cy.wait(2000);
            return;
          } else {
            cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
              const data = body.occurrences.occurrence;
              const results = getValueFromData(data, fetchGpData.dataSearch);

              // PHASE 1

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .should("be.visible");

              cy.getByDataForm("ASF03OCP").should("be.visible");

              cy.get(".subtitle-container")
                .contains("Objectives")
                .should("be.visible");

              cy.getByDataForm("ASF03NBS").should("be.visible");
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
              cy.getBySel("TXOBLG")
                .should("be.visible")
                .type(fetchGpData.dataToTypeManager["TXOBLG"])
                .then(() => {
                  if (results["FLGOMS"] === "1") {
                    cy.getBySel("TXMESR")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXMESR"]);
                  }
                  if (results["FLMDRW"] === "1") {
                    cy.getBySel("STCOMP").should("be.visible");
                    cy.getBySel("RTMIDY").should("be.visible");
                  }
                  if (results["FLSLAP"] === "1") {
                    cy.getBySel("RTEMPL").should("be.visible");
                  }
                  if (results["FLEVCO"] === "1") {
                    cy.getBySel("TXEMCM").should("be.visible");
                  }
                  cy.getBySel("RTMANA")
                    .should("be.visible")
                    .type(fetchGpData.dataToTypeManager["RTMANA"]);
                  if (results["FLGMCO"] === "1") {
                    cy.getBySel("TXRWCM")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXRWCM"]);
                  }
                  if (results["FLPROB"] === "1") {
                    cy.getBySel("FLPROB")
                      .should("be.visible")
                      .click();
                  }
                  cy.getBySel("FLNEOB")
                    .should("be.visible")
                    .click();
                });
              cy.getBySel("data-submit")
                .should("be.visible")
                .contains("Add")
                .click();

              cy.wait(2000).then(() => {
                if (results["FLSCRT"] === "1") {
                  cy.get(".subtitle-container")
                    .contains("Overall rating for objectives")
                    .should("be.visible");
                  cy.getByDataForm("ASF03OGR")
                    .should("be.visible")
                    .then(() => {
                      if (results["TYFLGL"] === "LNEAR") {
                        cy.getBySel("RTLNSC")
                          .should("be.visible")
                          .click();
                        cy.contains(fetchGpData.dataToTypeManager["RTLNSC"]).click();
                      } else if (results["TYFLGL"] === "GRADE") {
                        cy.getBySel("RTGRGL")
                          .should("be.visible")
                          .click();
                        cy.contains(fetchGpData.dataToTypeManager["RTGRGL"]).click();
                      } else if (results["TYFLGL"] === "PRCNT") {
                        cy.getBySel("RTPRGL")
                          .should("be.visible")
                          .type(fetchGpData.dataToTypeManager["PRCNT"]);
                      }
                    });
                }
                if (results["FLSKEV"] === "1") {
                  cy.get(".subtitle-container")
                    .contains("Skills")
                    .should("be.visible");

                  cy.getByDataForm("ASF036AS").should("be.visible");
                  const lengthZY36 = getLengthFromData(data, "ZY36");
                  cy.getRecordsFromTable("ZY36")
                    .invoke("text")
                    .should("eq", lengthZY36)
                    .then(() => {
                      if (lengthZY36 > 0) {
                        cy.get(".table-body")
                          .eq(1)
                          .find('[data-test-id="paginated-table-row"]')
                          .eq(0)
                          .find(".table-cell")
                          .eq(0)
                          .click();

                        cy.getBySel("VAMART")
                          .should("be.visible")
                          .click();
                        cy.contains("li", fetchGpData.dataToTypeManager["VAMART"]).click();

                        cy.getBySel("FLIMPO")
                          .should("be.visible")
                          .click();
                        cy.contains("li", fetchGpData.dataToTypeManager["FLIMPO"]).click();

                        cy.getBySel("data-submit")
                          .should("be.visible")
                          .contains("Edit")
                          .click();
                        cy.wait(2000);
                      }
                    });
                }
                if (results["FLDEVP"] === "1") {
                  cy.get(".subtitle-container")
                    .contains("Training history")
                    .scrollIntoView()
                    .should("be.visible");
                  cy.getByDataForm("ASF04AP0").should("be.visible");
                  const lengthZYA4 = getLengthFromData(data, "ZYA4");
                  cy.getRecordsFromTable("ZYA4")
                    .invoke("text")
                    .should("eq", lengthZYA4);
                }
              });

              cy.get(".subtitle-container")
                .contains("Add document")
                .should("be.visible");

              uploadFile("BLOB01", fetchGpData.dataToTypeManager["BLOB01"]).then(() => {
                cy.wait(2000);
              });

              cy.getBySel("button-next")
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 2

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF03OCP")
                .should("be.visible")
                .then(() => {
                  if (results["FLCOPR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Competences")
                      .should("be.visible");
                    cy.getByDataForm("ASF03LA0").should("be.visible");

                    if (results["FLSLAP"] === "1") {
                      const radioButtonsID = [
                        "RTE101",
                        "RTM101",
                        "RTE102",
                        "RTM102",
                        "RTE103",
                        "RTM103",
                        "RTE104",
                        "RTM104",
                        "RTE105",
                        "RTM105",
                        "RTE106",
                        "RTM106",
                        "RTE107",
                        "RTM107",
                        "RTE108",
                        "RTM108",
                        "RTE109",
                        "RTM109",
                        "RTE110",
                        "RTM110",
                        "RTE111",
                        "RTM111",
                        "RTE112",
                        "RTM112"
                      ];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible");
                        cy.get("input[value='5']").click();
                      });
                    } else if (results["FLSLAP"] === "0") {
                      const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible")
                          .find("input[value='5']")
                          .click();
                      });
                    }
                  }
                  if (results["FLMBWI"] === "1") {
                    cy.getByDataForm("ASF03WGS")
                      .should("be.visible")
                      .then(() => {
                        cy.get(".subtitle-container")
                          .contains("International mobility")
                          .scrollIntoView()
                          .should("be.visible");
                        checkTableTemplate(tableTemplate1, results);

                        cy.get(".subtitle-container")
                          .contains("Internal mobility")
                          .scrollIntoView()
                          .should("be.visible");
                        checkTableTemplate(tableTemplate2, results);
                      });

                    cy.get(".subtitle-container")
                      .contains("Career Mobility")
                      .scrollIntoView()
                      .should("be.visible");

                    const lengthZY3H = getLengthFromData(data, "ZY3H");
                    cy.getRecordsFromTable("ZY3H")
                      .invoke("text")
                      .should("eq", lengthZY3H)
                      .then(() => {
                        if (lengthZY3H > 0) {
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
                    const TYTIFR = fetchGpData.dataToTypeManager["TYTIFR"];
                    cy.getBySel("TYTIFR")
                      .should("be.visible")
                      .click();
                    cy.contains("li", TYTIFR).click();

                    cy.getBySel("NBSCRK")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["NBSCRK"]);

                    const IDJB00 = fetchGpData.dataToTypeManager["IDJB00"];
                    cy.getBySel("IDJB00")
                      .should("be.visible")
                      .click();
                    cy.contains("li", IDJB00).click();

                    const GPEM00 = fetchGpData.dataToTypeManager["GPEM00"];
                    cy.getBySel("GPEM00")
                      .should("be.visible")
                      .click();
                    cy.contains("li", GPEM00).click();

                    const IDARIN = fetchGpData.dataToTypeManager["IDARIN"];
                    cy.getBySel("IDARIN")
                      .should("be.visible")
                      .click();
                    cy.contains("li", IDARIN).click();

                    cy.getBySel("data-submit")
                      .should("be.visible")
                      .contains("Add")
                      .click();

                    cy.get(".subtitle-container")
                      .contains("Comment of the requester")
                      .should("be.visible");

                    cy.getBySel("TXCOMM")
                      .should("be.visible")
                      .then(comment => {
                        if (comment.val() != "") {
                          cy.wrap(comment)
                            .clear()
                            .type(fetchGpData.dataToTypeManager["TXCOMM"]);
                        } else {
                          cy.wrap(comment).type(fetchGpData.dataToTypeManager["TXCOMM"]);
                        }
                      });
                  }
                });

              cy.getBySel("button-next")
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 3

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF03OCP")
                .should("be.visible")
                .then(() => {
                  if (results["FLTKEV"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Tasks")
                      .should("be.visible");
                    cy.getByDataForm("ASF03MTK").should("be.visible");
                  }
                  if (results["FLSCTK"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Overall rating tasks")
                      .should("be.visible");
                    cy.getByDataForm("ASF03OTR")
                      .should("be.visible")
                      .then(() => {
                        if (results["TYFLTK"] === "LNEAR") {
                          cy.getBySel("RTLNTK")
                            .should("be.visible")
                            .type(fetchGpData.dataToTypeManager["RTGRTS"]);
                        } else if (results["TYFLTK"] === "GRADE") {
                          cy.getBySel("RTGRTS")
                            .should("be.visible")
                            .type(fetchGpData.dataToTypeManager["RTGRTS"]);
                        } else if (results["TYFLTK"] === "PRCNT") {
                          cy.getBySel("RTPRTS")
                            .should("be.visible")
                            .type(fetchGpData.dataToTypeManager["RTPRTS"]);
                        }
                      });
                  }
                  if (results["FLQUES"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Questions")
                      .should("be.visible");
                    cy.getByDataForm("ASF04NQM").should("be.visible");
                    const lengthZY4N = getLengthFromData(data, "ZY4N");
                    cy.getRecordsFromTable("ZY4N")
                      .invoke("text")
                      .should("eq", lengthZY4N);
                  }
                  if (results["FLOWPO"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Mentoring period")
                      .should("be.visible");
                    cy.getByDataForm("ASF063GS").should("be.visible");
                    cy.get(".date-box[data-test-id='DTBG00'] input")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["DTBG00"]);
                    cy.get(".date-box[data-test-id='DTEN00'] input")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["DTEN00"]);
                    cy.getBySel("STMENT")
                      .should("be.visible")
                      .select(fetchGpData.dataToTypeManager["STMENT"]);
                  }
                  if (results["FLPFCR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Other criteria")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.getByDataForm("ASF04TOC").should("be.visible");
                    const lengthZY4T = getLengthFromData(data, "ZY4T");
                    cy.getRecordsFromTable("ZY4T")
                      .invoke("text")
                      .should("eq", lengthZY4T);

                    cy.getBySel("add-button")
                      .eq(0)
                      .should("be.visible")
                      .click();
                    cy.getBySel("TXCRSH")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXCRSH"]);
                    cy.getBySel("TXCRLG")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXCRLG"]);
                    cy.getBySel("RTMANA")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["RTMANA"]);
                    cy.getBySel("TXCOMM")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXCOMM2"]);

                    cy.getBySel("data-submit")
                      .should("be.visible")
                      .contains("Add")
                      .click();
                  }
                });

              cy.getBySel("button-next")
                .scrollIntoView()
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 4

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .should("be.visible");

              cy.getByDataForm("ASF03OCP").should("be.visible");

              cy.get(".subtitle-container")
                .contains("Comments and overall performance evaluation")
                .should("be.visible");

              cy.getByDataForm("ASF03OFR")
                .should("be.visible")
                .then(() => {
                  if (results["TYFLSC"] === "LNEAR") {
                    cy.getBySel("RTLNEM")
                      .should("be.visible")
                      .click();
                    cy.contains(fetchGpData.dataToTypeManager["RTLNEM"]).click();
                  } else if (results["TYFLSC"] === "GRADE") {
                    cy.getBySel("RTGRFN")
                      .should("be.visible")
                      .click();
                    cy.contains(fetchGpData.dataToTypeManager["RTGRFN"]).click();
                  } else if (results["TYFLSC"] === "PRCNT") {
                    cy.getBySel("RTPRFN")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["RTPRFN"]);
                  }
                  if (results["FLSLAP"] === "1") {
                    cy.getBySel("TXEMCM")
                      .should("be.visible")
                      .type(fetchGpData.dataToTypeManager["TXEMCM"]);
                  }
                });

              cy.getBySel("TXRWCM")
                .should("be.visible")
                .type(fetchGpData.dataToTypeManager["TXRWCM"]);

              cy.getBySel("button-next")
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 5

              cy.window()
                .its("modifiedDataContext")
                .then(context => {
                  const modifiedData = context.state.modifiedData;
                  const modifiedResults = getValueFromData(modifiedData, fetchGpData.dataSearch, true);

                  cy.get(".subtitle-container")
                    .contains("Basic Data")
                    .should("be.visible");

                  cy.getByDataForm("ASF03OCP")
                    .should("be.visible")
                    .then(() => {
                      if (results["FLEVOB"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Objectives")
                          .should("be.visible");
                        cy.getByDataForm("ASF03NG4").should("be.visible");
                        const lengthZY3N = getLengthFromData(modifiedData, "ZY3N");
                        cy.getRecordsFromTable("ZY3N")
                          .invoke("text")
                          .should("eq", lengthZY3N);
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
                            .should("be.visible")
                            .invoke("text")
                            .should("eq", modifiedResults["BLOB01"]);
                        }
                      });

                      if (results["FLSCRT"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Overall rating for objectives")
                          .scrollIntoView()
                          .should("be.visible");
                        cy.getByDataForm("ASF03OG0").should("be.visible");
                        if (results["TYFLGL"] === "LNEAR") {
                          cy.getBySel("RTLNSC")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTLNSC_EXT"]);
                        } else if (results["TYFLGL"] === "GRADE") {
                          cy.getBySel("RTGRGL")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTGRGL_EXT"]);
                        } else if (results["TYFLGL"] === "PRCNT") {
                          cy.getBySel("RTPRGL")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTPRGL"]);
                        }
                      }
                      if (results["FLSKEV"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Skills")
                          .scrollIntoView()
                          .should("be.visible");

                        cy.getByDataForm("ASF036AS").should("be.visible");
                        const lengthZY36 = getLengthFromData(modifiedData, "ZY36");
                        cy.getRecordsFromTable("ZY36")
                          .invoke("text")
                          .should("eq", lengthZY36);
                      }
                      if (results["FLCOPR"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Competences")
                          .should("be.visible");
                        cy.getByDataForm("ASF03LAS").should("be.visible");
                        if (results["FLSLAP"] === "1") {
                          const radioButtonsID = [
                            "RTE101",
                            "RTM101",
                            "RTE102",
                            "RTM102",
                            "RTE103",
                            "RTM103",
                            "RTE104",
                            "RTM104",
                            "RTE105",
                            "RTM105",
                            "RTE106",
                            "RTM106",
                            "RTE107",
                            "RTM107",
                            "RTE108",
                            "RTM108",
                            "RTE109",
                            "RTM109",
                            "RTE110",
                            "RTM110",
                            "RTE111",
                            "RTM111",
                            "RTE112",
                            "RTM112"
                          ];

                          radioButtonsID.forEach(id => {
                            cy.getBySel(id)
                              .scrollIntoView()
                              .should("be.visible")
                              .find("[checked]")
                              .should("have.value", modifiedResults[id]);
                          });
                        } else if (results["FLSLAP"] === "0") {
                          const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                          radioButtonsID.forEach(id => {
                            cy.getBySel(id)
                              .scrollIntoView()
                              .should("be.visible")
                              .find("[checked]")
                              .should("have.value", modifiedResults[id]);
                          });
                        }
                      }
                      if (results["FLTKEV"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Tasks")
                          .should("be.visible");
                        cy.getByDataForm("ASF03MT0").should("be.visible");
                        const lengthZY3M = getLengthFromData(modifiedData, "ZY3M");
                        cy.getRecordsFromTable("ZY3M")
                          .invoke("text")
                          .should("eq", lengthZY3M);
                      }
                      if (results["FLSCTK"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Overall rating for tasks")
                          .should("be.visible");
                        cy.getByDataForm("ASF03OTR").should("be.visible");

                        cy.getByDataForm("ASF03OTR").should("be.visible");
                        if (results["TYFLTK"] === "LNEAR") {
                          cy.getBySel("RTLNTK")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTLNTK"]);
                        } else if (results["TYFLTK"] === "GRADE") {
                          cy.getBySel("RTGRTS")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTGRTS"]);
                        } else if (results["TYFLTK"] === "PRCNT") {
                          cy.getBySel("RTPRTS")
                            .should("be.visible")
                            .should("have.value", modifiedResults["RTPRTS"]);
                        }
                      }
                      if (results["FLQUES"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Questions")
                          .scrollIntoView()
                          .should("be.visible");
                        cy.getByDataForm("ASF04NQ0").should("be.visible");
                        const lengthZY4N = getLengthFromData(modifiedData, "ZY4N");
                        cy.getRecordsFromTable("ZY4N")
                          .invoke("text")
                          .should("eq", lengthZY4N);
                      }
                      if (results["FLPFCR"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Other criteria")
                          .should("be.visible");
                        cy.getByDataForm("ASF04TOC").should("be.visible");
                        const lengthZY4T = getLengthFromData(modifiedData, "ZY4T");
                        cy.getRecordsFromTable("ZY4T")
                          .invoke("text")
                          .should("eq", lengthZY4T);
                      }
                      if (results["FLMBWI"] === "1") {
                        cy.getByDataForm("ASF03WG0")
                          .scrollIntoView()
                          .should("be.visible")
                          .then(() => {
                            cy.get(".subtitle-container")
                              .contains("International mobility")
                              .scrollIntoView()
                              .should("be.visible");

                            checkTableTemplate(tableTemplate1, modifiedResults);

                            cy.get(".subtitle-container")
                              .contains("Internal mobility")
                              .scrollIntoView()
                              .should("be.visible");

                            checkTableTemplate(tableTemplate2, modifiedResults);
                          });

                        cy.get(".subtitle-container")
                          .contains("Career Mobility")
                          .scrollIntoView()
                          .should("be.visible");

                        const lengthZY3H = getLengthFromData(modifiedData, "ZY3H");
                        cy.getRecordsFromTable("ZY3H")
                          .invoke("text")
                          .should("eq", lengthZY3H);

                        cy.get(".subtitle-container")
                          .contains("Comment of the requester")
                          .should("be.visible");

                        cy.getBySel("TXCOMM")
                          .should("be.visible")
                          .should("have.value", modifiedResults["TXCOMM"]);
                      }
                      if (results["FLOWPO"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Mentoring period")
                          .should("be.visible");
                        cy.getByDataForm("ASF063GS").should("be.visible");
                        cy.get(".date-box[data-test-id='DTBG00'] input")
                          .should("be.visible")
                          .should("have.value", modifiedResults["DTBG00"]);
                        cy.get(".date-box[data-test-id='DTEN00'] input")
                          .should("be.visible")
                          .should("have.value", modifiedResults["DTEN00"]);
                        cy.getBySel("STMENT")
                          .should("be.visible")
                          .should("have.value", modifiedResults["STMENT"]);
                      }
                      cy.get(".subtitle-container")
                        .contains("Comments and overall performance evaluation")
                        .should("be.visible");
                      cy.getByDataForm("ASF03OF0")
                        .should("be.visible")
                        .then(() => {
                          if (results["TYFLSC"] === "LNEAR") {
                            cy.getBySel("RTLNEM")
                              .should("be.visible")
                              .should("have.value", modifiedResults["RTLNEM_EXT"]);
                          } else if (results["TYFLSC"] === "GRADE") {
                            cy.getBySel("RTGRFN")
                              .should("be.visible")
                              .should("have.value", modifiedResults["RTGRFN_EXT"]);
                          } else if (results["TYFLSC"] === "PRCNT") {
                            cy.getBySel("RTPRFN")
                              .should("be.visible")
                              .should("have.value", modifiedResults["RTPRFN"]);
                          }
                          if (results["FLSLAP"] === "1") {
                            cy.getBySel("TXEMCM")
                              .should("be.visible")
                              .should("have.value", modifiedResults["TXEMCM"]);
                          }
                          cy.getBySel("TXRWCM")
                            .should("be.visible")
                            .should("have.value", modifiedResults["TXRWCM"]);
                        });

                      if (results["FLDEVP"] === "1") {
                        cy.get(".subtitle-container")
                          .contains("Training history")
                          .should("be.visible");
                        cy.getByDataForm("ASF04AP0").should("be.visible");
                        const lengthZYA4 = getLengthFromData(modifiedData, "ZYA4");
                        cy.getRecordsFromTable("ZYA4")
                          .invoke("text")
                          .should("eq", lengthZYA4);
                      }
                    });

                  cy.get(".subtitle-container")
                    .contains("Manager's note")
                    .scrollIntoView()
                    .should("be.visible");

                  cy.getByDataForm("ASTWT101").should("be.visible");
                  cy.getBySelFromForm("ASTWT101", "TXCOMM")
                    .should("be.visible")
                    .type(fetchGpData.dataToTypeManager["TXCOMM3"]);

                  cy.getBySel("data-submit")
                    .contains("Submit")
                    .click();
                  cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
                  cy.wait(2000);
                });
            });
          }
        });
    });

    // STEP 2

    it("should switch to employee role and validate the task", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);
      const taskLabel = "Countersign evaluation sheet of campaign";

      cy.skipOn(!hasTask);

      cy.log("STEP 2");

      if (!hasTask) return;

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

      cy.wait(2000);
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
      cy.get(".card-header")
        .should("be.visible")
        .then($header => {
          if ($header.text() != GPConfig.menuPath.name) {
            return;
          } else {
            cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
              const data = body.occurrences.occurrence;
              const results = getValueFromData(data, fetchGpData.dataSearch);
              const results2 = getValueFromData(data, fetchGpData.dataSearchEmployee);

              // PHASE 1

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .should("be.visible");

              cy.getByDataForm("ASF03OCP")
                .should("be.visible")
                .then(() => {
                  if (results["FLEVOB"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Objectives")
                      .should("be.visible");

                    cy.getByDataForm("ASF03NCS").should("be.visible");
                    const lengthZY3N = getLengthFromData(data, "ZY3N");
                    cy.getRecordsFromTable("ZY3N")
                      .invoke("text")
                      .should("eq", lengthZY3N);
                  }
                  if (results["FLSCRT"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Overall rating for objectives")
                      .should("be.visible");
                    cy.getByDataForm("ASF03OGR").should("be.visible");
                    if (results["TYFLGL"] === "LNEAR") {
                      cy.getBySel("RTLNSC")
                        .should("be.visible")
                        .should("have.value", results["RTLNSC_EXT"]);
                    } else if (results["TYFLGL"] === "GRADE") {
                      cy.getBySel("RTGRGL")
                        .should("be.visible")
                        .should("have.value", results["RTGRGL_EXT"]);
                    } else if (results["TYFLGL"] === "PRCNT") {
                      cy.getBySel("RTPRGL")
                        .should("be.visible")
                        .should("have.value", results["RTPRGL"]);
                    }
                  }
                  if (results["FLEVOB"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Skills")
                      .should("be.visible");
                    cy.getByDataForm("ASF036AS").should("be.visible");
                    const lengthZY36 = getLengthFromData(data, "ZY36");
                    cy.getRecordsFromTable("ZY36")
                      .invoke("text")
                      .should("eq", lengthZY36);
                  }
                  if (results["FLDEVP"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Training history")
                      .scrollIntoView()
                      .should("be.visible");

                    cy.getByDataForm("ASF04AP0").should("be.visible");
                    const lengthZYA4 = getLengthFromData(data, "ZYA4");
                    cy.getRecordsFromTable("ZYA4")
                      .invoke("text")
                      .should("eq", lengthZYA4);
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
                        .should("be.visible")
                        .invoke("text")
                        .should("eq", results["BLOB01"]);
                    }
                  });
                });

              cy.getBySel("button-next")
                .scrollIntoView()
                .should("be.visible")
                .click();

              // PHASE 2

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF03OCP")
                .should("be.visible")
                .then(() => {
                  if (results["FLCOPR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Competences")
                      .should("be.visible");

                    cy.getByDataForm("ASF03LA0").should("be.visible");

                    if (results["FLSLAP"] === "1") {
                      const radioButtonsID = [
                        "RTE101",
                        "RTM101",
                        "RTE102",
                        "RTM102",
                        "RTE103",
                        "RTM103",
                        "RTE104",
                        "RTM104",
                        "RTE105",
                        "RTM105",
                        "RTE106",
                        "RTM106",
                        "RTE107",
                        "RTM107",
                        "RTE108",
                        "RTM108",
                        "RTE109",
                        "RTM109",
                        "RTE110",
                        "RTM110",
                        "RTE111",
                        "RTM111",
                        "RTE112",
                        "RTM112"
                      ];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible")
                          .find("[checked]")
                          .should("have.value", results[id]);
                      });
                    } else if (results["FLSLAP"] === "0") {
                      const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible")
                          .find("[checked]")
                          .should("have.value", results[id]);
                      });
                    }
                  }

                  if (results["FLMBWI"] === "1") {
                    cy.getByDataForm("ASF03WGS")
                      .should("be.visible")
                      .then(() => {
                        cy.get(".subtitle-container")
                          .contains("International mobility")
                          .scrollIntoView()
                          .should("be.visible");

                        checkTableTemplate(tableTemplate1, results);

                        cy.get(".subtitle-container")
                          .contains("Internal mobility")
                          .scrollIntoView()
                          .should("be.visible");

                        checkTableTemplate(tableTemplate2, results);
                      });

                    cy.get(".subtitle-container")
                      .contains("Career Mobility")
                      .scrollIntoView()
                      .should("be.visible");

                    const lengthZY3H = getLengthFromData(data, "ZY3H");
                    cy.getRecordsFromTable("ZY3H")
                      .invoke("text")
                      .should("eq", lengthZY3H);

                    cy.get(".subtitle-container")
                      .contains("Comment of the requester")
                      .should("be.visible");

                    cy.getBySel("TXCOMM")
                      .should("be.visible")
                      .should("have.value", results["TXCOMM"]);
                  }
                });

              cy.getBySel("button-next")
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 3

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .scrollIntoView()
                .should("be.visible")
                .then(() => {
                  if (results["FLTKEV"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Tasks")
                      .should("be.visible");

                    cy.getByDataForm("ASF03MTK").should("be.visible");
                    const lengthZY3M = getLengthFromData(data, "ZY3M");
                    cy.getRecordsFromTable("ZY3M")
                      .invoke("text")
                      .should("eq", lengthZY3M);
                  }
                  if (results["FLSCTK"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Overall rating tasks")
                      .should("be.visible");

                    cy.getByDataForm("ASF03OTR").should("be.visible");

                    if (results["TYFLTK"] === "LNEAR") {
                      cy.getBySel("RTLNTK")
                        .should("be.visible")
                        .should("have.value", results["RTLNTK_EXT"]);
                    } else if (results["TYFLTK"] === "GRADE") {
                      cy.getBySel("RTGRTS")
                        .should("be.visible")
                        .should("have.value", results["RTGRTS_EXT"]);
                    } else if (results["TYFLTK"] === "PRCNT") {
                      cy.getBySel("RTPRTS")
                        .should("be.visible")
                        .should("have.value", results["RTPRTS"]);
                    }
                  }
                  if (results["FLQUES"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Questions")
                      .should("be.visible");

                    cy.getByDataForm("ASF04NQM").should("be.visible");
                    const lengthZY4N = getLengthFromData(data, "ZY4N");
                    cy.getRecordsFromTable("ZY4N")
                      .invoke("text")
                      .should("eq", lengthZY4N);
                  }
                  if (results["FLOWPO"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Mentoring period")
                      .should("be.visible");

                    cy.getByDataForm("ASF063GS").should("be.visible");

                    cy.get(".date-box[data-test-id='DTBG00'] input")
                      .should("be.visible")
                      .should("have.value", results["DTBG00"]);
                    cy.get(".date-box[data-test-id='DTEN00'] input")
                      .should("be.visible")
                      .should("have.value", results["DTEN00"]);
                    cy.getBySel("STMENT")
                      .should("be.visible")
                      .should("have.value", results["STMENT"]);
                  }
                  if (results["FLPFCR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Other criteria")
                      .should("be.visible");

                    cy.getByDataForm("ASF04TOC").should("be.visible");

                    const lengthZY4T = getLengthFromData(data, "ZY4T");
                    cy.getRecordsFromTable("ZY4T")
                      .invoke("text")
                      .should("eq", lengthZY4T);
                  }
                });

              cy.getBySel("button-next")
                .scrollIntoView()
                .should("be.visible")
                .click();

              // PHASE 4

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .should("be.visible");

              cy.getByDataForm("ASF03OCP").should("be.visible");

              cy.get(".subtitle-container")
                .contains("Comments and overall performance evaluation")
                .should("be.visible");

              cy.getByDataForm("ASF03OFR")
                .should("be.visible")
                .then(() => {
                  if (results["TYFLSC"] === "LNEAR") {
                    cy.getBySel("RTLNEM")
                      .should("be.visible")
                      .should("have.value", results["RTLNEM_EXT"]);
                  } else if (results["TYFLSC"] === "GRADE") {
                    cy.getBySel("RTGRFN")
                      .should("be.visible")
                      .should("have.value", results["RTGRFN_EXT"]);
                  } else if (results["TYFLSC"] === "PRCNT") {
                    cy.getBySel("RTPRFN")
                      .should("be.visible")
                      .should("have.value", results["RTPRFN"]);
                  }
                  if (results["FLSLAP"] === "1") {
                    cy.getBySel("TXEMCM")
                      .should("be.visible")
                      .should("have.value", results["TXEMCM"]);
                  }
                  cy.getBySel("TXRWCM")
                    .should("be.visible")
                    .should("have.value", results["TXRWCM"]);
                });

              cy.getBySel("button-next")
                .should("be.visible")
                .click();
              cy.wait(2000);

              // PHASE 5

              cy.get(".subtitle-container")
                .contains("Basic Data")
                .should("be.visible")
                .then(() => {
                  if (results["FLEVOB"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Objectives")
                      .should("be.visible");

                    cy.getByDataForm("ASF03NG4").should("be.visible");

                    const lengthZY3N = getLengthFromData(data, "ZY3N");
                    cy.getRecordsFromTable("ZY3N")
                      .invoke("text")
                      .should("eq", lengthZY3N);
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
                        .should("be.visible")
                        .invoke("text")
                        .should("eq", results["BLOB01"]);
                    }
                  });

                  if (results["FLSCRT"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Overall rating for objectives")
                      .scrollIntoView()
                      .should("be.visible")
                      .then(() => {
                        cy.getByDataForm("ASF03OG0").should("be.visible");
                        if (results["TYFLGL"] === "LNEAR") {
                          cy.getBySel("RTLNSC")
                            .should("be.visible")
                            .should("have.value", results["RTLNSC_EXT"]);
                        } else if (results["TYFLGL"] === "GRADE") {
                          cy.getBySel("RTGRGL")
                            .should("be.visible")
                            .should("have.value", results["RTGRGL_EXT"]);
                        } else if (results["TYFLGL"] === "PRCNT") {
                          cy.getBySel("RTPRGL")
                            .should("be.visible")
                            .should("have.value", results["RTPRGL"]);
                        }
                      });
                  }

                  if (results["FLSKEV"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Skills")
                      .scrollIntoView()
                      .should("be.visible");

                    cy.getByDataForm("ASF036AS").should("be.visible");

                    const lengthZY36 = getLengthFromData(data, "ZY36");
                    cy.getRecordsFromTable("ZY36")
                      .invoke("text")
                      .should("eq", lengthZY36);
                  }

                  if (results["FLCOPR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Competences")
                      .should("be.visible");

                    cy.getByDataForm("ASF03LAS").should("be.visible");

                    if (results["FLSLAP"] === "1") {
                      const radioButtonsID = [
                        "RTE101",
                        "RTM101",
                        "RTE102",
                        "RTM102",
                        "RTE103",
                        "RTM103",
                        "RTE104",
                        "RTM104",
                        "RTE105",
                        "RTM105",
                        "RTE106",
                        "RTM106",
                        "RTE107",
                        "RTM107",
                        "RTE108",
                        "RTM108",
                        "RTE109",
                        "RTM109",
                        "RTE110",
                        "RTM110",
                        "RTE111",
                        "RTM111",
                        "RTE112",
                        "RTM112"
                      ];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible")
                          .find("[checked]")
                          .should("have.value", results[id]);
                      });
                    } else if (results["FLSLAP"] === "0") {
                      const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                      radioButtonsID.forEach(id => {
                        cy.getBySel(id)
                          .scrollIntoView()
                          .should("be.visible")
                          .find("[checked]")
                          .should("have.value", results[id]);
                      });
                    }
                  }

                  if (results["FLTKEV"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Tasks")
                      .should("be.visible");

                    cy.getByDataForm("ASF03MT0").should("be.visible");

                    const lengthZY3M = getLengthFromData(data, "ZY3M");
                    cy.getRecordsFromTable("ZY3M")
                      .invoke("text")
                      .should("eq", lengthZY3M);
                  }

                  if (results["FLSCTK"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Overall rating for tasks")
                      .should("be.visible");

                    cy.getByDataForm("ASF03OTR").should("be.visible");

                    if (results["TYFLTK"] === "LNEAR") {
                      cy.getBySel("RTLNTK")
                        .should("be.visible")
                        .should("have.value", results["RTLNTK_EXT"]);
                    } else if (results["TYFLTK"] === "GRADE") {
                      cy.getBySel("RTGRTS")
                        .should("be.visible")
                        .should("have.value", results["RTGRTS_EXT"]);
                    } else if (results["TYFLTK"] === "PRCNT") {
                      cy.getBySel("RTPRTS")
                        .should("be.visible")
                        .should("have.value", results["RTPRTS"]);
                    }
                  }

                  if (results["FLQUES"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Questions")
                      .should("be.visible");

                    cy.getByDataForm("ASF04NQ0").should("be.visible");

                    const lengthZY4N = getLengthFromData(data, "ZY4N");
                    cy.getRecordsFromTable("ZY4N")
                      .invoke("text")
                      .should("eq", lengthZY4N);
                  }

                  if (results["FLPFCR"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Other criteria")
                      .should("be.visible");

                    cy.getByDataForm("ASF04TOC").should("be.visible");

                    const lengthZY4T = getLengthFromData(data, "ZY4T");
                    cy.getRecordsFromTable("ZY4T")
                      .invoke("text")
                      .should("eq", lengthZY4T);
                  }

                  if (results["FLMBWI"] === "1") {
                    cy.getByDataForm("ASF03WG0")
                      .scrollIntoView()
                      .should("be.visible")
                      .then(() => {
                        cy.get(".subtitle-container")
                          .contains("International mobility")
                          .should("be.visible");

                        checkTableTemplate(tableTemplate1, results);

                        cy.get(".subtitle-container")
                          .contains("Internal mobility")
                          .should("be.visible");

                        checkTableTemplate(tableTemplate2, results);
                      });

                    cy.get(".subtitle-container")
                      .contains("Career Mobility")
                      .scrollIntoView()
                      .should("be.visible");

                    const lengthZY3H = getLengthFromData(data, "ZY3H");
                    cy.getRecordsFromTable("ZY3H")
                      .invoke("text")
                      .should("eq", lengthZY3H);

                    cy.get(".subtitle-container")
                      .contains("Comment of the requester")
                      .should("be.visible");

                    cy.getBySel("TXCOMM")
                      .should("be.visible")
                      .should("have.value", results["TXCOMM"]);
                  }
                });

              cy.get(".subtitle-container")
                .contains("Comments and overall performance evaluation")
                .should("be.visible");

              cy.getByDataForm("ASF03OF0")
                .should("be.visible")
                .then(() => {
                  if (results["TYFLSC"] === "LNEAR") {
                    cy.getBySel("RTLNEM")
                      .should("be.visible")
                      .should("have.value", results["RTLNEM_EXT"]);
                  } else if (results["TYFLSC"] === "GRADE") {
                    cy.getBySel("RTGRFN")
                      .should("be.visible")
                      .should("have.value", results["RTGRFN_EXT"]);
                  } else if (results["TYFLSC"] === "PRCNT") {
                    cy.getBySel("RTPRFN")
                      .should("be.visible")
                      .should("have.value", results["RTPRFN"]);
                  }
                  if (results["FLSLAP"] === "1") {
                    cy.getBySel("TXEMCM")
                      .should("be.visible")
                      .should("have.value", results["TXEMCM"]);
                  }
                  cy.getBySel("TXRWCM")
                    .should("be.visible")
                    .should("have.value", results["TXRWCM"]);
                })
                .then(() => {
                  if (results["FLDEVP"] === "1") {
                    cy.get(".subtitle-container")
                      .contains("Training history")
                      .scrollIntoView()
                      .should("be.visible");

                    cy.getByDataForm("ASF04AP0").should("be.visible");
                    const lengthZYA4 = getLengthFromData(data, "ZYA4");
                    cy.getRecordsFromTable("ZYA4")
                      .invoke("text")
                      .should("eq", lengthZYA4);
                  }
                });

              cy.get(".subtitle-container")
                .contains("Manager's note")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASTWT101").should("be.visible");
              cy.getBySelFromForm("ASTWT101", "TXCOMM")
                .should("be.visible")
                .should("have.value", results2["TXCOMM"]);

              cy.getByDataForm("ASTWT1A5").should("be.visible");
              cy.getBySel("STATUX")
                .should("be.visible")
                .select(fetchGpData.dataToTypeEmployee["STATUX"]);
              cy.getBySelFromForm("ASTWT1A5", "TXCOMM")
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

    // STEP 3

    it("should switch to manager role and validate the task", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks/**&gpId=${GPConfig.id}`, method: "GET" }).as(`${GPConfig.id}`);
      const taskLabel = "comments after he/she countersigned";

      cy.log("STEP 3");

      cy.skipOn(!hasTask);

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
          cy.getBySel("table-body").should("be.visible");
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible");
          cy.contains(".table-cell", taskLabel).click();
        });
      cy.get(".card-header")
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.wait(2000);

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);
        const results2 = getValueFromData(data, fetchGpData.dataSearchEmployee);
        const results3 = getValueFromData(data, fetchGpData.dataSearchManager);

        // PHASE 1

        cy.get(".subtitle-container")
          .contains("Basic Data")
          .should("be.visible");

        cy.getByDataForm("ASF03OCP").should("be.visible");

        cy.get(".subtitle-container")
          .contains("Objectives")
          .should("be.visible");

        cy.getByDataForm("ASF03NBS").should("be.visible");
        const lengthZY3N = getLengthFromData(data, "ZY3N");
        cy.getRecordsFromTable("ZY3N")
          .invoke("text")
          .should("eq", lengthZY3N)
          .then(() => {
            if (results["FLSCRT"] === "1") {
              cy.get(".subtitle-container")
                .contains("Overall rating for objectives")
                .should("be.visible");

              cy.getByDataForm("ASF03OGR").should("be.visible");
              if (results["TYFLGL"] === "LNEAR") {
                cy.getBySel("RTLNSC")
                  .should("be.visible")
                  .should("have.value", results["RTLNSC_EXT"]);
              } else if (results["TYFLGL"] === "GRADE") {
                cy.getBySel("RTGRGL")
                  .should("be.visible")
                  .should("have.value", results["RTGRGL_EXT"]);
              } else if (results["TYFLGL"] === "PRCNT") {
                cy.getBySel("RTPRGL")
                  .should("be.visible")
                  .should("have.value", results["RTPRGL"]);
              }
            }

            if (results["FLSKEV"] === "1") {
              cy.get(".subtitle-container")
                .contains("Skills")
                .should("be.visible");

              cy.getByDataForm("ASF036AS").should("be.visible");
              const lengthZY36 = getLengthFromData(data, "ZY36");
              cy.getRecordsFromTable("ZY36")
                .invoke("text")
                .should("eq", lengthZY36);
            }

            if (results["FLDEVP"] === "1") {
              cy.get(".subtitle-container")
                .contains("Training history")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF04AP0").should("be.visible");
              const lengthZYA4 = getLengthFromData(data, "ZYA4");
              cy.getRecordsFromTable("ZYA4")
                .invoke("text")
                .should("eq", lengthZYA4);
            }
          });

        cy.get(".subtitle-container")
          .contains("Add document")
          .scrollIntoView()
          .should("be.visible");

        cy.get('[data-test-id="ZY3O"]').then(blob => {
          if (blob.find('[data-test-id="file-blob-name"]').length === 0) {
            return;
          } else {
            cy.getBlobnameFromDataSection("ZY3O")
              .should("be.visible")
              .invoke("text")
              .should("eq", results["BLOB01"]);
          }
        });

        cy.getBySel("button-next")
          .should("be.visible")
          .click();
        cy.wait(2000);

        // PHASE 2

        cy.get(".subtitle-container")
          .contains("Basic Data")
          .scrollIntoView()
          .should("be.visible");

        cy.getByDataForm("ASF03OCP")
          .should("be.visible")
          .then(() => {
            if (results["FLCOPR"] === "1") {
              cy.get(".subtitle-container")
                .contains("Competences")
                .should("be.visible");

              cy.getByDataForm("ASF03LA0").should("be.visible");

              if (results["FLSLAP"] === "1") {
                const radioButtonsID = [
                  "RTE101",
                  "RTM101",
                  "RTE102",
                  "RTM102",
                  "RTE103",
                  "RTM103",
                  "RTE104",
                  "RTM104",
                  "RTE105",
                  "RTM105",
                  "RTE106",
                  "RTM106",
                  "RTE107",
                  "RTM107",
                  "RTE108",
                  "RTM108",
                  "RTE109",
                  "RTM109",
                  "RTE110",
                  "RTM110",
                  "RTE111",
                  "RTM111",
                  "RTE112",
                  "RTM112"
                ];

                radioButtonsID.forEach(id => {
                  cy.getBySel(id)
                    .scrollIntoView()
                    .should("be.visible")
                    .find("[checked]")
                    .should("have.value", results[id]);
                });
              } else if (results["FLSLAP"] === "0") {
                const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                radioButtonsID.forEach(id => {
                  cy.getBySel(id)
                    .scrollIntoView()
                    .should("be.visible")
                    .find("[checked]")
                    .should("have.value", results[id]);
                });
              }
            }

            if (results["FLMBWI"] === "1") {
              cy.getByDataForm("ASF03WGS")
                .should("be.visible")
                .then(() => {
                  cy.get(".subtitle-container")
                    .contains("International mobility")
                    .scrollIntoView()
                    .should("be.visible");

                  checkTableTemplate(tableTemplate1, results);

                  cy.get(".subtitle-container")
                    .contains("Internal mobility")
                    .scrollIntoView()
                    .should("be.visible");

                  checkTableTemplate(tableTemplate2, results);
                });

              cy.get(".subtitle-container")
                .contains("Career Mobility")
                .scrollIntoView()
                .should("be.visible");

              const lengthZY3H = getLengthFromData(data, "ZY3H");
              cy.getRecordsFromTable("ZY3H")
                .invoke("text")
                .should("eq", lengthZY3H);

              cy.get(".subtitle-container")
                .contains("Comment of the requester")
                .should("be.visible");

              cy.getBySel("TXCOMM")
                .should("be.visible")
                .should("have.value", results["TXCOMM"]);
            }
          });

        cy.getBySel("button-next")
          .should("be.visible")
          .click();
        cy.wait(2000);

        // PHASE 3

        cy.get(".subtitle-container")
          .contains("Basic Data")
          .scrollIntoView()
          .should("be.visible");

        cy.getByDataForm("ASF03OCP")
          .should("be.visible")
          .then(() => {
            if (results["FLTKEV"] === "1") {
              cy.get(".subtitle-container")
                .contains("Tasks")
                .should("be.visible");

              cy.getByDataForm("ASF03MTK").should("be.visible");
              const lengthZY3M = getLengthFromData(data, "ZY3M");
              cy.getRecordsFromTable("ZY3M")
                .invoke("text")
                .should("eq", lengthZY3M);
            }
            if (results["FLSCTK"] === "1") {
              cy.get(".subtitle-container")
                .contains("Overall rating for tasks")
                .should("be.visible");

              cy.getByDataForm("ASF03OTR").should("be.visible");
              if (results["TYFLTK"] === "LNEAR") {
                cy.getBySel("RTLNTK")
                  .should("be.visible")
                  .should("have.value", results["RTLNTK_EXT"]);
              } else if (results["TYFLTK"] === "GRADE") {
                cy.getBySel("RTGRTS")
                  .click()
                  .should("be.visible")
                  .should("have.value", results["RTGRTS_EXT"]);
              } else if (results["TYFLTK"] === "PRCNT") {
                cy.getBySel("RTPRTS")
                  .should("be.visible")
                  .should("have.value", results["RTPRTS"]);
              }
            }
            if (results["FLQUES"] === "1") {
              cy.get(".subtitle-container")
                .contains("Questions")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF04NQM").should("be.visible");
              const lengthZY4N = getLengthFromData(data, "ZY4N");
              cy.getRecordsFromTable("ZY4N")
                .invoke("text")
                .should("eq", lengthZY4N);
            }
            if (results["FLOWPO"] === "1") {
              cy.get(".subtitle-container")
                .contains("Mentoring period")
                .should("be.visible");

              cy.getByDataForm("ASF063GS").should("be.visible");

              cy.get(".date-box[data-test-id='DTBG00'] input")
                .should("be.visible")
                .should("have.value", results["DTBG00"]);
              cy.get(".date-box[data-test-id='DTEN00'] input")
                .should("be.visible")
                .should("have.value", results["DTEN00"]);
              cy.getBySel("STMENT")
                .should("be.visible")
                .should("have.value", results["STMENT"]);
            }
            if (results["FLPFCR"] === "1") {
              cy.get(".subtitle-container")
                .contains("Other criteria")
                .should("be.visible");

              cy.getByDataForm("ASF04TOC").should("be.visible");

              const lengthZY4T = getLengthFromData(data, "ZY4T");
              cy.getRecordsFromTable("ZY4T")
                .invoke("text")
                .should("eq", lengthZY4T);
            }
          });

        cy.getBySel("button-next")
          .scrollIntoView()
          .should("be.visible")
          .click();

        // PHASE 4

        cy.get(".subtitle-container")
          .contains("Basic Data")
          .should("be.visible");

        cy.getByDataForm("ASF03OCP").should("be.visible");

        cy.get(".subtitle-container")
          .contains("Comments and overall performance evaluation")
          .should("be.visible")
          .then(() => {
            if (results["TYFLSC"] === "LNEAR") {
              cy.getBySel("RTLNEM")
                .should("be.visible")
                .should("have.value", results["RTLNEM_EXT"]);
            } else if (results["TYFLSC"] === "GRADE") {
              cy.getBySel("RTGRFN")
                .should("be.visible")
                .should("have.value", results["RTGRFN_EXT"]);
            } else if (results["TYFLSC"] === "PRCNT") {
              cy.getBySel("RTPRFN")
                .should("be.visible")
                .should("have.value", results["RTPRFN"]);
            }
            if (results["FLSLAP"] === "1") {
              cy.getBySel("TXEMCM")
                .should("be.visible")
                .should("have.value", results["TXEMCM"]);
            }
            cy.getBySel("TXRWCM")
              .should("be.visible")
              .should("have.value", results["TXRWCM"]);
          });

        cy.getBySel("button-next")
          .should("be.visible")
          .click();

        // PHASE 5

        cy.get(".subtitle-container")
          .contains("Basic Data")
          .should("be.visible");

        cy.getByDataForm("ASF03OCP")
          .should("be.visible")
          .then(() => {
            if (results["FLEVOB"] === "1") {
              cy.get(".subtitle-container")
                .contains("Objectives")
                .should("be.visible");

              cy.getByDataForm("ASF03NG4").should("be.visible");

              const lengthZY3N = getLengthFromData(data, "ZY3N");
              cy.getRecordsFromTable("ZY3N")
                .invoke("text")
                .should("eq", lengthZY3N);
            }

            cy.get(".subtitle-container")
              .contains("Add document")
              .should("be.visible");

            cy.get('[data-test-id="ZY3O"]').then(blob => {
              if (blob.find('[data-test-id="file-blob-name"]').length === 0) {
                return;
              } else {
                cy.getBlobnameFromDataSection("ZY3O")
                  .should("be.visible")
                  .invoke("text")
                  .should("eq", results["BLOB01"]);
              }
            });

            if (results["FLSCRT"] === "1") {
              cy.get(".subtitle-container")
                .contains("Overall rating for objectives")
                .scrollIntoView()
                .should("be.visible")
                .then(() => {
                  cy.getByDataForm("ASF03OG0").should("be.visible");
                  if (results["TYFLGL"] === "LNEAR") {
                    cy.getBySel("RTLNSC")
                      .should("be.visible")
                      .should("have.value", results["RTLNSC_EXT"]);
                  } else if (results["TYFLGL"] === "GRADE") {
                    cy.getBySel("RTGRGL")
                      .should("be.visible")
                      .should("have.value", results["RTGRGL_EXT"]);
                  } else if (results["TYFLGL"] === "PRCNT") {
                    cy.getBySel("RTPRGL")
                      .should("be.visible")
                      .should("have.value", results["RTPRGL"]);
                  }
                });
            }

            if (results["FLSKEV"] === "1") {
              cy.get(".subtitle-container")
                .contains("Skills")
                .scrollIntoView()
                .should("be.visible");

              cy.getByDataForm("ASF036AS").should("be.visible");

              const lengthZY36 = getLengthFromData(data, "ZY36");
              cy.getRecordsFromTable("ZY36")
                .invoke("text")
                .should("eq", lengthZY36);
            }

            if (results["FLCOPR"] === "1") {
              cy.get(".subtitle-container")
                .contains("Competences")
                .should("be.visible");

              cy.getByDataForm("ASF03LAS").should("be.visible");

              if (results["FLSLAP"] === "1") {
                const radioButtonsID = [
                  "RTE101",
                  "RTM101",
                  "RTE102",
                  "RTM102",
                  "RTE103",
                  "RTM103",
                  "RTE104",
                  "RTM104",
                  "RTE105",
                  "RTM105",
                  "RTE106",
                  "RTM106",
                  "RTE107",
                  "RTM107",
                  "RTE108",
                  "RTM108",
                  "RTE109",
                  "RTM109",
                  "RTE110",
                  "RTM110",
                  "RTE111",
                  "RTM111",
                  "RTE112",
                  "RTM112"
                ];

                radioButtonsID.forEach(id => {
                  cy.getBySel(id)
                    .scrollIntoView()
                    .should("be.visible")
                    .find("[checked]")
                    .should("have.value", results[id]);
                });
              } else if (results["FLSLAP"] === "0") {
                const radioButtonsID = ["RTM101", "RTM102", "RTM103", "RTM104", "RTM105", "RTM106", "RTM107", "RTM108", "RTM109", "RTM110", "RTM111", "RTM112"];

                radioButtonsID.forEach(id => {
                  cy.getBySel(id)
                    .scrollIntoView()
                    .should("be.visible")
                    .find("[checked]")
                    .should("have.value", results[id]);
                });
              }
            }

            if (results["FLTKEV"] === "1") {
              cy.get(".subtitle-container")
                .contains("Tasks")
                .should("be.visible");

              cy.getByDataForm("ASF03MT0").should("be.visible");

              const lengthZY3M = getLengthFromData(data, "ZY3M");
              cy.getRecordsFromTable("ZY3M")
                .invoke("text")
                .should("eq", lengthZY3M);
            }

            if (results["FLSCTK"] === "1") {
              cy.get(".subtitle-container")
                .contains("Overall rating for tasks")
                .should("be.visible");

              cy.getByDataForm("ASF03OTR").should("be.visible");

              if (results["TYFLTK"] === "LNEAR") {
                cy.getBySel("RTLNTK")
                  .should("be.visible")
                  .should("have.value", results["RTLNTK_EXT"]);
              } else if (results["TYFLTK"] === "GRADE") {
                cy.getBySel("RTGRTS")
                  .should("be.visible")
                  .should("have.value", results["RTGRTS_EXT"]);
              } else if (results["TYFLTK"] === "PRCNT") {
                cy.getBySel("RTPRTS")
                  .should("be.visible")
                  .should("have.value", results["RTPRTS"]);
              }
            }

            if (results["FLQUES"] === "1") {
              cy.get(".subtitle-container")
                .contains("Questions")
                .should("be.visible");

              cy.getByDataForm("ASF04NQ0").should("be.visible");

              const lengthZY4N = getLengthFromData(data, "ZY4N");
              cy.getRecordsFromTable("ZY4N")
                .invoke("text")
                .should("eq", lengthZY4N);
            }

            if (results["FLPFCR"] === "1") {
              cy.get(".subtitle-container")
                .contains("Other criteria")
                .should("be.visible");

              cy.getByDataForm("ASF04TOC").should("be.visible");

              const lengthZY4T = getLengthFromData(data, "ZY4T");
              cy.getRecordsFromTable("ZY4T")
                .invoke("text")
                .should("eq", lengthZY4T);
            }

            if (results["FLMBWI"] === "1") {
              cy.getByDataForm("ASF03WG0")
                .scrollIntoView()
                .should("be.visible")
                .then(() => {
                  cy.get(".subtitle-container")
                    .contains("International mobility")
                    .should("be.visible");

                  checkTableTemplate(tableTemplate1, results);

                  cy.get(".subtitle-container")
                    .contains("Internal mobility")
                    .should("be.visible");

                  checkTableTemplate(tableTemplate2, results);
                });

              cy.get(".subtitle-container")
                .contains("Career Mobility")
                .scrollIntoView()
                .should("be.visible");

              const lengthZY3H = getLengthFromData(data, "ZY3H");
              cy.getRecordsFromTable("ZY3H")
                .invoke("text")
                .should("eq", lengthZY3H);
              cy.getBySel("TXCOMM")
                .should("be.visible")
                .should("have.value", results["TXCOMM"]);
            }

            if (results["FLOWPO"] === "1") {
              cy.get(".subtitle-container")
                .contains("Mentoring period")
                .should("be.visible");

              cy.getByDataForm("ASF063GS").should("be.visible");

              cy.get(".date-box[data-test-id='DTBG00'] input")
                .should("be.visible")
                .should("have.value", results["DTBG00"]);
              cy.get(".date-box[data-test-id='DTEN00'] input")
                .should("be.visible")
                .should("have.value", results["DTEN00"]);
              cy.getBySel("STMENT")
                .should("be.visible")
                .should("have.value", results["STMENT"]);
            }
          });
        cy.getByDataForm("ASF03OF0")
          .should("be.visible")
          .then(() => {
            if (results["TYFLSC"] === "LNEAR") {
              cy.getBySel("RTLNEM")
                .should("be.visible")
                .should("have.value", results["RTLNEM_EXT"]);
            } else if (results["TYFLSC"] === "GRADE") {
              cy.getBySel("RTGRFN")
                .should("be.visible")
                .should("have.value", results["RTGRFN_EXT"]);
            } else if (results["TYFLSC"] === "PRCNT") {
              cy.getBySel("RTPRFN")
                .should("be.visible")
                .should("have.value", results["RTPRFN"]);
            }
            if (results["FLSLAP"] === "1") {
              cy.getBySel("TXEMCM")
                .should("be.visible")
                .should("have.value", results["TXEMCM"]);
            }
            cy.getBySel("TXRWCM")
              .should("be.visible")
              .should("have.value", results["TXRWCM"]);
          })
          .then(() => {
            if (results["FLDEVP"] === "1") {
              cy.getByDataForm("ASF04AP0").should("be.visible");
              const lengthZYA4 = getLengthFromData(data, "ZYA4");
              cy.getRecordsFromTable("ZYA4")
                .invoke("text")
                .should("eq", lengthZYA4);
            }
          });

        cy.get(".subtitle-container")
          .contains("Manager's note")
          .scrollIntoView()
          .should("be.visible");

        cy.getByDataForm("ASTWT101").should("be.visible");
        cy.getBySelFromForm("ASTWT101", "TXCOMM")
          .should("be.visible")
          .should("have.value", results2["TXCOMM"]);

        cy.get(".subtitle-container").contains("Approval");
        cy.getByDataForm("ASTWT1A5").should("be.visible");

        cy.getBySel("USNAME")
          .should("be.visible")
          .should("have.value", results["USNAME"]);

        cy.getBySel("STATUX")
          .should("be.visible")
          .should("have.value", results["STATUX"]);

        cy.getBySelFromForm("ASTWT1A5", "TXCOMM")
          .should("be.visible")
          .should("have.value", results3["TXCOMM"]);

        cy.get(".subtitle-container")
          .contains("Comment of the manager")
          .should("be.visible");

        cy.getByDataForm("ANTWT100").should("be.visible");

        cy.getBySelFromForm("ANTWT100", "STATUX")
          .should("be.visible")
          .click();

        cy.getBySelFromForm("ANTWT100", "TXCOMM")
          .should("be.visible")
          .type(fetchGpData.dataToTypeManager["TXCOMM4"]);

        cy.getBySel("data-submit")
          .contains("Submit")
          .click();
        cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
        cy.wait(2000);
      });
    });
  });
}
