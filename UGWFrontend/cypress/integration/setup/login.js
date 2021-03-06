/// <reference types="cypress" />

describe('login', () => {


  describe('routing', () => {


    it('should not allow, when logged in', () => {


      cy.visit('http://localhost:4200/setup/login');
      cy.window().its('AppService').its('store').invoke('update', {
          meta: {
            version: ''
          },
          loginData: {
            uid: 'sth',
            provider: ['normal'],
            normal: {
              email: 'sth@sjd.com',
              email_verified: false
            }
          },
          basics: {
            stufe: 'Q1',
            stufe_id: 'jsadjsadn'
          },
          fullname: 'some name',
          menuOpen: false
        }
      );
      cy.window().its('AppService').invoke('_save');
      cy.wait(300);
      cy.visit('http://localhost:4200/setup/login');
      cy.wait(300);
      cy.url().should('not.equal', 'http://localhost:4200/setup/login');
    });

    it('should allow, when not logged in and basics set', () => {

      localStorage.clear();
      localStorage['app_state'] = JSON.stringify({
        meta: {
          version: ''
        },
        loginData: null,
        fullname: null,
        basics: {
          stufe: 'Q1',
            stufe_id: 'jsadjsadn'
        },
        menuOpen: false
      });
      cy.visit('http://localhost:4200/setup/login');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/setup/login');
      localStorage.clear();

    });

    it('should allow, when not logged in and no basics', () => {

      localStorage.clear();
      cy.visit('http://localhost:4200/setup/login');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/setup/login');
      localStorage.clear();

    });


  });


});
