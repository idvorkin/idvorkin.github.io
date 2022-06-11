/// <reference types="cypress" />

import { gray } from "d3";

// TODO: DRY vs todo enjoy test!

describe("7 habits", () => {
  const known_category_on_sunburst = "Be Proactive";
  const get_default_prompt = () => cy.get("#sunburst_text");
  const get_donut_center = () => cy.get(".sunburst text:first");
  beforeEach(() => {
    cy.visit("/7-habits");
  }),
    it("Has to known category", () => {
      cy.get(`text:contains('${known_category_on_sunburst}')`).should(
        "have.text",
        known_category_on_sunburst
      );
    }),
    it("Text changes when clicking on donut ", function() {
      /*need function to access this variables*/
      // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging
      get_default_prompt()
        .invoke("text")
        .then(original_text => {
          get_donut_center().click({ force: true });
          get_default_prompt()
            .invoke("text")
            .should("not.eq", original_text);
        });
    });
});
