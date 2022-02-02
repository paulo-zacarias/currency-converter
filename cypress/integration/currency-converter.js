describe("Currency Converter e2e tests", () => {
  before(() => {
    cy.visit("/");
    // cy.visit(Cypress.env("baseUrl"));
  });

  it("Page loads", () => {
    cy.get(".cy-card-title").should("contain", "Currency Converter");
  });

  it("Convert amount", () => {
    cy.get(".cy-amount-input").type(1);
    cy.get(".cy-convert-from-dropdown").type("USD{enter}");
    cy.get(".cy-convert-to-dropdown").type("EUR{enter}");
    cy.get(".cy-result-from").should("contain", "USD");
    cy.get(".cy-result-to").should("contain", "EUR");
  });

  it("Swap selection", () => {
    cy.get(".cy-swap-button").click();
    cy.get(".cy-result-from").should("contain", "EUR");
    cy.get(".cy-result-to").should("contain", "USD");
  });

  it("No input number", () => {
    cy.get(".cy-amount-input").clear();
    cy.get("body").click();
    cy.get(".cy-amount-input-error").should("contain", "Required field");
  });

  it("Invalid currency", () => {
    cy.get(".cy-convert-from-dropdown").type("xpto");
    cy.get("body").click();
    cy.get(".cy-currency-from-error").should("contain", "Invalid Currency");
  });
});
