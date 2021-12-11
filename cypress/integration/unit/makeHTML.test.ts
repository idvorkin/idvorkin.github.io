/// <reference types="cypress" />
// import { UT as UTMain } from "../../../_site/assets/js/main.js";
import { IURLInfo, MakeBackLinkHTML } from "../../../src/main";
import { makePostPreviewHTML } from "../../../src/page-loader";

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

describe("Snapshot HTML Makers", () => {
  (beforeEach = () => {
    const $ = cy.stub();
  }),
    it("backLink", () => {
      const urlInfo: IURLInfo = {
        url: "https://www.google.com",
        title: "Google",
        description: "description",
        file_path: "",
        outgoing_links: [],
        incoming_links: [],
        redirect_url: "",
        doc_size: 0,
      };
      const backLinkHTML = MakeBackLinkHTML(urlInfo);
      const expectedHTML = `
<div>
    <div class="link-box description truncate-css"> <a href=https://www.google.com>Google</a>:<span class="link-description"> description <span></div>
</div>`;
      assert.equal(backLinkHTML, expectedHTML);
    });
  it("postPreview", () => {
    const urlInfo: IURLInfo = {
      url: "https://www.google.com",
      title: "Google",
      description: "description",
      file_path: "",
      outgoing_links: [],
      incoming_links: [],
      redirect_url: "",
      doc_size: 0,
    };
    const backLinkHTML = makePostPreviewHTML(urlInfo);
    const expectedHTML = `
      hi
      `;
  });
});
