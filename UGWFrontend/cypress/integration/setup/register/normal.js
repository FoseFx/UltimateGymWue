/// <reference types="cypress" />

describe("register component", () => {

  beforeEach(() => {
  });

  describe("routing", () => {
    it('should not allow, when "reload"', () => {
      cy.visit("/setup/register/normal");
      cy.url().should("equal", "http://localhost:4200/setup/register");
    });
    it("should allow, when directed here and show input", () => {
      cy.visit("/setup/register");
      cy.get("app-input").get("input").type("Some Test");
      cy.wait(300);
      cy.get("app-button").eq(0).click();
      cy.url().should("equal", "http://localhost:4200/setup/register/normal");
      cy.contains("Hey Some Test");
    });
  });

});
