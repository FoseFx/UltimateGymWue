beforeEach(function () {

  cy.fixture('basics').then((data) => {
    cy.visit('http://localhost:4200/basics/landing');
    cy.wait(300);
    cy.window().its('AppService').its('store').invoke('update', data);
    cy.window().its('AppService').invoke('_save');
    cy.wait(300);
  });

});
it('should route to new event page when fab clicked', () => {
  cy.visit('http://localhost:4200/calendar/');
  cy.get('app-fab > div').click();
  cy.url().should('eq', 'http://localhost:4200/calendar/new');
});
