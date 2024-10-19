import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : MT22
let data: any = [];
let roles: any = [];
let proposals: any = [];
let massiveGridData: any = {};

const GPConfig: IGPConfig = {
  id: "ASC640M2",
  menuPath: { topic: "Compensation", name: "View salary proposals" }
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

    it("should switch to the manager role and redirect to View salary proposals gp", () => {
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
    });

    it("verify Compensation Campaign data", () => {
      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains("Compensation")
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains("Salary review")
        .click();
      cy.wait(2000);

      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**`, method: "POST" }).as(GPConfig.id);

      cy.getBySel("paginated-table-row", { timeout: 25000 })
        .eq(1)
        .should("be.visible")
        .click();

      cy.wait(3000);

      cy.get(".card-header")
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.getBySel("view-proposals")
        .should("be.visible")
        .invoke("text")
        .should("eq", "You are accessing this page as team or wage manager of your organization unit and can view proposals for all employees of your team.");

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        data = body.occurrences.occurrence;
        const results = getValueFromData(data, fetchGpData.dataSearch);

        cy.get(".subtitle-container")
          .contains("Compensation Campaign")
          .should("be.visible");

        cy.getBySel("IDCMCP_EXT")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", results["IDCMCP_EXT"]);

        cy.get(".date-box[data-test-id='DTEFPR'] input")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", formatDateSpain(results["DTEFPR"]));

        cy.get(".date-box[data-test-id='DTENPR'] input")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", formatDateSpain(results["DTENPR"]));

        cy.get(".date-box[data-test-id='DTEFTR'] input")
          .should("be.visible")
          .should("be.disabled")
          .should("have.value", formatDateSpain(results["DTEFTR"]));
      });
    });

    it("verify Proposals data", () => {
      cy.get(".subtitle-container")
        .contains("Proposals")
        .should("be.visible");

      data.forEach((element: any) => {
        if (element["@datasection"] === "ZE40") {
          proposals.unshift(element.data);
        }
      });
      proposals[0].forEach((item: any) => {
        massiveGridData[item.item] = item.value;
      });

      cy.get(".k-grid-content-sticky")
        .eq(0)
        .should("be.visible")
        .should("have.text", massiveGridData["NMPRES"]);

      cy.get(".k-textbox")
        .eq(0)
        .should("be.visible")
        .should("have.value", massiveGridData["MATCLE"]);

      cy.get(".k-textbox")
        .eq(1)
        .should("be.visible")
        .should("have.value", massiveGridData["NMMANG"]);

      cy.get(".k-textbox")
        .eq(2)
        .should("be.visible")
        .should("have.value", massiveGridData["IDOU00_EXT"]);

      cy.get(".k-textbox")
        .eq(3)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDJB00_EXT"]);

      cy.get(".k-textbox")
        .eq(4)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["RTPDHR"]);

      cy.get(".k-textbox")
        .eq(5)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMANN"]);

      cy.get(".k-textbox")
        .eq(6)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDCUR"]);

      cy.get(".k-textbox")
        .eq(7)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMSAL"]);

      cy.get(".k-textbox")
        .eq(8)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMINP"]);

      cy.get(".k-textbox")
        .eq(9)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["RTINCP"]);

      cy.get(".k-textbox")
        .eq(10)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["STPR00_EXT"]);

      cy.get(".k-textbox")
        .eq(11)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["TXCOMM"]);

      const length = getLengthFromData(data, "ZE40");
      cy.getBySel("massiveGrid-records")
        .scrollIntoView()
        .should("be.visible")
        .should("contain", `records of ${length}`);
    });
  });
}
