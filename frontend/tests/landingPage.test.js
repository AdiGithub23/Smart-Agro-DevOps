const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
describe('Landing Page Tests', function () {
  let driver;
  // Set the timeout for the tests
  this.timeout(10000);
  // Setup the WebDriver before running the tests
  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000'); // Adjust the URL if necessary
  });
  // Close the WebDriver after running the tests
  after(async function () {
    await driver.quit();
  });
  // Test if the page title is correct
  it('should have the correct page title', async function () {
    await driver.wait(until.titleIs('Fazenda'), 10000);
    const pageTitle = await driver.getTitle();
    console.log("Page title found:", pageTitle);
    assert.strictEqual(pageTitle, 'Fazenda');
  });
  // Test if the main title is present
  it('should display the main title "Transform Your Farming"', async function () {
    const titleElement = await driver.findElement(By.xpath("//h2[contains(text(), 'Transform Your Farming')]"));
    const titleText = await titleElement.getText();
    console.log("Main title found:", titleText);
    assert.strictEqual(titleText, 'Transform Your Farming with SLTMobitel Fazenda Smart Agro Solutions');
  });
  // Test if the IoT Networks section is present
  it('should display the "IoT Networks" section', async function () {
    const iotNetworksElement = await driver.findElement(By.xpath("//h6[contains(text(), 'IOT Networks')]"));
    const iotNetworksText = await iotNetworksElement.getText();
    console.log("IoT Networks section found:", iotNetworksText);
    assert.strictEqual(iotNetworksText, 'IOT Networks');
  });
  // Test if the Explore More button is present
  it('should display the "Explore More" button', async function () {
    const exploreMoreButton = await driver.findElement(By.xpath("//button[contains(., 'Explore More')]"));
    const buttonText = await exploreMoreButton.getText();
    console.log("Explore More button found:", buttonText);
    assert.strictEqual(buttonText, 'EXPLORE MORE');
  });
});