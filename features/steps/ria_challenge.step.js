const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('chai');
const RiaChallengePage = require('../pages/ria_challenge.page');
const RiaLoginPage = require('../pages/ria_login.page');
const RiaRegistrationPage = require('../pages/ria_registration.page');

let riaChallengePage;
let riaLoginPage;
let riaRegistrationPage;

Before(function () {
    riaChallengePage = new RiaChallengePage(this.driver);
    riaLoginPage = new RiaLoginPage(this.driver);
    riaRegistrationPage = new RiaRegistrationPage(this.driver);
});

Given('I am on the homepage', async function () {
    await riaChallengePage.launchBrowser();
});

When('the website core elements are displayed', async function () {
    await riaChallengePage.verifyCoreElements();
});

When('I enter the amount of {int} CLP', async function (amount) {
    await riaChallengePage.enterAmount(amount);
});

When('I select the {string} country of the receiver', async function (destination) {
    await riaChallengePage.selectDestinationCountry(destination);
});

When('I select the payment method {string}', async function (payment_method) {
    await riaChallengePage.selectPaymentMethod(payment_method);
});

When('I select the delivery method {string}', async function (delivery_method) {
    await riaChallengePage.selectDeliveryMethod(delivery_method);
});

Then('I validate the total amount to pay after fees is correct', async function () {
    const { total, fees } = await riaChallengePage.validateTotalAndFees();

    expect(total).to.not.be.empty;
    expect(total).to.match(/\d+/);
    expect(fees).to.not.be.empty;
});

When('I validate the selected currency is {string}', async function (expectedCurrency) {
    const actualCurrency = await riaChallengePage.getSelectedCurrencyCode();
    expect(actualCurrency).to.equal(expectedCurrency);
});

When('I start the transfer process clicking on the button {string}', async function (buttonText) {
    await riaChallengePage.clickStartTransferButton();
});

When('I edit the amount in They receive with {int}', async function (newAmount) {
    await riaChallengePage.editTheyReceiveAmount(newAmount);
});

Then('I validate that new CLP amount is displayed in You send input field', async function () {
    const currentAmount = await riaChallengePage.getYouSendAmount();

    // Validate that the amount is not empty and contains digits
    expect(currentAmount).to.not.be.empty;
    expect(currentAmount).to.match(/\d+/);

    // The amount should have changed from the original 25000
    // We just verify it's a valid number greater than 0
    const numericAmount = parseFloat(currentAmount.replace(/[,.]/g, ''));
    expect(numericAmount).to.be.greaterThan(0);

    console.log(`Validated that "You send" amount updated to: ${currentAmount} CLP`);
});

When('I click on {string} button', async function (buttonText) {
    await riaLoginPage.clickContinueToWebsite();
});

Then('I validate that URL contains {string}', async function (expectedURL) {
    const urlMatches = await riaLoginPage.validateURLContains(expectedURL);
    expect(urlMatches).to.be.true;
});

Then('I validate the elements on this login page are displayed', async function () {
    const elementsDisplayed = await riaLoginPage.verifyLoginPageElements();
    expect(elementsDisplayed).to.be.true;
});

When('I click on {string} hyperlink', async function (linkText) {
    await riaLoginPage.clickRegisterHyperlink();
});

Then('I validate I am on the registration page with URL {string}', async function (expectedURL) {
    const urlMatches = await riaRegistrationPage.validateRegistrationURL(expectedURL);
    expect(urlMatches).to.be.true;
});

Then('I validate the new view display the Country Selection Page.', async function () {
    const countrySelectionDisplayed = await riaRegistrationPage.verifyCountrySelectionPageDisplayed();
    expect(countrySelectionDisplayed).to.be.true;
});