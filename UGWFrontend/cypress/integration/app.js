/// <reference types="cypress" />

describe('menu', () => {

    it('should display menu on click', () => {
        cy.visit('http://localhost:4200/');
        cy.get('#menu').should('not.exist');
        cy.get('app-toolbar > i').click();
        cy.get('#menu').should('exist');
    });

    it('should show version', () => {
        cy.visit('http://localhost:4200/');
        cy.get('app-toolbar > i').click();
        cy.window().its('AppService').its('query').its('version').then(version => cy.contains('UGW v.' + version));
    });
});