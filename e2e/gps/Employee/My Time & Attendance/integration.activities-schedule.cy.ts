import moment from "moment";
import cyconstants from "../../../../support/cyconstants";

let data: any = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();
const currentMonth = today.getMonth();
const year = today.getFullYear();
let pointedDate = new Date(today);
let userDescription: any = [];
let event: any = {};

before(() => {
  cy.clearCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.visit("/login");
  cy.login().then(res => {
    userDescription = res.userDescription;
  });
  cy.wait(2000);
});

describe("should load the app and display the home page content", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });

  it("should redirect to Activities schedule", () => {
    cy.intercept({ url: `${cyconstants.CYPRESS_API_BASE_URL}/gp/AGC05E00/paramdatav2?**`, method: "POST" }).as("AGC05E00");

    cy.get(".gp-topic-item-hover", { timeout: 25000 })
      .contains("My Time & Attendance")
      .click();
    cy.get(".gp-menu-list-label-container")
      .contains("Activities schedule")
      .click();

    cy.get(".card-header", { timeout : 25000 })
      .contains("Activities schedule")
      .should("be.visible");

    cy.wait("@AGC05E00", { timeout: 20000 }).then(({ response: { body } }: any) => {
      data = body.occurrences.occurrence;
    });
  });

  it("should display the selector's month days with their events correctly", () => {
    cy.get(".table-cell")
      .contains(userDescription.name)
      .should("be.visible");
    cy.get(".calendar-date").each((day, index) => {
      cy.wrap(day)
        .invoke("text")
        .then(text => {
          pointedDate.setDate(index + 1);
          const formattedDate: string = moment(pointedDate).format("dd") + pointedDate.toLocaleDateString("en-US", { day: "2-digit" });
          expect(text).to.include(formattedDate);
        });

      cy.get(".calendar-event")
        .eq(index)
        .should("be.visible")
        .then($element => {
          pointedDate.setDate(index + 1);
          const day = pointedDate.toLocaleDateString("en-US", { day: "2-digit" });
          const month = pointedDate.toLocaleDateString("en-US", { month: "2-digit" });
          const eventDate = `${year}-${month}-${day}`;

          data.forEach((element: any) => {
            let findData = element.data.find((obj: any) => obj.value === eventDate);
            if (findData) {
              event = element.data.find((obj: any) => obj.item === "TLTPM1");
            }
          });
          cy.wrap($element)
            .should("be.visible")
            .should("have.text", event.value);
        });
    });
  });

  it("should verify month and year selectors behaviors", () => {
    cy.get(".month-selector").should("be.visible");
    cy.getBySel("chevron-left").should("be.visible");
    cy.getBySel("month-button")
      .contains(months[currentMonth])
      .should("be.visible");
    cy.getBySel("chevron-right").should("be.visible");
    cy.getBySel("year-button")
      .contains(year)
      .should("be.visible");
  });
});
