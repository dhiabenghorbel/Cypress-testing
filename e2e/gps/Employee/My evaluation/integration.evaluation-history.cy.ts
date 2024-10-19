import "jquery";
import cyconstants from "../../../../support/cyconstants";
import { checkTableTemplate, getLengthFromData, getValueFromData } from "../../../../support/functions";
import { IGPConfig } from "../../../../support/interfaces";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
import { default as tableTemplate1 } from "../../../../../src/GP4You/table-templates/AS/ASF03WGS/ASF03WGS-table-1";
import { default as tableTemplate2 } from "../../../../../src/GP4You/table-templates/AS/ASF03WGS/ASF03WGS-table-2";
//ENV : DV46 - MT22
let roles: any = [];
let hasNoCampaigns: boolean = false;

const GPConfig: IGPConfig = {
  id: "ASC03OE1",
  menuPath: { topic: "My evaluation", name: "Evaluation history" }
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
    let lengthZY3O: string;

    Cypress.on("uncaught:exception", (err, runnable) => {
      // return false to prevent Cypress from failing the test
      return false;
    });

    it("should redirect to evaluation history gp and verify gp's data", () => {
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}**`, method: "GET" }).as(GPConfig.id);
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
        lengthZY3O = getLengthFromData(data, "ZY3O");
        cy.getRecordsFromTable("ZY3O")
          .invoke("text")
          .should("eq", lengthZY3O)
          .then(() => {
            if (parseInt(lengthZY3O) === 0) {
              hasNoCampaigns = true;
              cy.log("***** NO CAMPAIGNS FOUND *****").wait(3000);
            }
          });
      });
    });

    it("should click on a campaign and display its data", () => {
      cy.skipOn(hasNoCampaigns);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**`, method: "POST" }).as(GPConfig.id);
      cy.getBySel("table-body").should("be.visible");
      cy.getBySel("paginated-table-row")
        .eq(0)
        .should("be.visible")
        .click();
      cy.wait(`@${GPConfig.id}`, { timeout: 45000 }).then(({ response: { body } }: any) => {
        const data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);
        cy.get(".subtitle-container")
          .contains("Basic Data")
          .should("be.visible");
        cy.getByDataForm("ASF03OCP").should("be.visible");
        if (results["IDCMPG"] !== "_" && results["FLGOAL"] === "1") {
          cy.get(".subtitle-container")
            .contains("Objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03NG3").should("be.visible");
          const lengthZY3N = getLengthFromData(data, "ZY3N");
          cy.getRecordsFromTable("ZY3N")
            .invoke("text")
            .should("eq", lengthZY3N);
        }
        if (results["IDCMPG"] !== "_" && results["FLSCRT"] === "1") {
          cy.get(".subtitle-container")
            .contains("Overall rating for objectives")
            .should("be.visible");
          cy.getByDataForm("ASF03OGC").should("be.visible");
          if (results["TYFLGL"] === "LNEAR") {
            cy.getBySel("RTLNSC")
              .should("be.visible")
              .should("have.value", results["RTLNSC"]);
          }
          if (results["TYFLGL"] === "GRADE") {
            cy.getBySel("RTGRGL")
              .should("be.visible")
              .should("have.value", results["RTGRGL_EXT"]);
          }
          if (results["TYFLGL"] === "PRCNT") {
            cy.getBySel("RTPRGL")
              .should("be.visible")
              .should("have.value", results["RTPRGL"]);
          }
        }
        if (results["IDCMPG"] !== "_" && results["FLSKEV"] === "1") {
          cy.get(".subtitle-container")
            .contains("Skills")
            .should("be.visible");
          cy.getByDataForm("ASF036AN").should("be.visible");
          const lengthZY36 = getLengthFromData(data, "ZY36");
          cy.getRecordsFromTable("ZY36")
            .invoke("text")
            .should("eq", lengthZY36);
        }
        if (results["IDCMPG"] !== "_" && results["FLCOPR"] === "1") {
          cy.get(".subtitle-container")
            .contains("Competences")
            .scrollIntoView()
            .should("be.visible");

          cy.getByDataForm("ASF03LAN").should("be.visible");

          const competencesEXTID = [
            "IDS101_EXT",
            "IDS102_EXT",
            "IDS103_EXT",
            "IDS104_EXT",
            "IDS105_EXT",
            "IDS106_EXT",
            "IDS107_EXT",
            "IDS108_EXT",
            "IDS109_EXT",
            "IDS110_EXT",
            "IDS111_EXT",
            "IDS112_EXT"
          ];

          competencesEXTID.forEach(id => {
            cy.getBySel(id)
              .scrollIntoView()
              .should("be.visible")
              .should("have.value", results[id]);
          });

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
        }

        if (results["IDCMPG"] !== "_" && results["FLTKEV"] === "1") {
          cy.get(".subtitle-container")
            .contains("Tasks")
            .scrollIntoView()
            .should("be.visible");
          cy.getByDataForm("ASF03MTK")
            .scrollIntoView()
            .should("be.visible");
        }

        if (results["IDCMPG"] !== "_" && results["FLSCTK"] === "1") {
          cy.get(".subtitle-container")
            .contains("Overall rating for tasks")
            .should("be.visible");
          cy.getByDataForm("ASF03OTC")
            .scrollIntoView()
            .should("be.visible");
          if (results["TYFLGL"] === "LNEAR") {
            cy.getBySel("RTLNTK")
              .should("be.visible")
              .should("have.value", results["RTLNTK_EXT"]);
          }
          if (results["TYFLGL"] === "GRADE") {
            cy.getBySel("RTGRTS")
              .should("be.visible")
              .should("have.value", results["RTGRTS_EXT"]);
          }
          if (results["TYFLGL"] === "PRCNT") {
            cy.getBySel("RTPRTS")
              .should("be.visible")
              .should("have.value", results["RTPRTS"]);
          }
        }
        if (results["IDCMPG"] !== "_" && results["FLQUES"] === "1") {
          cy.get(".subtitle-container")
            .contains("Questions")
            .should("be.visible");
          cy.getByDataForm("ASF04NQM")
            .scrollIntoView()
            .should("be.visible");
          const lengthZY4N = getLengthFromData(data, "ZY4N");
          cy.getRecordsFromTable("ZY4N")
            .invoke("text")
            .should("eq", lengthZY4N);
        }
        if (results["IDCMPG"] !== "_" && results["FLPFCR"] === "1") {
          cy.get(".subtitle-container")
            .contains("Other criteria")
            .scrollIntoView()
            .should("be.visible");
          cy.getByDataForm("ASF04TOC")
            .scrollIntoView()
            .should("be.visible");
          const lengthZY4T = getLengthFromData(data, "ZY4T");
          cy.getRecordsFromTable("ZY4T")
            .invoke("text")
            .should("eq", lengthZY4T);
        }
        if (results["IDCMPG"] !== "_" && results["FLMBWI"] === "1") {
          cy.getByDataForm("ASF03WGS")
            .scrollIntoView()
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
        if (results["IDCMPG"] !== "_") {
          cy.get(".subtitle-container")
            .contains("Overall rating")
            .scrollIntoView()
            .should("be.visible");
          cy.getByDataForm("ASF03OFC")
            .scrollIntoView()
            .should("be.visible");
          if (results["TYFLSC"] === "LNEAR") {
            cy.getBySel("RTLNEM")
              .should("be.visible")
              .should("have.value", results["RTLNEM"]);
          }
          if (results["TYFLSC"] === "GRADE") {
            cy.getBySel("RTGRFN")
              .should("be.visible")
              .should("have.value", results["RTGRFN_EXT"]);
          }
          if (results["TYFLSC"] === "PRCNT") {
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
        }
      });
    });
  });
}
