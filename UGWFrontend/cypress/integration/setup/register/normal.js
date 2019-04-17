/// <reference types="cypress" />

describe("register component", () => {

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

  describe("InputHandler validation", () => {

    beforeEach(() => {
      cy.visit("/setup/register");
      cy.get("app-input").get("input").type("Some Test");
      cy.wait(300);
      cy.get("app-button").eq(0).click();
    });

    it("should not be able to click, when nothing is filled out", () => {
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("not.exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when only passwordwhd is filled out", () => {
      cy.get("app-input > input").eq(2).type("testtesttest");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when only password is filled out", () => {
      cy.get("app-input > input").eq(1).type("testtesttest");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when password is invalidly filled out", () => {
      cy.get("app-input > input").eq(1).type("test");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when password and passwordwdh is invalidly filled out", () => {
      cy.get("app-input > input").eq(1).type("test");
      cy.get("app-input > input").eq(2).type("test");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("exist");
      cy.contains("Passwörter müssen gleich sein").should("not.exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when password and passwordwdh is invalidly filled out and different", () => {
      cy.get("app-input > input").eq(1).type("test");
      cy.get("app-input > input").eq(2).type("testt");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when password and passwordwdh is filled out but different", () => {
      cy.get("app-input > input").eq(1).type("testtesttest");
      cy.get("app-input > input").eq(2).type("test");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when email is filled out", () => {
      cy.get("app-input > input").eq(0).type("test@test.com");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("not.exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when email is filled out incorrectly", () => {
      cy.get("app-input > input").eq(0).type("testtest.com");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("not.exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when email is filled out incorrectly and passwdh is not correctly either", () => {
      cy.get("app-input > input").eq(0).type("testtest.com");
      cy.get("app-input > input").eq(2).type("testtest.com");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should not be able to click, when email is filled out correctly and passwdh is not correctly", () => {
      cy.get("app-input > input").eq(0).type("test@test.com");
      cy.get("app-input > input").eq(2).type("testtest.com");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

    it("should be able to click, when everything is filled out", () => {
      cy.get("app-input > input").eq(0).type("test@test.com");
      cy.get("app-input > input").eq(1).type("testtesttest");
      cy.get("app-input > input").eq(2).type("testtesttest");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "false");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("not.exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("not.exist");
      cy.contains("Passwörter müssen gleich sein").should("not.exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("exist"); // todo replace with network stub
    });
    it("should not be able to click, when everything is filled out incorrectly", () => {
      cy.get("app-input > input").eq(0).type("testtest.com");
      cy.get("app-input > input").eq(1).type("test");
      cy.get("app-input > input").eq(2).type("testt");
      cy.get("app-button").invoke("attr", "ng-reflect-disabled").should("equal", "true");
      cy.contains("Bitte korrekte E-Mail Adresse eingeben").should("exist");
      cy.contains("Passwort muss mindestens acht Zeichen lang sein").should("exist");
      cy.contains("Passwörter müssen gleich sein").should("exist");
      cy.get("app-button").click();
      cy.get("#backdrop").should("not.exist"); // todo replace with network stub
    });

  });

});
