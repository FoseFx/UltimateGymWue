/// <reference types="cypress" />

describe('basics', () => {

  describe('routing', () => {

    it('should allow when logged in and basics set', () => {

      cy.visit('http://localhost:4200/basics/landing');
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
          fullname: 'test',
          basics: {
            stufe: 'Q1',
            stufe_id: 'jsadjsadn'
          },
          menuOpen: false
        }
      );
      cy.window().its('AppService').invoke('save');
      cy.wait(300);
      cy.visit('http://localhost:4200/basics/landing');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/basics/landing');

    });

    it('should not allow when logged in and no basics set', () => {

      cy.visit('http://localhost:4200/basics/landing');
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
          fullname: 'test',
          basics: null,
          menuOpen: false
        }
      );
      cy.window().its('AppService').invoke('save');
      cy.wait(300);
      cy.visit('http://localhost:4200/basics/landing');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/setup/basics/creds');
    });

    it('should not allow when not logged in and basics set', () => {
      cy.visit('http://localhost:4200/basics/landing');
      cy.window().its('AppService').its('store').invoke('update',
        {
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
        }
      );
      cy.window().its('AppService').invoke('save');
      cy.wait(300);
      cy.visit('http://localhost:4200/basics/landing');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/setup/welcome');
    });

    it('should not allow when not logged in and not basics set', () => {
      cy.visit('http://localhost:4200/basics/landing');

      cy.window().its('AppService').its('store').invoke('update', {
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
        }
      );
      cy.window().its('AppService').invoke('save');
      cy.wait(300);
      cy.visit('http://localhost:4200/basics/landing');
      cy.wait(300);
      cy.url().should('equal', 'http://localhost:4200/setup/welcome');
    });


  });


});
