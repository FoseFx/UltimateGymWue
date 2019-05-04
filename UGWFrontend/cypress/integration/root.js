/// <reference types="cypress" />

describe('root', () => {

  describe('routing', () => {

    it('should route to /setup/welcome, when nothing set', function () {
      localStorage.clear();
      cy.visit('http://localhost:4200/');
      cy.url().should('equal', 'http://localhost:4200/setup/welcome');
      localStorage.clear();
    });

    it('should route to /setup/basics/stufen, when logged in, but no basics set', function () {

      cy.visit('http://localhost:4200/');

      cy.window().its('AppService').its('store').invoke('update', {
        meta: {
          version: 'kdss'
        },
        loginData: {
          uid: 'sth',
          provider: ['normal'],
          normal: {
            email: 'sth@sjd.com',
            email_verified: false
          }
        },
        fullname: 'test',
        basics: null,
        menuOpen: false
      });
      cy.window().its('AppService').invoke('save');
      cy.wait(500);
      cy.visit('http://localhost:4200/');
      cy.wait(500);
      console.log('localstorage', localStorage);
      cy.url().should('equal', 'http://localhost:4200/setup/basics/creds');
      localStorage.clear();
    });

    it('should route to /basics/landing, when logged in, and basics set', function () {

      cy.visit('http://localhost:4200/');
      cy.window().its('AppService').its('store').invoke('update', {
        meta: {
          version: 'kdss'
        },
        loginData: {
          uid: 'sth',
          provider: ['normal'],
          normal: {
            email: 'sth@sjd.com',
            email_verified: false
          }
        },
        fullname: 'test',
        basics: {
          stufen: 'Q1',
          stufen_verified: false
        },
        menuOpen: false
      });
      cy.window().its('AppService').invoke('save');
      cy.wait(500);
      cy.visit('http://localhost:4200/');
      cy.wait(500);
      cy.url().should('equal', 'http://localhost:4200/basics/landing');
      localStorage.clear();
    });


  });


});
