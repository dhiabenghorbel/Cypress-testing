// Import the env object from the config module to retrieve environment variables
import cyconstants from "../support/cyconstants";
import "jquery";
import { getGpsByTopics } from "../support/functions";
import { cyConf } from "../support/envsAndUsers";
//ENV : DV46
let messagesTranslations: Object[];
let rolesList: any = [];
let tasksData: any = [];
let notificationsData: any = [];
let documents: any = [];
let requestsData: any = [];
let reportsData: any = [];
let userDescription: any = [];
let gpMenu: any = [];
let roles: any = {};

const laguages = ["en", "fr", "es", "it", "de", "ne", "be"]; // ordered according to the pages-messages-translations.csv file
const badges = ["tasks-badge", "documents-badge", "notifications-badge", "reports-badge", "reports-badge"];

before(() => {
  cy.clearCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.visit("/login");
  const fixtureName = "translations.csv";
  const splitter = ";";
  cy.csvToArr(fixtureName, splitter).then(dataArray => {
    messagesTranslations = dataArray;
  });

  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/login`, method: "POST" }).as("rolesList");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/notifications**`, method: "GET" }).as("notifications");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/tasks**`, method: "GET" }).as("tasks");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/requests**`, method: "GET" }).as("requests");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/documents**`, method: "GET" }).as("documents");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/query**`, method: "GET" }).as("reports");
  cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp**`, method: "GET" }).as("gpmenu");

  cy.login().then(res => {
    roles = res.roles;
    userDescription = res.userDescription;
  });

  cy.wait("@notifications").then(({ response: { body } }: any) => {
    notificationsData = body && body.notification && body && body.notification.length ? [...body.notification] : [];
  });
  cy.wait("@tasks").then(({ response: { body } }: any) => {
    tasksData = body && body.task && body && body.task.length ? [...body.task] : [];
  });
  cy.wait("@requests").then(({ response: { body } }: any) => {
    requestsData = body && body.request && body && body.request.length ? [...body.request] : [];
  });
  cy.wait("@documents").then(({ response: { body } }: any) => {
    documents = body;
  });
  cy.wait("@reports").then(({ response: { body } }: any) => {
    reportsData = body && body.query && body && body.query.length ? [...body.query] : [];
  });
  cy.wait("@gpmenu").then(({ response: { body } }: any) => {
    gpMenu = body.topic;
  });
});

describe("should load the app and display the home page content", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });
  it("should display toolbar with the right elements : home button, roles  list, language selector, logout button", () => {
    cy.get(".menu-header")
      .should("be.visible")
      .within(() => {
        cy.getBySel("home-button").should("be.visible");
        cy.getBySel("logout-button").should("be.visible");
        cy.getBySel("switch-language").should("be.visible");
      });
    cy.getBySel("role-button").should("be.visible");
  });

  it("should redirect to base URL upon clicking on home Icon", () => {
    cy.getBySel("home-button")
      .click()
      .then(() => {
        cy.url().should("include", Cypress.config("baseUrl"));
      });
  });

  it("should display the right role, and a functional roles list", () => {
    const currentUserSS = sessionStorage.getItem("current-user-ss");
    const currentUser = currentUserSS ? JSON.parse(currentUserSS) : null;
    const userRoleContent = currentUser["@category"] === "SSEMP" ? "EMPLOYEE" : "MMGRHIE";
    cy.getBySel("role-button")
      .should("be.visible")
      .contains(userRoleContent)
      .click()
      .then(() => {
        cy.getBySel("roles-list-with-search")
          .should("be.visible")
          .find("li");
        // .then($roles => {
        //   const rolesValues = Array.from($roles).map((role) => role.innerText.trim());
        //   const rolesLabels = rolesList.map((role: any) => role['@label']);
        //   expect(rolesValues).to.include.members(rolesLabels);
        // })
      });
  });

  it("should be able to search for a specific role from list", () => {
    cy.getBySel("roles-list-search-input")
      .should("be.visible")
      .type(roles.managerRoleLabel)
      .then(() => {
        cy.getBySel("roles-list-with-search")
          .should("be.visible")
          .find("li")
          .then($roles => {
            const rolesValues = Array.from($roles).map(role => role.innerText.trim());
            expect(rolesValues).to.include(roles.managerRoleLabel);
            rolesList;
          });
      });
    cy.getBySel("roles-list-search-input")
      .clear()
      .then(() => {
        cy.getBySel("roles-list-with-search")
          .should("be.visible")
          .find("li");
        // .then($roles => {
        //   const rolesValues = Array.from($roles).map((role) => role.innerText.trim());
        //   const rolesLabels = rolesList.map((role: any) => role['@label']);
        //   expect(rolesValues).to.include.members(rolesLabels);
        // })
      });
    cy.getBySel("home-button").click();
  });

  it("should display user card with correct user info", () => {
    cy.contains(".user-card", userDescription.matcle);
    cy.get(".user-card").contains(userDescription.matcle);
    cy.get(".user-card").contains(userDescription.matcle);
    cy.get(".imgCircle")
      .should("be.visible")
      .should("have.attr", "src");
  });

  it("should display badges", () => {
    cy.get(".badge-container")
      .should("be.visible")
      .within(() => {
        badges.forEach(badge => {
          cy.getBySel(badge)
            .should("exist")
            .and("be.visible");
        });
      });
  });

  it("should get all request and display correct count on badge", () => {
    cy.getBySel("tasks-badge").checkCount(tasksData.length);
    cy.getBySel("notifications-badge").checkCount(notificationsData.length);
    cy.getBySel("requests-badge").checkCount(requestsData.length);
    cy.getBySel("documents-badge").checkCount(documents.length);
    cy.getBySel("reports-badge").checkCount(reportsData.length);
  });

  it("should display the GPs Menu with the specifics gps for this role", () => {
    let implementedTpcs: any = [];
    const currentUserSS = sessionStorage.getItem("current-user-ss");
    const currentUser = currentUserSS ? JSON.parse(currentUserSS) : null;
    if (currentUser["@model"] === "EMPLOYEE") {
      implementedTpcs = getGpsByTopics(gpMenu);
    }
    // else if (currentUser["@model"] === "MMGRHIE") {
    //   implementedTpcs = getGpsByTopics(allMMGRHIEGps);
    // } else if (currentUser["@model"] === "MMGROU") {
    //   implementedTpcs = getGpsByTopics(allMMGROUGps);
    // }
    cy.getBySel("gp-topics-list").should("be.visible");
    cy.get(".gp-topic-item")
      .should("be.visible")
      .should("have.length", gpMenu.length)
      .each(($item, index) => {
        const expectedLabel = gpMenu[index]["@label"];
        cy.wrap($item).should("have.text", expectedLabel);
      });
    // const topicToSearch = implementedTpcs[0].label;
    // cy.getBySel('search-topic').should('be.visible')
    //   .type(topicToSearch).then(() => {
    //     cy.getBySel('role-name')
    //       .should('be.visible')
    //       .then($topic => {
    //         const TopicValues = Array.from($topic).map((topic) => topic.innerText.trim());
    //         expect(TopicValues[0]).to.include(topicToSearch);
    //       })
    //   })
  });

  // it('should display HR News with the right documents', () => {

  //     cy.get('.hr-news').should('be.visible');
  //     cy.getBySel('hr-news-title').should('be.visible').should('have.text','HR News');
  //     cy.getBySel('card-front-side').filter(':visible').should('have.length', 2);
  //     cy.get('.hr-new-wrapper').should('be.visible');
  //     cy.get('.hr-new-date').should('be.visible');
  //     cy.get('.hr-new-menu-content').should('be.visible');

  //     // cy.get('.hr-new-text').should('be.visible');

  //     // cy.get('.hr-new-title').should('be.visible');
  //     // cy.get('.hr-new-button').should('be.visible');
  // });

  // it('should display HR Slider with the right documents', () => {
  //   cy.getBySel('slider').should('be.visible');
  //   cy.get('.slides').should('be.visible');
  //   cy.get('.slide').should('be.visible');
  //   cy.get('.content-txt').should('be.visible').should('have.length',9);

  // });

  it("should display documents card with the right elements : dms-title, chevron-left-button, chevron-right-button, other-elements", () => {
    cy.getBySel("dms-title").should("be.visible");
    cy.getBySel("document-card").should("be.visible");
    cy.get(".dms-wrapper").should("be.visible");
    cy.getBySel("chevron-right-button").should("be.visible");
    cy.getBySel("chevron-left-button")
      .should("be.visible")
      .click();
    cy.getBySel("dms-title").should("have.text", "My documents");
    cy.getBySel("chevron-right-button").click();
    cy.getBySel("dms-title").should("have.text", "Latest documents");
    cy.getBySel("chevron-right-button").click();
    cy.getBySel("dms-title").should("have.text", "My communications");
  });

  it("should display documents list and open modal card with the right elements : meta, description ,download-button", () => {
    cy.getBySel("dms-list").should("be.visible");
    cy.get(".dms-list-element").should("be.visible");
    cy.get(".dms-list-element").should("have.length", 3);
    cy.get(".documents-link")
      .eq(0)
      .click();
    cy.get(".modal").should("be.visible");
    cy.get(".blog-card").should("be.visible");
    cy.get(".meta").should("be.visible");
    cy.getBySel("dms-description").should("be.visible");
    if (documents.dms && documents.dms[0]["@attachmentsize"] !== "0") {
      cy.getBySel("download-link")
        .scrollIntoView()
        .should("be.visible")
        .click();
    }
    cy.getBySel("close-modal").click();
  });

  it('should redirect to document index upon clicking on "Consult the other elements" link', () => {
    cy.getBySel("other-elements")
      .should("be.visible")
      .click()
      .then(() => {
        cy.url().should("include", "/DocumentsIndex");
      });
  });
  it("should switching tabs and display the correct data for each tab", () => {
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(1)
      .click();
    cy.checkTableData(documents.dms);
    cy.getBySel("tab-selector")
      .should("be.visible")
      .eq(0)
      .click();
    cy.checkTableData(documents.cms);
  });

  it("should display expandable search input and be able to search for a specific line from the table", () => {
    const lineToSearch = documents.cms[0]["@title"];
    cy.getBySel("search-box-text")
      .type(lineToSearch)
      .then(() => {
        cy.getBySel("paginated-table-row")
          .should("be.visible")
          .then($lines => {
            const linesValues = Array.from($lines).map(line => line.innerText.trim());
            expect(linesValues[0]).to.include(lineToSearch);
          });
      });
  });

  it("should display document modal with the right elements", () => {
    cy.getBySel("paginated-table-row")
      .eq(0)
      .click();
    cy.get(".modal").should("be.visible");
    cy.get(".blog-card").should("be.visible");
    cy.get(".meta").should("be.visible");
    cy.getBySel("dms-description").should("be.visible");
    if (documents.cms && documents.cms[0]["@attachmentsize"] !== "0") {
      cy.getBySel("download-link")
        .scrollIntoView()
        .should("be.visible")
        .click();
    }
    cy.getBySel("close-modal").click();
    cy.getBySel("search-box-text").clear();
  });
});
