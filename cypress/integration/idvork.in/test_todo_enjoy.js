/// <reference types="cypress" />

describe("Things I enjoy", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:4000/todo_enjoy");
  }),
    it("loads", () => {
      cy.location("href").should("match", /todo_enjoy/);
    }),
    it("has magic in donut", () => {
      const category_to_find = "Magic"
      cy.get(`text:contains('${category_to_find}')`).should("have.text", category_to_find);
    }),
    it("Get different prompt clicking in donut ", () => {
      // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging
      const default_prompt = "Click in the circle"
      cy.get(".alert:first").should('contain.text',default_prompt) 
      cy.get("#sunburst text:first").click({force:true})
      cy.get(".alert:first").should('not.contain.text',default_prompt) 
    });
});
