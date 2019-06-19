/// <reference types="cypress" />

it('unhide', () => {

  cy.fixture('basics').then((data) => {
    // set up
    cy.visit('http://localhost:4200/basics/landing');
    cy.wait(300);
    cy.window().its('AppService').its('store').invoke('update', data);
    cy.window().its('AppService').invoke('save');
    cy.wait(300);

    // hide
    cy.clock(+new Date(2019, 5, 17));
    cy.visit('http://localhost:4200/basics/landing');
    cy.get('table').eq(0).within(_ => cy.get('tr').eq(8).click());
    cy.contains('nicht mehr anzeigen').click();
    cy.wait(300);

    // unhide
    cy.visit('http://localhost:4200/basics/hide');
    cy.get('input').click();
    cy.get('app-button').click();

    // test
    cy.get('table').eq(0).within(_ => cy.get('tr').eq(8).should('exist'));
  });
});
