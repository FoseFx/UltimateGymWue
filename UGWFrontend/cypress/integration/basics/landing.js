/// <reference types="cypress" />

beforeEach(function () {

  cy.fixture('basics').then((data) => {
    cy.visit('http://localhost:4200/basics/landing');
    cy.wait(300);
    cy.window().its('AppService').its('store').invoke('update', data);
    cy.window().its('AppService').invoke('save');
    cy.wait(300);
  });

});

describe('display data correctly', function () {

  it('should display tables correctly', function () {
    cy.clock(+new Date(2019, 5, 17));
    cy.visit('http://localhost:4200/basics/landing');

    cy.url().should('equal', 'http://localhost:4200/basics/landing');
    cy.get('table').eq(0).as('today');
    cy.get('table').eq(1).as('next_day');

    // todo

  });
});
