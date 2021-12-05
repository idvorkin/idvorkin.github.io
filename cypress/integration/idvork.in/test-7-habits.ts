/// <reference types="cypress" />

// TODO: DRY vs todo enjoy test!

describe("7 habits", () => {
  const category_to_find = "Be Proactive";
  beforeEach(() => {
    cy.visit("/7h");
    cy.get(".alert:first")
      .invoke("text")
      .as("default_prompt");
    cy.get("#sunburst text:first").as("donut_center");
    cy.get("#sunburst text:first")
      .invoke("text")
      .as("default_center_text");
  }),
    it("has to contain proactive", () => {
      cy.get(`text:contains('${category_to_find}')`).should(
        "have.text",
        category_to_find
      );
    }),
    it("Get different prompt clicking in donut ", function() {
      /*need function to access this variables*/
      // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging
      cy.get(".alert:first").should("contain.text", this.default_prompt);
      cy.get("@donut_center").click({ force: true });
      cy.get(".alert:first").should("not.contain.text", this.default_prompt);
    });
});
