/// <reference types="cypress" />

describe("Things I enjoy", () => {
  const get_default_prompt = () => cy.get("#sunburst_text");
  const get_donut_center = () => cy.get(".sunburst text:first");
  const get_blog_post = () => cy.get("#random-blog-posts");
  const default_center_text = "Invest in";
  const hobbies = "Hobbies";
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/todo_enjoy");
  }),
    it("loads", () => {
      cy.location("href").should("match", /todo_enjoy/);
    });
  it("Has hobbies in donut", () => {
    cy.contains(hobbies).should("have.text", hobbies);
  });
  it("Click random blog post randomizes", function() {
    get_blog_post()
      .invoke("text")
      .then(original_text => {
        get_blog_post().click({ force: true });
        get_blog_post()
          .invoke("text")
          .should("not.eq", original_text);
      });
  });
  it("Get different prompt clicking in donut ", function() {
    get_default_prompt()
      .invoke("text")
      .then(original_text => {
        get_donut_center().click({ force: true });
        get_default_prompt()
          .invoke("text")
          .should("not.eq", original_text);
      });
  });
  it("Click into Hobbies zooms Hoobies, click again zooms out", function() {
    // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Debugging

    // click on magic
    cy.contains(hobbies).click({ force: true });
    get_donut_center().should("contain.text", hobbies);

    // Click again should go back to default center text
    get_donut_center().click({ force: true });
    get_donut_center().should("contain.text", default_center_text);
  });
  it("Leaf selection doesn't change center text", function() {
    const hobbies = "Hobbies";
    const juggling = "Juggling";
    // go into hobbies
    cy.contains(hobbies).click({ force: true });
    get_donut_center().should("contain.text", hobbies);

    cy.contains(juggling).click({ force: true });

    // since no sub categories, should not change center
    get_donut_center().should("contain.text", hobbies);

    // go back to default_prompt by clicking center
    get_donut_center().click({ force: true });
    get_donut_center().should("contain.text", default_center_text);
  });
  it("Click prompt randomizes", function() {
    get_default_prompt()
      .invoke("text")
      .then(original_text => {
        get_default_prompt().click({ force: true });
        get_default_prompt()
          .invoke("text")
          .should("not.eq", original_text);
      });
    // Do it again to make sure it's random
    get_default_prompt()
      .invoke("text")
      .then(original_text => {
        get_default_prompt().click({ force: true });
        get_default_prompt()
          .invoke("text")
          .should("not.eq", original_text);
      });
  });
});
