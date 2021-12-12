/// <reference types="cypress" />

describe('Keyboard shortcuts work', () => {
  beforeEach(() => {
    cy.visit('/td').wait(500) // ensure keyboard handers get bound.
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
