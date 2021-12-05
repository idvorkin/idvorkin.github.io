/// <reference types="cypress" />


describe("Things I enjoy", () => {
  const default_prompt = "Click in the circle"
  const default_center_text = "Invest in"
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/todo_enjoy");
    cy.get("#sunburst text:first").as('donut-center')
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
      cy.get(".alert:first").should('contain.text',default_prompt)
      cy.get('@donut-center').click({force:true})
      cy.get(".alert:first").should('not.contain.text',default_prompt)
    });
    it("Click into magic zooms magic", () => {
      // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging

      // Click on magic
      const category_to_click="Magic"
      cy.get(`text:contains('${category_to_click}')`).click({force:true})
      cy.get('@donut-center').should('contain.text',category_to_click)

      // Click again should go back to default_prompt
      cy.get('@donut-center').click({force:true})
      cy.get('@donut-center').should('contain.text', default_center_text)

      // click on magic again
      cy.get(`text:contains('${category_to_click}')`).click({force:true})

      // click on coin Magic
      cy.get(`text:contains('Coin Magic')`).click({force:true})

      // since no sub categories, should not redraw
      cy.get('@donut-center').should('contain.text', 'Magic')

      // go back to default_prompt by clicking center
      cy.get('@donut-center').click({force:true})
      cy.get('@donut-center').should('contain.text', default_center_text)
    });
});
