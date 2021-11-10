/// <reference types="cypress" />

describe('Keyboard shortcuts work', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:4000/td')
  })

  , it('help loads', () => {
    cy.get('body').type('?') // Find first h3 to get out of the  main page
    // TODO what to assert here?cy.contains("shortcuts")
  })

  , it('go to ig66', () => {
    cy.get('body').type('6') // Find first h3 to get out of the  main page
    cy.location('pathname').should('match', /\/ig66/);

      // assert loaded

  }),
  it('go to random', () => {

    cy.get('body').type('z') // Find first h3 to get out of the  main page
    cy.location('href').should('match', /from_random/);
      // assert loaded

  })
})
