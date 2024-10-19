import cyconstants from "../../../../support/cyconstants";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { formatDateSpain, minutesToTime } from "../../../../../src/app/infrastructure/processing/general/time";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
// ENV : DV46
let roles: any = [];
let userDescription: any = [];
let searchedtrainingData: any;
let length: any;
let searchedClickedClassData: any = [];

const GPConfig: IGPConfig = {
  id: "ATC700E0",
  menuPath: { topic: "My training", name: "Training Catalog" }
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
      userDescription = res.userDescription;
    });
    cy.wait(2000);
  });

  describe("should load the app and display the home page content", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to Training Catalog gp and verify the clear button fonctionnality", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
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
        .contains("Search criteria")
        .should("be.visible");

      cy.getBySel("IDTCLG")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.contains(fetchGpData.dataToTypeEmployee["IDTCLG"]).click();
      cy.getBySel("DOCR00")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.contains(fetchGpData.dataToTypeEmployee["DOCR00"]).click();
      cy.getBySel("THCR00")
        .should("be.visible")
        .click();
      cy.contains("No options found").click();
      cy.getBySel("FLELNG")
        .should("be.visible")
        .click();
      cy.getBySel("TYAUDI")
        .should("be.visible")
        .click();
      cy.wait(2000);
      cy.contains(fetchGpData.dataToTypeEmployee["TYAUDI"]).click();
      cy.getBySel("LBCRLG")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LBCRLG"]);
      cy.getBySel("IDCR00")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["IDCR00"]);

      cy.getBySel("clearLabel")
        .should("be.visible")
        .click();

      cy.getBySel("IDTCLG").should("have.value", "");
      cy.getBySel("DOCR00").should("have.value", "");
      cy.get("[data-test-id='FLELNG'] input").should("not.be.checked");
      cy.getBySel("TYAUDI").should("have.value", "");
      cy.getBySel("LBCRLG").should("have.value", "");
      cy.getBySel("DOCR00").should("have.value", "");
    });

    it("should be able to search for a specific training request and verify data", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/aux-pop/search?role=**`, method: "POST" }).as("trainingData");

      cy.getBySel("DOCR00")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["DOCR00"]).click();
      cy.getBySel("LBCRLG")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LBCRLG"]);

      cy.getBySel("IDCR00").as("IDCR00_search");
      cy.get("@IDCR00_search")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["IDCR00"]);

      cy.getBySel("data-submit")
        .contains("Search")
        .click();
      cy.wait(2000);

      cy.wait("@trainingData", { timeout: 20000 }).then(({ response: { body } }: any) => {
        const trainingCatalogData = body.occurrences.occurrence;
        // searchedtrainingData = getValueFromData(trainingCatalogData, fetchGpData.trainingCatalogDataSearch);

        length = getLengthFromData(trainingCatalogData, "ZT01");

        cy.getBySel("records-length")
          .invoke("text")
          .should("eq", length);

        cy.getBySel("snackbar-toast").should("contain", "Search result");

        cy.getBySel("table-body").should("be.visible");
        cy.getBySel("paginated-table-row")
          .eq(0)
          .should("be.visible")
          .click();

        cy.window()
          .its("modifiedDataContext")
          .then(context => {
            const modalChanges = context.state.modalChanges;
            searchedtrainingData = getValueFromData(modalChanges, fetchGpData.trainingCatalogDataSearch);
            cy.get(".modal")
              .should("be.visible")
              .within(() => {
                cy.get(".subtitle-container")
                  .contains("Course properties")
                  .should("be.visible");

                cy.getBySel("LBCRLG")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", searchedtrainingData["LBCRLG"]);
                cy.getBySel("IDCR00")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", searchedtrainingData["IDCR00"]);
                cy.getBySel("NBHOUR")
                  .should("be.visible")
                  .should("be.disabled")
                  .should("have.value", minutesToTime(searchedtrainingData["NBHOUR"]));
                cy.getBySel("FLELNG")
                  .should("be.visible")
                  .find("input")
                  .should("have.value", searchedtrainingData["FLELNG"]);
              });
            //////////////////////////////////
            cy.get(".subtitle-container")
              .contains("Training programs description")
              .should("be.visible");

            cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/aux-pop/profile?role=**`, method: "POST" }).as("trainingProgram");

            length = getLengthFromData(modalChanges, "ZT1Z");
            cy.getRecordsFromTable("ZT1Z")
              .invoke("text")
              .should("eq", length);

            if (length > 0) {
              cy.getBySel("ZT1Z")
                .should("be.visible")
                .within(() => {
                  cy.getBySel("paginated-table-row")
                    .eq(0)
                    .should("be.visible")
                    .click();
                });
              cy.wait(2000);
              cy.wait("@trainingProgram", { timeout: 20000 }).then(({ response: { body } }: any) => {
                const clickedTrainingProgram = body.occurrences.occurrence;
                const searchedClickedTrainingProgramData: any = getValueFromData(clickedTrainingProgram, fetchGpData.trainingProgramDataSearch);

                cy.get(".modal:eq(1)")
                  .should("be.visible")
                  .within(() => {
                    cy.get(".subtitle-container")
                      .contains("Training program properties")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.getBySel("LIBLON")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedTrainingProgramData["LIBLON"]);
                    cy.getBySel("CDCODE")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedTrainingProgramData["CDCODE"]);
                    cy.getBySel("DOTP00_EXT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedTrainingProgramData["DOTP00_EXT"]);

                    cy.get(".subtitle-container")
                      .contains("Courses")
                      .scrollIntoView()
                      .should("be.visible");

                    length = getLengthFromData(clickedTrainingProgram, "ZDHB");
                    cy.getRecordsFromTable("ZDHB")
                      .invoke("text")
                      .should("eq", length);
                  });
                if (length > 0) {
                  cy.getBySel("ZDHB")
                    .should("be.visible")
                    .within(() => {
                      cy.getBySel("paginated-table-row")
                        .eq(0)
                        .click();
                    });

                  cy.get(".modal:eq(2)")
                    .should("be.visible")
                    .within(() => {
                      cy.getBySel("NBOR00")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", searchedClickedTrainingProgramData["NBOR00"]);
                      cy.getBySel("IDCR00")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", searchedClickedTrainingProgramData["IDCR00"]);
                      cy.getBySel("IDCR00_EXT")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", searchedClickedTrainingProgramData["IDCR00_EXT"]);
                      cy.getBySel("FLIMPO_EXT")
                        .should("be.visible")
                        .should("be.disabled")
                        .should("have.value", searchedClickedTrainingProgramData["FLIMPO_EXT"]);
                      cy.getBySel("close-button")
                        .contains("Close")
                        .click();
                    });
                }
                length = getLengthFromData(clickedTrainingProgram, "ZDHD");
                cy.getRecordsFromTable("ZDHD")
                  .invoke("text")
                  .should("eq", length);
              });

              cy.get(".modal:eq(1)")
                .should("be.visible")
                .within(() => {
                  cy.getBySel("close-modal").click();
                });
            }
            //////////////////////////////

            cy.get(".subtitle-container")
              .contains("Targeted skills")
              .scrollIntoView()
              .should("be.visible");

            length = getLengthFromData(modalChanges, "ZT1B");
            cy.getRecordsFromTable("ZT1B")
              .invoke("text")
              .should("eq", length);
            if (length > 0) {
              cy.getBySel("ZT1B")
                .scrollIntoView()
                .should("be.visible")
                .within(() => {
                  cy.getBySel("paginated-table-row")
                    .eq(0)
                    .should("be.visible")
                    .click();
                });
              cy.getBySel("IDSK00_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", searchedtrainingData["IDSK00_EXT"]);
              cy.getBySel("LVPROF_EXT")
                .should("be.visible")
                .should("be.disabled")
                .should("have.value", searchedtrainingData["LVPROF_EXT"]);
              cy.getBySel("close-button")
                .contains("Close")
                .click();
            }
            //////////////////////////////

            cy.get(".subtitle-container")
              .contains("Classes")
              .scrollIntoView()
              .should("be.visible");

            length = getLengthFromData(modalChanges, "ZT1Y");
            cy.getRecordsFromTable("ZT1Y")
              .invoke("text")
              .should("eq", length);

            if (length > 0) {
              cy.getBySel("ZT1Y")
                .scrollIntoView()
                .should("be.visible")
                .within(() => {
                  cy.getBySel("paginated-table-row")
                    .eq(0)
                    .should("be.visible")
                    .click("topRight");
                });
              cy.wait("@trainingProgram", { timeout: 20000 }).then(({ response: { body } }: any) => {
                const clickedClassData = body.occurrences.occurrence;

                searchedClickedClassData = getValueFromData(clickedClassData, fetchGpData.classesDataSearch);

                cy.get(".modal:eq(1)")
                  .should("be.visible")
                  .within(() => {
                    cy.get(".subtitle-container")
                      .contains("Class properties")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.getBySel("LBCLSH")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["LBCLSH"]);
                    cy.getBySel("IDCR00_EXT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["IDCR00_EXT"]);
                    cy.getBySel("IDCL00")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["IDCL00"]);
                    cy.getBySel("IDCR00")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["IDCR00"]);
                    cy.getBySel("STCL00_EXT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["STCL00_EXT"]);

                    cy.get(".subtitle-container")
                      .contains("Class duration")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.get(".date-box[data-test-id='DTEFCL'] input")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["DTEFCL"] === undefined ? "" : formatDateSpain(searchedClickedClassData["DTEFCL"]));
                    cy.getBySel("BGTI00")
                      .should("be.visible")
                      .should("have.value", minutesToTime(searchedClickedClassData["BGTI00"]));
                    cy.get(".date-box[data-test-id='DTENCL'] input")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["DTENCL"] === undefined ? "" : formatDateSpain(searchedClickedClassData["DTENCL"]));
                    cy.getBySel("ENTI00")
                      .should("be.visible")
                      .should("have.value", minutesToTime(searchedClickedClassData["ENTI00"]));
                    cy.getBySel("NBPE00")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["NBPE00"]);
                    cy.getBySel("DUPE00_EXT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["DUPE00_EXT"]);

                    cy.get(".subtitle-container")
                      .contains("Inscription details")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.get(".date-box[data-test-id='DTRGOP'] input")
                      .should("be.visible")
                      .should("have.value", searchedClickedClassData["DTRGOP"] === undefined ? "" : formatDateSpain(searchedClickedClassData["DTRGOP"]));
                    cy.get(".date-box[data-test-id='DTRGCL'] input")
                      .should("be.visible")
                      .should("have.value", searchedClickedClassData["DTRGCL"] === undefined ? "" : formatDateSpain(searchedClickedClassData["DTRGCL"]));
                    cy.getBySel("NBENRO")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["NBENRO"]);
                    cy.getBySel("NBSEAT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["NBSEAT"]);
                    cy.getBySel("NBWLIS")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["NBWLIS"]);

                    cy.get(".subtitle-container")
                      .contains("Place")
                      .scrollIntoView()
                      .should("be.visible");
                    cy.getBySel("IDLO00_EXT")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["IDLO00_EXT"]);
                    cy.getBySel("IDROOM")
                      .should("be.visible")
                      .should("be.disabled")
                      .should("have.value", searchedClickedClassData["IDROOM"]);

                    cy.get(".subtitle-container")
                      .contains("Periods")
                      .scrollIntoView()
                      .should("be.visible");

                    length = getLengthFromData(modalChanges, "ZU2G");
                    cy.getRecordsFromTable("ZU2G")
                      .invoke("text")
                      .should("eq", length);

                    cy.getBySel("close-modal")
                      .scrollIntoView({ offset: -100 })
                      .click();
                  });
              });
            }
          });
      });
    });

    it("should be able to make an internship application request", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/ATWV00E0/paramdatav2**`, method: "POST" }).as("ATWV00E0");
      cy.getBySel("path-link")
        .scrollIntoView()
        .contains("Make a training request for the course")
        .click()
        .then(() => {
          cy.wait(2000);
          cy.url().should("include", "/ATWV00E0");
          cy.wait("@ATWV00E0", { timeout: 20000 }).then(({ response: { body } }: any) => {
            const courseData = body.occurrences.occurrence;
            const searchedCourse = getValueFromData(courseData, fetchGpData.trainingCatalogDataSearch);
            cy.get(".subtitle-container")
              .contains("Course details")
              .should("be.visible");

            cy.getBySel("LBCRLG")
              .should("be.visible")
              .should("be.disabled")
              .should("have.value", searchedCourse["LBCRLG"]);
            cy.getBySel("IDCR00")
              .should("be.visible")
              .should("be.disabled")
              .should("have.value", searchedCourse["IDCR00"]);
            cy.getBySel("NBHOUR")
              .should("be.visible")
              .should("be.disabled")
              .should("have.value", minutesToTime(searchedCourse["NBHOUR"]));
            cy.getBySel("FLELNG")
              .should("be.visible")
              .find("input")
              .should("have.value", searchedCourse["FLELNG"]);

            cy.getBySel("path-link").contains("More Info");

            cy.wait(2000);

            cy.get(".subtitle-container")
              .contains("Description")
              .should("be.visible");

            cy.getBySel("LBRQLG")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["LBRQLG"]);
            cy.getBySel("LBRQSH")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["LBRQSH"]);

            cy.get(".subtitle-container")
              .contains("Organization wishes")
              .should("be.visible");

            cy.get(".date-box[data-test-id='DTEA00'] input")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["DTEA00"]);
            cy.get(".date-box[data-test-id='DTLA00'] input")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["DTLA00"]);
            cy.getBySel("TRDAYS")
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["TRDAYS"]);
            cy.getBySel("IDLOCA")
              .should("be.visible")
              .click();
            cy.contains(fetchGpData.dataToTypeEmployee["IDLOCA"]).click();
            cy.getBySel("FLNOCT")
              .should("be.visible")
              .click();

            cy.get(".subtitle-container")
              .contains("Class wishes")
              .should("be.visible");

            cy.selectValueFromCodelist("IDCL00", undefined, fetchGpData.dataToTypeEmployee["IDCL00"]);

            cy.get(".subtitle-container")
              .contains("Training need description")
              .should("be.visible");

            cy.getBySel("TXCOMM")
              .scrollIntoView()
              .should("be.visible")
              .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);

            cy.getBySel("data-submit").click();
            cy.wait(3000);
            cy.getBySel("snackbar-toast").should("contain", "Request sent with success");
          });
        });

      // cy.visit("/ATWV00E0");

      // cy.get(".subtitle-container")
      //   .contains("Course details")
      //   .should("be.visible");

      // cy.getBySel("LBCRLG")
      //   .should("be.visible")
      //   .should("be.disabled")
      //   .should("have.value", searchedtrainingData["LBCRLG"]);
      // cy.getBySel("IDCR00")
      //   .should("be.visible")
      //   .should("be.disabled")
      //   .should("have.value", searchedtrainingData["IDCR00"]);
      // cy.getBySel("NBHOUR")
      //   .should("be.visible")
      //   .should("be.disabled")
      //   .should("have.value", minutesToTime(searchedtrainingData["NBHOUR"]));
      // cy.getBySel("FLELNG")
      //   .should("be.visible")
      //   .should("have.value", searchedtrainingData["FLELNG"] === "0" ? "" : searchedtrainingData["FLELNG"]);

      // cy.getBySel("path-link").contains("More Info");

      // cy.wait(2000);

      // cy.get(".subtitle-container")
      //   .contains("Description")
      //   .should("be.visible");

      // cy.getBySel("LBRQLG")
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["LBRQLG"]);
      // cy.getBySel("LBRQSH")
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["LBRQSH"]);

      // cy.get(".subtitle-container")
      //   .contains("Organization wishes")
      //   .should("be.visible");

      // cy.get(".date-box[data-test-id='DTEA00'] input")
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["DTEA00"]);
      // cy.get(".date-box[data-test-id='DTLA00'] input")
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["DTLA00"]);
      // cy.getBySel("TRDAYS")
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["TRDAYS"]);
      // cy.getBySel("IDLOCA")
      //   .should("be.visible")
      //   .click();
      // cy.contains(fetchGpData.dataToTypeEmployee["IDLOCA"]).click();
      // cy.getBySel("FLNOCT")
      //   .should("be.visible")
      //   .click();

      // cy.get(".subtitle-container")
      //   .contains("Class wishes")
      //   .should("be.visible");

      // cy.selectValueFromCodelist("IDCL00");

      // cy.get(".subtitle-container")
      //   .contains("Training need description")
      //   .should("be.visible");

      // cy.getBySel("TXCOMM")
      //   .scrollIntoView()
      //   .should("be.visible")
      //   .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);

      // cy.getBySel("data-submit").click();
      // cy.wait(3000);
      // cy.getBySel("snackbar-toast").should("contain", "Request sent with success");
    });

    it("should be able to approved the internship application request by his manager", () => {
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
      cy.getBySel("tasks-badge", { timeout: 20000 }).click();
      cy.getBySel("search-box-text")
        .type("Course requested")
        .then(() => {
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(formatDateSpain(new Date()));
            })
            // .click();
            .then(() => {
              // Asegúrate de que el elemento aún esté presente antes de hacer clic
              cy.getBySel("paginated-table-row")
                .eq(0)
                .click();
            });
        });
      cy.wait(3000);

      cy.get(".subtitle-container")
        .contains("Course details")
        .should("be.visible");

      cy.getBySel("LBCRLG")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", searchedtrainingData["LBCRLG"]);
      cy.getBySel("IDCR00")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", searchedtrainingData["IDCR00"]);
      cy.getBySel("NBHOUR")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", minutesToTime(searchedtrainingData["NBHOUR"]));
      cy.getBySel("FLELNG")
        .should("be.visible")
        .find("input")
        .should("have.value", searchedtrainingData["FLELNG"]);

      cy.get(".subtitle-container")
        .contains("Description")
        .should("be.visible");

      cy.getBySel("LBRQLG")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["LBRQLG"]);
      cy.getBySel("LBRQSH")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["LBRQSH"]);

      cy.get(".subtitle-container")
        .contains("Organization wishes")
        .should("be.visible");

      cy.get(".date-box[data-test-id='DTEA00'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTEA00"]);
      cy.get(".date-box[data-test-id='DTLA00'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTLA00"]);
      cy.getBySel("TRDAYS")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["TRDAYS"]);
      cy.getByVal(fetchGpData.dataToTypeEmployee["IDLOCA"]).should("be.visible");
      cy.get("[data-test-id='FLNOCT'] input").should("be.checked");
      cy.get(".subtitle-container")
        .contains("Class wishes")
        .should("be.visible");
      cy.getBySel("paginated-table-row")
        // .should("be.visible")
        .click();
      cy.getBySel("NMPRES")
        .should("be.visible")
        .should("have.value", userDescription.name);
      cy.getBySel("MATCLE")
        .should("be.visible")
        .should("have.value", userDescription.matcle);
      cy.getBySel("IDCL00")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["IDCL00"]);
      cy.getBySel("close-button")
        .contains("Close")
        .click();
      cy.getBySel("TXCOMM")
        .eq(0)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);
      cy.getBySel("STRQOP")
        .should("be.visible")
        .select(fetchGpData.dataToTypeManager["STRQOP"]);
      cy.getBySel("TXCOMM")
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeManager["TXCOMM"]);
      cy.getBySel("data-submit").click();

      cy.wait(3000);
      cy.getBySel("snackbar-toast").should("contain", "Request sent with success");
    });

    it("should be able to make an adhoc request", () => {
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

      cy.visit("/ATC700E1");
      cy.get('a[href="/ATWV00E2"]')
        .should("be.visible")
        .click();
      cy.wait(2000);

      cy.get(".subtitle-container")
        .contains("Description")
        .should("be.visible");

      cy.getBySel("LBRQLG")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LBRQLG"]);
      cy.getBySel("LBRQSH")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["LBRQSH"]);

      cy.get(".subtitle-container")
        .contains("Skill Objectives")
        .should("be.visible");

      cy.getBySel("add-button", { timeout: 40000 })
        .should("be.visible")
        .click();

      cy.getBySel("IDSK00")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDSK00"]).click();

      cy.getBySel("LVPROF")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["LVPROF"]).click();

      cy.getBySel("data-submit")
        .contains("Add")
        .click();

      cy.get(".subtitle-container")
        .contains("Organization wishes")
        .should("be.visible");

      cy.get(".date-box[data-test-id='DTEA00'] input")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DTEA00"]);
      cy.get(".date-box[data-test-id='DTLA00'] input")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["DTLA00"]);
      cy.getBySel("TRDAYS")
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["TRDAYS"]);
      cy.getBySel("IDLOCA")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDLOCA"]).click();
      cy.getBySel("FLNOCT")
        .should("be.visible")
        .click();

      cy.get(".subtitle-container")
        .contains("Career aspirations")
        .should("be.visible");

      cy.getBySel("IDJBTG")
        .should("be.visible")
        .click();
      cy.contains(fetchGpData.dataToTypeEmployee["IDJBTG"]).click();

      cy.getBySel("TXCOMM")
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeEmployee["TXCOMM"]);
      cy.getBySel("data-submit")
        .scrollIntoView()
        .click();

      cy.wait(3000);
      cy.getBySel("snackbar-toast").should("contain", "Request sent with success");
    });

    it("should be able to approve the adhoc request by his manager", () => {
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

      cy.getBySel("tasks-badge", { timeout: 20000 }).click();
      cy.getBySel("search-box-text")
        .type("Training requested")
        .then(() => {
          cy.getBySel("paginated-table-row")
            .eq(0)
            .should("be.visible")
            .then($lines => {
              const linesValues = Array.from($lines).map(line => line.innerText.trim());
              expect(linesValues[0]).to.include(formatDateSpain(new Date()));
            })
            .click();
        });
      cy.wait(3000);

      cy.get(".subtitle-container")
        .contains("Employee")
        .should("be.visible");

      cy.getBySel("NMPRES")
        .should("be.visible")
        .should("have.value", userDescription.name);
      cy.getBySel("MATCLE")
        .should("be.visible")
        .should("have.value", userDescription.matcle);

      cy.get(".subtitle-container")
        .contains("Description")
        .should("be.visible");

      cy.getBySel("LBRQLG")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["LBRQLG"]);
      cy.getBySel("LBRQSH")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["LBRQSH"]);

      cy.get(".subtitle-container")
        .contains("Skill Objectives")
        .should("be.visible");
      cy.findRowInTable(fetchGpData.dataToTypeEmployee["IDSK00"])
        .should("be.visible")
        .should("be.visible")
        .click();
      cy.getByVal(fetchGpData.dataToTypeEmployee["IDSK00"])
        .should("be.disabled")
        .should("be.visible");
      cy.getByVal(fetchGpData.dataToTypeEmployee["LVPROF"])
        .should("be.disabled")
        .should("be.visible");
      cy.getBySel("close-button")
        .contains("Close")
        .click();

      cy.get(".subtitle-container")
        .contains("Organization wishes")
        .should("be.visible");

      cy.get(".date-box[data-test-id='DTEA00'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTEA00"]);
      cy.get(".date-box[data-test-id='DTLA00'] input")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["DTLA00"]);
      cy.getBySel("TRDAYS")
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["TRDAYS"]);
      cy.getByVal(fetchGpData.dataToTypeEmployee["IDLOCA"]).should("be.visible");
      cy.get("[data-test-id='FLNOCT'] input").should("be.checked");
      cy.get(".subtitle-container")
        .contains("Career aspirations")
        .should("be.visible");

      cy.getByVal(fetchGpData.dataToTypeEmployee["IDJBTG"]).should("be.visible");

      cy.get(".subtitle-container")
        .contains("Training need description")
        .should("be.visible");

      cy.getBySel("TXCOMM")
        .eq(0)
        .should("be.visible")
        .should("have.value", fetchGpData.dataToTypeEmployee["TXCOMM"]);

      cy.get(".subtitle-container")
        .contains("Status")
        .should("be.visible");

      cy.getBySel("STRQOP")
        .scrollIntoView()
        .should("be.visible")
        .select(fetchGpData.dataToTypeManager["STRQOP"]);
      cy.getBySel("TXCOMM")
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
        .type(fetchGpData.dataToTypeManager["TXCOMM"]);

      cy.getBySel("data-submit").click();

      cy.wait(3000);
      cy.getBySel("snackbar-toast").should("contain", "Request sent with success");
    });
  });
}
