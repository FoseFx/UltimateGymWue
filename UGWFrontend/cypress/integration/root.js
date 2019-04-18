/// <reference types="cypress" />

describe('root', () => {

  describe('routing', () => {

    it('should route to /setup/welcome, when nothing set', function () {
      localStorage.clear();
      cy.visit('/');
      cy.url().should('equal', 'http://localhost:4200/setup/welcome');
      localStorage.clear();
    });
/* todo

    it('should route to /setup/basics/stufen, when logged in, but no basics set', function () {

      localStorage.clear();
      localStorage['app_state'] = JSON.stringify({
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
      cy.visit('/');
      cy.wait(500);
      console.log('localstorage', localStorage);
      cy.url().should('equal', 'http://localhost:4200/setup/basics/stufen');
      localStorage.clear();
    });

    it('should route to /basics/landing, when logged in, and basics set', function () {

      localStorage.clear();
      localStorage['app_state'] = JSON.stringify({
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
      cy.visit('/');
      cy.wait(500);
      console.log('localstorage', JSON.parse(localStorage.app_state));
      cy.url().should('equal', 'http://localhost:4200/basics/landing');
      localStorage.clear();
    });

*/
  });


});
