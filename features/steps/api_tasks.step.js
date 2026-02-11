const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const apiHelper = require('../api/api_helper');

Given('I send a GET request to {string}', async function (url) {
    await apiHelper.getRequest(url);
    this.attach(apiHelper.getFullLog(), 'application/json');
});

Given('I send a POST request to {string} with the following body:', async function (url, body) {
    const jsonBody = JSON.parse(body);
    await apiHelper.postRequest(url, jsonBody);
    this.attach(apiHelper.getFullLog(), 'application/json');
});

Then('the response status code should be {int}', function (expectedStatus) {
    const response = apiHelper.getLastResponse();
    expect(response.status).to.equal(expectedStatus);
});

Then('the response status code should be 200 or 201', function () {
    const response = apiHelper.getLastResponse();
    expect([200, 201]).to.include(response.status);
});

Then('all objects in the response should have non-empty {string} and {string} fields', function (field1, field2) {
    const responseData = apiHelper.getLastResponse().data;
    responseData.forEach((item) => {
        expect(item[field1]).to.not.be.empty;
        expect(item[field2]).to.not.be.empty;
    });
});

Then('the response content should not contain the word {string}', function (forbiddenWord) {
    const bodyString = JSON.stringify(apiHelper.getLastResponse().data).toLowerCase();
    expect(bodyString).to.not.include(forbiddenWord.toLowerCase());
});

Then('the response {string} should include {string}, {string}, and {string}', function (path, val1, val2, val3) {
    const responseData = apiHelper.getLastResponse().data;
    // httpbin returns the sent JSON inside the "json" key
    const actualData = responseData.json[path];
    expect(actualData).to.include(val1);
    expect(actualData).to.include(val2);
    expect(actualData).to.include(val3);
});

Then('the response {string} should not contain {string}', function (path, forbiddenVal) {
    const responseData = apiHelper.getLastResponse().data;
    const actualData = responseData.json[path];
    expect(actualData).to.not.include(forbiddenVal);
});
