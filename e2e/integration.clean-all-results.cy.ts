import cyconstants from "../support/cyconstants";

let requestsData = [];
//ENV : DV46 - MT22
before(() => {
  cy.clearCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.visit("/login");
  cy.login();
});

const selectAll = (dataTestId: string) => {
  cy.getBySel(dataTestId).click();
};

describe("should load the app and display the home page content", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });

  it("should cancel and delete all pending requests", () => {
    cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/requests**`, method: "GET" }).as("requests");
    cy.getBySel("requests-badge").click();
    cy.get(".fa-arrows-rotate").click();

    const getRequestsToCancel = () => {
      return cy.getBySel("row-cancel").then($elements => {
        const requestToCancel = $elements.filter(":not(.text-transparent)").length;
        return requestToCancel;
      });
    };

    const getRequestsToDelete = () => {
      return cy.getBySel("row-delete").then($elements => {
        const requestToDelete = $elements.filter(":not(.text-transparent)").length;
        return requestToDelete;
      });
    };

    const checkRequests = (requestsData: any, selectorExist: boolean) => {
      if (requestsData.length > 0) {
        getRequestsToCancel().then(requestToCancel => {
          if (requestToCancel > 0) {
            selectAll("cancel-all");
            cy.getBySel("button-annuler").click();
            cy.wait(2000);
            cancelAndDeleteLoop();
          } else {
            getRequestsToDelete().then(requestToDelete => {
              if (requestToDelete > 0) {
                selectAll("delete-all");
                cy.getBySel("button-delete").click();
                cy.wait(2000);
                cancelAndDeleteLoop();
              } else {
                if (selectorExist) {
                  const rightArrow = cy.getBySel("dms-table-chevron-right");
                  rightArrow.then($element => {
                    if (!$element.hasClass("text-disabled")) {
                      rightArrow.click();
                      checkRequests(requestsData, selectorExist);
                      return;
                    } else {
                      return;
                    }
                  });
                }
              }
            });
          }
        });
      }
    };

    const cancelAndDeleteLoop = async () => {
      cy.wait("@requests").then(({ response: { body } }: any) => {
        requestsData = body && body.request ? [...body.request] : [];
        let selectorExist = false;
        if (requestsData.length > 0) {
          cy.get(".table-box").then($el => {
            if ($el.find(".select-input").length > 0) {
              cy.get(".select-input").select("15");
              selectorExist = true;
            }
          });
          checkRequests(requestsData, selectorExist);
        } else {
          cy.skipOn(requestsData.length === 0);
        }
      });
    };

    cancelAndDeleteLoop();
  });

  // it("should cancel pending requests from HR-Space", () => {
  //   cy.origin(`${cyconstants.CYPRESS_HRASPACE_URL}`, { args: cyconstants }, cyconstants => {
  //     // cy.wait(5000);
  //     cy.visit("/hra-space/portal");
  //     // Rellena el formulario de login
  //     if (!cy.url().should("include", "/root")) {
  //       cy.get("#loginid").type(cyconstants.username);
  //       cy.get("#password").type(cyconstants.password);

  //       // Haz clic en el botón de login
  //       cy.get("input[type=submit]").click();
  //     } else {
  //       cy.wait(2000);
  //       cy.get("#roleComboCurrent").click();
  //     }
  //   });
  // });
});
