/// <reference types="cypress" />


describe('Keyboard shortcuts work', () => {
  const start_page ='/save-the-soup'
  beforeEach(() => {
    cy.visit(start_page).wait(500); // fast page, give keybindings time to load
  })

  , it('help loads', () => {
    cy.get('body').type('?') // Find first h3 to get out of the  main page
    // TODO what to assert here?cy.contains("shortcuts")
  })

  , it('go to ig66', () => {
    cy.get('body').type('6') // Find first h3 to get out of the  main page
    cy.location('pathname').should('contain', 'ig66');

      // assert loaded

  }),
  it('go to random', () => {

    cy.get('body').type('z') // Find first h3 to get out of the  main page
    cy.location('href').should('not.equal', start_page);
      // assert loaded

  })
})
