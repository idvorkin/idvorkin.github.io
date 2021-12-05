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
    cy.visit("/magic"); // '/' is a bit slow, this page is fast
  }),
    it("go to ig66", () => {
      cy.get(".fa-baby-carriage").click();
      cy.location("pathname").should("equal", "/ig66/");
    }),
    it("go to tech", () => {
      cy.get(".fa-microchip").click();
      cy.location("pathname").should("equal", "/td/");
    }),
    it("go to todo enjoy", () => {
      cy.get(".fa-heart").click();
      cy.location("pathname").should("equal", "/todo_enjoy");
    }),
    it("go to 7 habits", () => {
      cy.get(".fa-hammer").click();
      cy.location("pathname").should("equal", "/7-habits");
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
          "https://github.com/idvorkin/idvorkin.github.io/blob/master/_posts/2016-04-21-magical-memories.md"
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
