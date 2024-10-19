// Import the env object from the config module to retrieve environment variables
import "jquery";
import cyconstants from "../support/cyconstants";
//ENV : DV46
let tasksData: any = [];
let notificationsData: any = [];
let documents: any = [];
let requestsData: any = [];
let reportsData: any = [];
let closedtasks: any = [];

before(() => {
  cy.clearCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.visit("/login");

  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/login`, method: "POST" }).as("rolesList");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/notifications**`, method: "GET" }).as("notifications");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks**`, method: "GET" }).as("tasks");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/requests**`, method: "GET" }).as("requests");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/documents**`, method: "GET" }).as("documents");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/query**`, method: "GET" }).as("reports");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/closedtasks**`, method: "GET" }).as("closedtasks");

  cy.login();
  cy.wait("@notifications").then(({ response: { body } }: any) => {
    notificationsData = body && body.notification ? [...body.notification] : [];
  });
  cy.wait("@tasks").then(({ response: { body } }: any) => {
    tasksData = body && body.task ? [...body.task] : [];
  });
  cy.wait("@requests").then(({ response: { body } }: any) => {
    requestsData = body && body.request ? [...body.request] : [];
  });
  cy.wait("@documents").then(({ response: { body } }: any) => {
    documents = body;
  });
  cy.wait("@reports").then(({ response: { body } }: any) => {
    reportsData = body && body.query ? [...body.query] : [];
  });
  cy.wait("@closedtasks").then(({ response: { body } }: any) => {
    closedtasks = body.closedTask;
  });
});

describe("should load the app and display the home page content", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });

  it("should redirect to tasks page and check if the data displayed is correct and be able to search for a specific line from the table", () => {
    cy.wait(3000);
    cy.getBySel("tasks-badge").click();
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(0)
      .click();
    cy.checkTableData(tasksData);
    tasksData.length > 0 && cy.searchDataFromTable(tasksData, "@label");
    cy.getBySel("search-box-text").clear();
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(1)
      .click();
    cy.checkTableData(closedtasks);
    closedtasks.length > 0 && cy.searchDataFromTable(closedtasks, "@label");
    cy.getBySel("search-box-text").clear();
  });

  it("should redirect to notifications page and check if the data displayed is correct and be able to search for a specific line from the table", () => {
    cy.getBySel("notifications-badge").click();
    cy.checkTableData(notificationsData);
    notificationsData.length > 0 && cy.searchDataFromTable(notificationsData, "@message");
    cy.getBySel("search-box-text").clear();
  });

  it("should redirect to requests page and check if the data displayed is correct and be able to search for a specific line from the table", () => {
    cy.getBySel("requests-badge").click();
    cy.checkTableData(requestsData);
    requestsData.length > 0 && cy.searchDataFromTable(requestsData, "@label");
    cy.getBySel("search-box-text").clear();
  });

  it("should redirect to documents page and check if the data displayed is correct and be able to search for a specific line from the table", () => {
    cy.getBySel("documents-badge").click();
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(0)
      .click();
    cy.checkTableData(documents.cms);
    documents.cms && documents.cms.length > 0 && cy.searchDataFromTable(documents.cms, "@title");
    cy.getBySel("search-box-text").clear();
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(1)
      .click();
    cy.checkTableData(documents.dms);
    documents.dms && documents.dms.length > 0 && cy.searchDataFromTable(documents.dms, "@title");
    cy.getBySel("search-box-text").clear();
  });

  it("should redirect to reports page and check if the data displayed is correct", () => {
    cy.getBySel("reports-badge").click();
    cy.checkTableData(reportsData);
  });
});
