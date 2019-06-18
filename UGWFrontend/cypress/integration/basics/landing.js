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

    cy.get('@today').within(() => {
      cy.get('tr').eq(0).within(() => {
        cy.get('td').eq(0).contains('1');
        cy.get('td').eq(1).contains('N7');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEI');
      });
      cy.get('tr').eq(1).within(() => {
        cy.get('td').eq(0).contains('2');
        cy.get('td').eq(1).contains('N7');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEI');
      });
      cy.get('tr').eq(2).within(() => {
        cy.get('td').eq(0).contains('3');
        cy.get('td').eq(1).contains('N9');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEK');
      });
      cy.get('tr').eq(3).within(() => {
        cy.get('td').eq(0).contains('4');
        cy.get('td').eq(1).contains('N9');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEK');
      });
      cy.get('tr').eq(4).within(() => {
        cy.get('td').eq(0).contains('5');
        cy.get('td').eq(1).contains('N8');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEJ');
      });
      cy.get('tr').eq(5).within(() => {
        cy.get('td').eq(0).contains('6');
        cy.get('td').eq(1).contains('N8');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEJ');
      });
      cy.get('tr').eq(6).within(() => {
        cy.get('td').eq(0).contains('8');
        cy.get('td').eq(1).contains('NI4');
        cy.get('td').eq(2).contains('KRH2');
        cy.get('td').eq(3).contains('LEN');
      });
      cy.get('tr').eq(7).within(() => {
        cy.get('td').eq(0).contains('9');
        cy.get('td').eq(1).contains('NI4');
        cy.get('td').eq(2).contains('KRH2');
        cy.get('td').eq(3).contains('LEN');
      });
      cy.get('tr').eq(8).within(() => {
        cy.get('td').eq(0).contains('10');
        cy.get('td').eq(1).contains('tauch');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('Azv');
      });
      cy.get('tr').eq(9).within(() => {
        cy.get('td').eq(0).contains('11');
        cy.get('td').eq(1).contains('tauch');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('Azv');
      });
    });


    cy.get('@next_day').within(() => {
      cy.get('tr').eq(0).within(() => {
        cy.get('td').eq(0).contains('1');
        cy.get('td').eq(1).contains('FA5');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEE');
      });
      cy.get('tr').eq(1).within(() => {
        cy.get('td').eq(0).contains('2');
        cy.get('td').eq(1).contains('FA5');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEE');
      });
      cy.get('tr').eq(2).within(() => {
        cy.get('td').eq(0).contains('3');
        cy.get('td').eq(1).contains('N1');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LED');
      });
      cy.get('tr').eq(3).within(() => {
        cy.get('td').eq(0).contains('4');
        cy.get('td').eq(1).contains('N1');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LED');
      });
      cy.get('tr').eq(4).within(() => {
        cy.get('td').eq(0).contains('5');
        cy.get('td').eq(1).contains('N2');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEF');
      });
      cy.get('tr').eq(5).within(() => {
        cy.get('td').eq(0).contains('6');
        cy.get('td').eq(1).contains('N2');
        cy.get('td').eq(2).contains('000');
        cy.get('td').eq(3).contains('LEF');
      });
    });
  });

  describe('should display dates correctly', function () {
    it('17.6.19', function () {
      cy.clock(+new Date(2019, 5, 17));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Mo. 17.06.19"); cy.contains("B Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Di. 18.06.19"); cy.contains("B Woche"); });
    });

    it('18.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 18));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Di. 18.06.19"); cy.contains("B Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Mi. 19.06.19"); cy.contains("B Woche"); });
    });
    it('19.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 19));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Mi. 19.06.19"); cy.contains("B Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Do. 20.06.19"); cy.contains("B Woche"); });
    });

    it('20.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 20));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Do. 20.06.19"); cy.contains("B Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Fr. 21.06.19"); cy.contains("B Woche"); });
    });

    it('21.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 21));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Fr. 21.06.19"); cy.contains("B Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Mo. 24.06.19"); cy.contains("A Woche"); });
    });

    it('22.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 22));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Mo. 24.06.19"); cy.contains("A Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Di. 25.06.19"); cy.contains("A Woche"); });
    });

    it('23.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 23));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Mo. 24.06.19"); cy.contains("A Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Di. 25.06.19"); cy.contains("A Woche"); });
    });

    it('24.6.19 ', function () {
      cy.clock(+new Date(2019, 5, 24));
      cy.visit('http://localhost:4200/basics/landing');
      cy.get(".day-header").eq(0).within(() => {cy.contains("Mo. 24.06.19"); cy.contains("A Woche"); });
      cy.get(".day-header").eq(1).within(() => {cy.contains("Di. 25.06.19"); cy.contains("A Woche"); });
    });

  });


  it('should hide hiddenNonKurse ', function () {
    cy.clock(+new Date(2019, 5, 17));
    cy.visit('http://localhost:4200/basics/landing');
    cy.get('table').eq(0).within(() => cy.get('tr').then(d => expect(d.length).to.equal(10)));
    cy.contains('tauch').eq(0).click();
    cy.contains('tauch nicht mehr anzeigen').click();
    cy.wait(1000);
    cy.get('table').eq(0).within(() => cy.get('tr').then(d => expect(d.length).to.equal(8)));
  });


});
