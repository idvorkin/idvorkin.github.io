/// <reference types="cypress" />

describe("Prompts Randomize", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:4000/todo_enjoy");
  }),
    it("loads", () => {
      // TODO what to assert here?cy.contains("shortcuts")
      cy.location("href").should("match", /todo_enjoy/);
    }),
    it("gets different prompt every time", () => {
      // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging
      // Prompt should load in first  alert.
      cy.get(".alert:first").then($alert => {
        const first_prompt = String($alert.text());
        cy.reload().then(() => {
          // Fragile, could match an undefined.
          cy.get(".alert:first").should("not.have.text", first_prompt);
        });
      });
    });
});
