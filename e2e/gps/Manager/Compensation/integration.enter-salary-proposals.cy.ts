import { getLengthFromData, getValueFromData } from "../../../../support/functions";
import cyconstants from "../../../../support/cyconstants";
import { IGPConfig } from "../../../../support/interfaces";
import { formatDateSpain } from "../../../../../src/app/infrastructure/processing/general/time";
import { cyConf } from "../../../../support/envsAndUsers";
import { dataMapping } from "../../../../support/dataMapping";
//ENV : MT22
let roles: any = [];
let proposals: any = [];
let results: any = [];
let data: any = [];
let massiveGridData: any = {};
let updatedNewSalary: any;
let updatedIncreaseAmount: any;
let updatedNewPercentage: any;
let newPercentage: any;
const newComm: string = "cypress test";

const GPConfig: IGPConfig = {
  id: "ASD640MT",
  menuPath: { topic: "Compensation", name: "Enter salary proposals" }
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

    it("should switch to the manager role and redirect to Enter salary proposals gp", () => {
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
      cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/${GPConfig.id}/paramdatav2**`, method: "POST" }).as(GPConfig.id);

      cy.get(".gp-topic-item-hover", { timeout: 25000 })
        .contains("Compensation")
        .click();
      cy.get(".gp-menu-list-label-container")
        .contains("Salary review")
        .click();
      cy.getBySel("paginated-table-row", { timeout: 25000 })
        .eq(0)
        .should("be.visible")
        .click();
      cy.wait(2000);

      cy.get(".card-header")
        .contains(GPConfig.menuPath.name)
        .should("be.visible");

      cy.wait(`@${GPConfig.id}`).then(({ response: { body } }: any) => {
        data = body.occurrences.occurrence;
        results = getValueFromData(data, fetchGpData.dataSearch);

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

      cy.getBySel("AMNT1")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT1"]);

      cy.getBySel("AMNT1D")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT1D"]);

      cy.getBySel("AMNT2")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT2"]);

      cy.getBySel("AMNT2D")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT2D"]);

      cy.getBySel("AMNT3")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT3"]);

      cy.getBySel("AMNT3D")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT3D"]);

      cy.getBySel("AMNT4")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT4"]);

      cy.getBySel("AMNT4D")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["AMNT4D"]);

      cy.getBySel("RTVALU")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["RTVALU"]);

      cy.getBySel("COUNT1")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["COUNT1"]);

      cy.getBySel("COUNT2")
        .should("be.visible")
        .should("be.disabled")
        .should("have.value", results["COUNT2"]);

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
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["MATCLE"]);

      cy.get(".k-textbox")
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDJB00_EXT"]);

      cy.get(".k-textbox")
        .eq(2)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["RTPDHR"]);

      cy.get(".k-textbox")
        .eq(3)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMANN"]);

      cy.get(".k-textbox")
        .eq(4)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDCUR"]);

      cy.get(".k-textbox")
        .eq(5)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMSAL"]);

      cy.get(".k-textbox")
        .eq(6)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMINP"]);

      cy.get(".k-textbox")
        .eq(7)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["RTINCP"]);

      cy.get(".k-textbox")
        .eq(8)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["STPR00_EXT"]);

      cy.get(".k-textbox")
        .eq(9)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["TXCOMM"]);

      const length = getLengthFromData(data, "ZE40");
      cy.getBySel("massiveGrid-records")
        .scrollIntoView()
        .should("be.visible")
        .should("contain", `records of ${length}`);
    });

    it("Increase the salary percentage and check if the values change correctly in the next step", () => {
      cy.get(".k-textbox")
        .eq(3)
        .invoke("val")
        .then((value: any) => {
          const currentSalary = value;

          cy.get(".k-textbox")
            .eq(7)
            .invoke("val")
            .then((value: any) => {
              const increasePercentage = value;
              newPercentage = parseInt(increasePercentage) + 10;

              cy.get(".k-textbox")
                .eq(7)
                .scrollIntoView()
                .click()
                .clear()
                .type(newPercentage);

              cy.get(".k-textbox")
                .eq(9)
                .scrollIntoView()
                .should("be.visible")
                .clear()
                .type(newComm);

              cy.getBySel("button-next")
                .contains("Next")
                .click();

              cy.wait(2000);

              updatedNewSalary = parseInt(currentSalary) + parseInt(currentSalary) * (parseInt(newPercentage) / 100) /* .toFixed(1) */;
              updatedIncreaseAmount = updatedNewSalary - parseInt(currentSalary) /* .toFixed(1) */;
              updatedNewPercentage = parseInt(newPercentage) /* .toFixed(1) */;

              cy.get(".k-textbox")
                .eq(0)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["MATCLE"]);

              cy.get(".k-textbox")
                .eq(1)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["IDJB00_EXT"]);

              cy.get(".k-textbox")
                .eq(2)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["RTPDHR"]);

              cy.get(".k-textbox")
                .eq(3)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["AMANN"]);

              cy.get(".k-textbox")
                .eq(4)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["IDCUR"]);

              cy.get(".k-textbox")
                .eq(5)
                .scrollIntoView()
                .should("have.value", updatedNewSalary);

              cy.get(".k-textbox")
                .eq(6)
                .scrollIntoView()
                .should("have.value", updatedIncreaseAmount);

              cy.get(".k-textbox")
                .eq(7)
                .scrollIntoView()
                .should("have.value", updatedNewPercentage);

              cy.get(".k-textbox")
                .eq(8)
                .scrollIntoView()
                .should("be.visible")
                .should("have.value", massiveGridData["STPR00_EXT"]);

              cy.get(".k-textbox")
                .eq(9)
                .scrollIntoView()
                .should("have.value", newComm);

              cy.getBySel("data-submit")
                .contains("Submit")
                .click();
              cy.getBySel("snackbar-toast").should("have.text", "Request sent with success");
              cy.getBySel("gp-submitted-with-success").should("be.visible");
            });
        });
    });

    it("Return to the GP and check if the data changes correctly", () => {
      cy.getBySel("button-return")
        .contains("Return")
        .click();

      cy.wait(2000);

      cy.getBySel("paginated-table-row", { timeout: 25000 })
        .eq(0)
        .should("be.visible")
        .click();

      cy.wait(2000);

      cy.get(".k-textbox")
        .eq(0)
        .should("be.visible")
        .should("have.value", massiveGridData["MATCLE"]);

      cy.get(".k-textbox")
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDJB00_EXT"]);

      cy.get(".k-textbox")
        .eq(2)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["RTPDHR"]);

      cy.get(".k-textbox")
        .eq(3)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["AMANN"]);

      cy.get(".k-textbox")
        .eq(4)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["IDCUR"]);

      cy.get(".k-textbox")
        .eq(5)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", updatedNewSalary);

      cy.get(".k-textbox")
        .eq(6)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", updatedIncreaseAmount);

      cy.get(".k-textbox")
        .eq(7)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", updatedNewPercentage);

      cy.get(".k-textbox")
        .eq(8)
        .scrollIntoView()
        .should("be.visible")
        .should("have.value", massiveGridData["STPR00_EXT"]);

      cy.get(".k-textbox")
        .eq(9)
        .scrollIntoView()
        .should("have.value", newComm);
    });
  });
}
