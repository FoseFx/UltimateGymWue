/// <reference types="cypress" />

describe("register component", () => {

    beforeEach(() => {
        cy.visit("/setup/register");
        cy.get("app-input").get("input").as("name");
        cy.get("app-button").eq(0).as("normalbtn");
        cy.get("app-button").eq(1).as("googlebtn");
        cy.get("app-button").eq(2).as("instabtn");

    });

    describe("Full Name", () => {

        describe("allowed", () => {
            it('should validate "Some Name"', () => {
                cy.get("@name").click().type("Some Name");
            });
            it('should validate "Äößsad Öjasndü"', () => {
                cy.get("@name").click().type("Äößsad Öjasndü");
            });
            afterEach(() => {
                cy.get("@normalbtn").invoke("attr", "ng-reflect-disabled").should("equal", "false");
                cy.get("@googlebtn").invoke("attr", "ng-reflect-disabled").should("equal", "false");
                cy.get("@instabtn").invoke("attr", "ng-reflect-disabled").should("equal", "false");
            });
        });

        describe("disallowed", () => {
            it('should not validate "SomeName"', () => {
                cy.get("@name").click().type("SomeName");
            });
            it('should not validate "some name"', () => {
                cy.get("@name").click().type("some name");
            });
            it('should not validate "Äö4ßsad Ö1jasndü"', () => {
                cy.get("@name").click().type("Äö4ßsad Ö1jasndü");
            });

            afterEach(() => {
                cy.get("@normalbtn").invoke("attr", "ng-reflect-disabled").should("equal", "true");
                cy.get("@googlebtn").invoke("attr", "ng-reflect-disabled").should("equal", "true");
                cy.get("@instabtn").invoke("attr", "ng-reflect-disabled").should("equal", "true");
            });
        });

    });

});
