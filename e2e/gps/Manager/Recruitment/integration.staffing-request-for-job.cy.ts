import cyconstants from "../../../../support/cyconstants";
import "jquery";
import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import { IGPConfig } from "../../../../support/interfaces";
import { dataMapping } from "../../../../support/dataMapping";
import { cyConf } from "../../../../support/envsAndUsers";
//ENV : MT22
let roles: any = [];

const GPConfig: IGPConfig = {
  id: "AIW400M2",
  menuPath: { topic: "Recruitment", name: "Staffing request for job" }
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

    it("should redirect to staffing request for job gp and verify gp's three steps data and submit the request", () => {
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
      cy.wait(5000);

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
      cy.wait(5000);

      cy.wait(`@${GPConfig.id}`, { timeout: 25000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "POST" }).as("AIW400M2SIM");
        //// STEP 1 .

        cy.get(".stepper-box").within(() => {
          cy.get(".badge-number")
            .filter(".badge-number-default-color")
            .invoke("text")
            .should("eq", "0");
        });

        cy.get(".subtitle-container")
          .contains("Organization details")
          .should("be.visible");

        cy.getBySel("IDCY00")
          .should("be.visible")
          .should("have.value", results["IDCY00"]);

        cy.getBySel("IDCY00_EXT")
          .should("be.visible")
          .should("have.value", results["IDCY00_EXT"]);

        cy.getBySel("IDOU00")
          .should("be.visible")
          .should("have.value", results["IDOU00"]);

        cy.getBySel("LBRECR")
          .should("be.visible")
          .should("have.value", results["LBRECR"]);

        cy.get(".subtitle-container")
          .contains("Request assignment")
          .should("be.visible");

        cy.getBySel("IDJB00").click();
        cy.contains(fetchGpData.dataToTypeManager["IDJB00"]).click();

        cy.get(".date-box[data-test-id='DTFRST'] input")
          .type(fetchGpData.dataToTypeManager["DTFRST"])
          .then(() => {
            cy.getBySel("IDESTA").click();
            cy.contains(fetchGpData.dataToTypeManager["IDESTA"]).click();
          });

        cy.get(".subtitle-container")
          .contains("Label")
          .should("be.visible");

        cy.getBySel("LBSRLG").type(fetchGpData.dataToTypeManager["LBSRLG"]);

        cy.getBySel("LBSRSH").type(fetchGpData.dataToTypeManager["LBSRSH"]);

        cy.get(".subtitle-container")
          .contains("Staffing request with position creation")
          .should("be.visible");

        cy.getBySel("FLSP02").select(fetchGpData.dataToTypeManager["FLSP02"]);

        cy.getBySel("button-next").click();
        //// STEP 2 .
        cy.wait(3000);

        cy.get(".stepper-box").within(() => {
          cy.get(".badge-number")
            .filter(".badge-number-default-color")
            .invoke("text")
            .should("eq", "1");
        });

        cy.get(".subtitle-container")
          .contains("Organization details")
          .scrollIntoView()
          .should("be.visible");

        cy.wait("@AIW400M2SIM", { timeout: 25000 }).then(({ response: { body } }: any) => {
          const simulationData = body.occurrences.occurrence;
          console.log("🚀 ~ cy.wait ~ simulationData:", simulationData);
          const simulationResults = getValueFromData(simulationData, fetchGpData.simulationDataSearch);
          console.log("🚀 ~ cy.wait ~ simulationResults:", simulationResults);

          cy.getBySel("IDCY00")
            .should("be.visible")
            .should("have.value", simulationResults["IDCY00"]);

          cy.getBySel("IDCY00_EXT")
            .should("be.visible")
            .should("have.value", simulationResults["IDCY00_EXT"]);

          cy.getBySel("IDOU00")
            .should("be.visible")
            .should("have.value", simulationResults["IDOU00"]);

          cy.getBySel("LBRECR")
            .should("be.visible")
            .should("have.value", simulationResults["LBRECR"]);

          cy.get(".subtitle-container")
            .contains("Label")
            .should("be.visible");

          cy.getBySel("LBSRLG").should("have.value", fetchGpData.dataToTypeManager["LBSRLG"]);

          cy.getBySel("LBSRSH").should("have.value", fetchGpData.dataToTypeManager["LBSRSH"]);

          cy.get(".subtitle-container")
            .contains("Request details")
            .should("be.visible");

          cy.get(".date-box[data-test-id='DTFRST'] input")
            .should("be.visible")
            .clear()
            .type(fetchGpData.dataToTypeManager["DTFRST"]);

          cy.get(".date-box[data-test-id='DTFREN'] input")
            .should("be.visible")
            .clear()
            .type(fetchGpData.dataToTypeManager["DTFREN"]);

          cy.getBySel("TYVACY")
            .should("be.visible")
            .select(fetchGpData.dataToTypeManager["TYVACY"]);

          cy.getBySel("NBRQFT")
            .should("be.visible")
            .clear()
            .type(fetchGpData.dataToTypeManager["NBRQFT"]);

          cy.getBySel("NBRQIN")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["NBRQIN"]);

          cy.getBySel("FLSREX")
            .should("be.visible")
            .click();

          cy.get(".subtitle-container")
            .contains("Classification")
            .should("be.visible");

          cy.getBySel("CLEMPL").click();
          cy.contains(fetchGpData.dataToTypeManager["CLEMPL"]).click();

          cy.getBySel("CLMANA").click();
          cy.contains(fetchGpData.dataToTypeManager["CLMANA"]).click();

          cy.getBySel("FLREGL")
            .find('input[type="radio"]')
            .last()
            .check();

          cy.getBySel("FLPFTI")
            .find('input[type="radio"]')
            .last()
            .check();

          cy.get(".subtitle-container")
            .contains("Base compensation range")
            .should("be.visible");

          cy.getBySel("AMMIN")
            .should("be.visible")
            .should("have.value", simulationResults["AMMIN"]);

          cy.getBySel("AMMAX")
            .should("be.visible")
            .should("have.value", simulationResults["AMMAX"]);

          cy.getBySel("CURCY")
            .should("be.visible")
            .should("have.value", simulationResults["CURCY"]);

          cy.getBySel("IDDU00_EXT")
            .should("be.visible")
            .should("have.value", simulationResults["IDDU00_EXT"]);

          cy.getBySel("AMMGR")
            .clear()
            .type(fetchGpData.dataToTypeManager["AMMGR"]);

          cy.getBySel("TXCOMM").type(fetchGpData.dataToTypeManager["TXCOMM"]);

          cy.get(".subtitle-container")
            .contains("Description")
            .scrollIntoView()
            .should("be.visible");

          let lengthZB1E = getLengthFromData(simulationData, "ZB1E");
          cy.getRecordsFromTable("ZB1E")
            .invoke("text")
            .should("eq", lengthZB1E);

          cy.getBySel("add-button")
            .should("be.visible")
            .click();

          cy.get(".modal").should("be.visible");

          cy.getBySel("IDLG00")
            .should("be.visible")
            .click();
          cy.contains(fetchGpData.dataToTypeManager["IDLG00"]).click();

          cy.getBySel("IDSCNM")
            .should("be.visible")
            .select(fetchGpData.dataToTypeManager["IDSCNM"]);

          cy.getBySel("FLPOST")
            .should("be.visible")
            .click();

          cy.getBySel("TXSECT")
            .should("be.visible")
            .type(fetchGpData.dataToTypeManager["TXSECT"]);

          cy.getBySel("data-submit")
            .should("be.visible")
            .click();

          if (fetchGpData.dataToTypeManager["FLSP02"] === "Yes") {
            cy.getBySel("staffingRequest")
              .scrollIntoView()
              .should("be.visible")
              .should("have.text", "This is a staffing request with position creation");
          } else {
            cy.getBySel("noStaffingRequest")
              .scrollIntoView()
              .should("be.visible")
              .should("have.text", "This is a staffing request without position creation");
          }

          cy.getBySel("button-next").click();
          cy.wait(2000);
          //// STEP 3 .
          cy.get(".stepper-box").within(() => {
            cy.get(".badge-number")
              .filter(".badge-number-default-color")
              .invoke("text")
              .should("eq", "2");
          });

          cy.getBySel("button-previous")
            .scrollIntoView()
            .should("be.visible")
            .click();

          cy.wait(2000);

          cy.get(".stepper-box").within(() => {
            cy.get(".badge-number")
              .filter(".badge-number-default-color")
              .invoke("text")
              .should("eq", "1");
          });

          cy.getBySel("button-next")
            .scrollIntoView()
            .should("be.visible")
            .click();

          cy.wait(2000);

          cy.get(".stepper-box").within(() => {
            cy.get(".badge-number")
              .filter(".badge-number-default-color")
              .invoke("text")
              .should("eq", "2");
          });

          cy.getBySel("IDCY00")
            .should("be.disabled")
            .should("have.value", simulationResults["IDCY00"]);

          cy.getBySel("IDCY00_EXT")
            .should("be.disabled")
            .should("have.value", simulationResults["IDCY00_EXT"]);

          cy.getBySel("IDOU00")
            .should("be.disabled")
            .should("have.value", simulationResults["IDOU00"]);

          cy.getBySel("LBRECR")
            .should("be.disabled")
            .should("have.value", simulationResults["LBRECR"]);

          cy.get(".subtitle-container")
            .contains("Label")
            .scrollIntoView()
            .should("be.visible");

          cy.getBySel("LBSRLG")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["LBSRLG"]);

          cy.getBySel("LBSRSH")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["LBSRSH"]);

          cy.get(".subtitle-container")
            .contains("Request details")
            .should("be.visible");

          cy.get(".date-box[data-test-id='DTFRST'] input")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["DTFRST"]);

          cy.get(".date-box[data-test-id='DTFREN'] input")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["DTFREN"]);

          cy.getBySel("TYVACY")
            .should("be.disabled")
            .should("have.text", fetchGpData.dataToTypeManager["TYVACY"]);

          cy.getBySel("NBRQFT")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["NBRQFT"]);

          cy.getBySel("NBRQIN")
            .should("be.disabled")
            .should("have.value", "0" + fetchGpData.dataToTypeManager["NBRQIN"]);

          cy.get("[data-test-id='FLSREX'] input").should("be.checked");

          cy.get(".subtitle-container")
            .contains("Classification")
            .scrollIntoView();

          cy.getBySel("CLEMPL")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["CLEMPL"]);

          cy.getBySel("CLMANA")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["CLMANA"]);

          cy.getBySel("FLREGL")
            .find('input[type="radio"]')
            .last()
            .should("be.disabled")
            .should("have.value", "T");

          cy.getBySel("FLPFTI")
            .find('input[type="radio"]')
            .last()
            .should("be.disabled")
            .should("have.value", "P");

          cy.get(".subtitle-container")
            .contains("Base compensation range")
            .should("be.visible");

          cy.getBySel("AMMIN")
            .should("be.disabled")
            .should("have.value", simulationResults["AMMIN"]);

          cy.getBySel("AMMAX")
            .should("be.disabled")
            .should("have.value", simulationResults["AMMAX"]);

          cy.getBySel("CURCY")
            .should("be.disabled")
            .should("have.value", simulationResults["CURCY"]);

          cy.getBySel("IDDU00_EXT")
            .should("be.disabled")
            .should("have.value", simulationResults["IDDU00_EXT"]);

          cy.getBySel("AMMGR")
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["AMMGR"]);

          cy.getBySel("TXCOMM")
            .eq(0)
            .should("be.disabled")
            .should("have.value", fetchGpData.dataToTypeManager["TXCOMM"]);

          cy.get(".subtitle-container")
            .contains("Description")
            .scrollIntoView();

          lengthZB1E = getLengthFromData(simulationData, "ZB1E");
          cy.getRecordsFromTable("ZB1E")
            .invoke("text")
            .should("eq", (parseInt(lengthZB1E) + 1).toString());

          cy.get(".subtitle-container")
            .contains("Comment of the requester")
            .should("be.visible");

          if (fetchGpData.dataToTypeManager["FLSP02"] === "Yes") {
            cy.getBySel("staffingRequest")
              .scrollIntoView()
              .should("be.visible")
              .should("have.text", "This is a staffing request with position creation");
          } else {
            cy.getBySel("noStaffingRequest")
              .scrollIntoView()
              .should("be.visible")
              .should("have.text", "This is a staffing request without position creation");
          }

          cy.getBySel("TXCOMM")
            .eq(1)
            .type(fetchGpData.dataToTypeManager["TXCOMM"]);

          cy.getBySel("data-submit")
            .contains("Submit")
            .click();

          cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
          cy.getBySel("gp-submitted-with-success").should("be.visible");
        });
      });
    });
  });
}
