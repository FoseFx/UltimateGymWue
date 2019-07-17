/// <reference types="cypress" />

beforeEach(function () {

    cy.fixture('basics').then((data) => {
      cy.visit('http://localhost:4200/basics/landing');
      cy.wait(300);
      cy.window().its('AppService').its('store').invoke('update', data);
      cy.window().its('AppService').invoke('_save');
      cy.wait(300);
    
    });
  
});

describe('display vd correctly', function () {
    it('should display fetchedAt correctly, should display noDAta yet and should display no vd', () => {
      cy.clock(+new Date(2019, 6, 17));
      cy.server();
      cy.route({
        method: 'OPTIONS',
        url: 'http://localhost:8000/api/basics/vp/S',
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        ignoreCase: true,
        response: 'ok'
      });
      cy.route({
        method: 'GET',
        url: 'http://localhost:8000/api/basics/vp/S',
        status: 200,
        ignoreCase: true,
        response: {
            "data": [
                {
                    "infos": ["17.7.2019"],
                    "vp": null
                },
                {
                    "infos": ["19.7.2019"], 
                    "vp": null
                },
                {
                    "infos":"1563376323",
                    "vp":null
                }
            ],"error":false
        }
      });
      cy.visit('http://localhost:4200/basics/landing');
      cy.contains('17:12');
      cy.get('app-home-table').eq(0).contains('Keine Vertretung');
      cy.get('app-home-table').eq(1).contains('Noch kein Vertretungsplan verfügbar');
    });
});