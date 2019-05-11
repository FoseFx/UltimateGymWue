/// <reference types="cypress" />

describe("welcome component", () => {

  beforeEach(() => {
    cy.visit("http://localhost:4200/setup/welcome");
    cy.get("app-button").eq(0).as("registerbtn");
    cy.get("app-button").eq(1).as("loginbtn");

  });

  describe('routing', () => {

    it('should stay, when localhost is empty', () => {
      cy.url().should('equal', 'http://localhost:4200/setup/welcome');
    });

    it('should route to /setup/basics/creds, when only login data set', () => {
      // set login data
      cy.window().its('AppService').its('store').invoke('update', {
        loginData: {
          uid: 'sth',
          provider: ['normal'],
          normal: {
            email: 'sth@sjd.com',
            email_verified: false
          }
        },
        basics: null
      });
      cy.window().its('AppService').invoke('save');
      cy.visit("http://localhost:4200/setup/welcome");
      // only loggedin, no basics set, so NeedsSetupGuard will route to /setup/basics, which redirects to /setup/bascis/creds
      cy.url().should('equal', 'http://localhost:4200/setup/basics/creds');
    });

  });



  it("Buttons should have the correct name", () => {
      cy.get("@registerbtn").contains("Let's get started");
      cy.get("@loginbtn").contains("Login");
  });

  describe("Buttons should route correctly", () => {
      it("Register Button", () => {
          cy.get("@registerbtn").click();
          cy.url().should("include", "/setup/register");
      });
      it("Login Button", () => {
          cy.get("@loginbtn").click();
          cy.url().should("include", "/setup/login");
      });
      // todo legal button
  });

});
