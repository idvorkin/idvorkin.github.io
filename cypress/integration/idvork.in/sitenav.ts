/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Page Navigation works", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/");
  }),
    it("go to ig66", () => {
      cy.get(".fa-baby-carriage").click();
      cy.location("pathname").should("equal", "/ig66/");
    }),
    it("go to tech", () => {
      cy.get(".fa-microchip").click();
      cy.location("pathname").should("equal", "/td/");
    }),
    it("go to tags", () => {
      cy.get(".fa-tags").click();
      cy.location("pathname").should("equal", "/tags");
    }),
    it("go to about", () => {
      cy.get(".fa-info-circle").click();
      cy.location("pathname").should("equal", "/about");
    }),
    it("goto edit", () => {
      cy.get(".fa-github")
        .parent()
        .should("have.attr", "href")
        .and(
          "equal",
          "https://github.com/idvorkin/idvorkin.github.io/blob/master/index.html"
        );
    }),
    it("go to linked in", () => {
      // Can't verify left page since that has a cross-origin error
      // https://docs.cypress.io/guides/guides/web-security#Limitations

      cy.get(".fa-linkedin")
        .parent()
        .should("have.attr", "href")
        .and("equal", "/linkedin");
    });
});
