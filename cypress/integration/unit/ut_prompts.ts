/// <reference types="cypress" />
import { UT, get_things_i_enjoy } from "../../../instrumented/random-prompter";

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

describe("Things I enjoy tests", () => {
  (beforeEach = () => {
    const $ = cy.stub();
  }),
    it("sanity", () => {
      const root = get_things_i_enjoy();
      assert.notEqual(root.children.length, 0);
    });
});

describe("Page Navigation works", () => {
  (beforeEach = () => {
    const $ = cy.stub();
  }),
    it("can load", () => {
      const t = new UT.TreeNode({ name: "Hi" });
    });
  it("can walk an empty tree", () => {
    const t = new UT.TreeNode({ name: "Hi" });
    let i = 0;
    for (const [current, parent] of UT.breadth_first_walk(t)) {
      i++;
    }
    assert.equal(i, 1);
  });
});

describe("Tree Walker", () => {
  it("can load", () => {
    const t = new UT.TreeNode({ name: "Hi" });
  });
  it("can walk an single tree", () => {
    const t = new UT.TreeNode({ name: "Hi" });
    let i = 0;
    for (const [current, parent] of UT.breadth_first_walk(t)) {
      i++;
    }
    assert.equal(i, 1);
  });
  it("can walk an empty tree", () => {
    let i = 0;
    for (const [current, parent] of UT.breadth_first_walk(null)) {
      i++;
    }
    assert.equal(i, 0);
  });
});
