/// <reference types="cypress" />

describe("welcome component", () => {

    beforeEach(() => {
        cy.visit("/setup/welcome");
        cy.get("app-button").eq(0).as("registerbtn")
        cy.get("app-button").eq(1).as("loginbtn")

    });

    it('Buttons should have the correct name', () => {
        cy.get("@registerbtn").contains("Let's get started");
        cy.get("@loginbtn").contains("Login");
    });

    describe('Buttons should route correctly', () => {
        it('Register Button', () => {
            cy.get("@registerbtn").click();
            cy.url().should('include',"/setup/register");
        });
        it('Login Button', () => {
            cy.get("@loginbtn").click();
            cy.url().should('include',"/setup/login");
        });

    });


});