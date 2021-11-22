/// <reference types="cypress" />
import { TreeNode } from "../../../src/play-sunburst";
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
describe("Page Navigation works", () => {
    (beforeEach = () => {
        const $ = cy.stub();
    }),
        it("can load", () => {
            const t = new TreeNode({ name: "Hi" });
        });
});
//# sourceMappingURL=sanity.js.map