import cyconstants from "../support/cyconstants";
import "jquery";

//ENV : DV46 - MT22

const { username, password, language, loginModule } = cyconstants;

const laguages = ["en", "fr", "es", "it", "de", "ne", "be"]; // ordered according to the pages-messages-translations.csv file
const loginPageFields = [
  { label: "user.login", selector: "user\\.login" },
  { label: "user.password", selector: "user\\.password" },
  { label: "language", selector: "language" }
];
const chagePasswordFields = [
  { label: "user.login", selector: "user\\.login" },
  { label: "user.password", selector: "user\\.password" },
  { label: "language", selector: "language" },
  { label: "user.new-password", selector: "user\\.new-password" },
  { label: "user.password-confirmation", selector: "user\\.password-confirmation" }
];

let messagesTranslations: Object[];

before(() => {
  cy.clearCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  const fixtureName = "translations.csv";
  const splitter = ";";
  cy.csvToArr(fixtureName, splitter).then(dataArray => {
    messagesTranslations = dataArray;
  });
});

beforeEach(() => {
  cy.visit("/login");
});

describe("setting up the login page", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });

  it("fields and buttons should be displayed with the right labels according to the selected language", () => {
    laguages.forEach(language => {
      cy.getBySel("language")
        .should("be.visible")
        .select(language)
        .then(() => {
          loginPageFields.forEach(field => {
            const value: any = messagesTranslations.find((message: any) => message.key === field.label);
            cy.getBySel(field.selector)
              .siblings("label")
              .should("be.visible")
              .and("contain", value[language]);
          });
          const buttonText: any = messagesTranslations.find((message: any) => message.key === "button.connexion");
          cy.getBySel("button\\.connexion")
            .should("be.visible")
            .and("contain", buttonText[language]);

          const changePasswordLinkText: any = messagesTranslations.find((message: any) => message.key === "change-password");
          cy.get("a")
            .should("be.visible")
            .and("contain", changePasswordLinkText[language]);
        });
    });
  });
});

describe("perform actions on the login page", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // return false to prevent Cypress from failing the test
    return false;
  });

  it("it should show the login module input when the config button is clicked", () => {
    cy.getBySel("config-button").click();
    cy.getBySel("module").should("be.visible");
    cy.getBySel("module")
      .siblings("label")
      .should("have.text", "Módulo");
  });

  it("it should redirect to change password screen and display the right fields and buttons", () => {
    cy.get("a").click();
    cy.url().should("include", "/change-password");
    laguages.forEach(language => {
      cy.getBySel("language")
        .should("be.visible")
        .select(language)
        .then(() => {
          chagePasswordFields.forEach(field => {
            const value: any = messagesTranslations.find((message: any) => message.key === field.label);
            cy.getBySel(field.selector)
              .siblings("label")
              .should("be.visible")
              .and("contain", value[language]);
          });
          const buttonText: any = messagesTranslations.find((message: any) => message.key === "button.send");
          cy.getBySel("button\\.send")
            .should("be.visible")
            .and("contain", buttonText[language]);

          const returnLinkText: any = messagesTranslations.find((message: any) => message.key === "button.changepass");
          cy.get("a")
            .should("be.visible")
            .and("contain", returnLinkText[language]);
        });
    });
    cy.get("a").click();
    cy.url().should("include", "/login");
  });

  it("should display an error message with invalid credentials", () => {
    // Enter an invalid username and password in the login form
    cy.getBySel("user\\.login")
      .clear()
      .type("invalid@example.com");
    cy.getBySel("user\\.password")
      .clear()
      .type("invalidPassword");
    cy.getBySel("language").select(language);
    cy.getBySel("button\\.connexion").click();
    cy.contains("The given user ID contains at least an invalid character");
  });

  it("should log in with the correct login module if the select is displayed ", () => {
    // Retrieve the authentication credentials from environment variables
    cy.getBySel("user\\.login")
      .clear()
      .type(username);
    cy.getBySel("user\\.password")
      .clear()
      .type(password);
    cy.getBySel("language").select(language);
    cy.get("select")
      .should("be.visible")
      .then($select => {
        if ($select.is(":visible")) {
          $select.val(loginModule).trigger("select");
        }
      });
  });

  it("should change password and login", () => {
    const newPass = "HR";
    cy.get("a").click();
    cy.url().should("include", "/change-password");
    cy.changePassword(username, password, newPass, newPass, language);
  });
});
