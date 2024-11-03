const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
describe('Login Page Tests', function () {
  let driver;
  // Set the timeout for the tests
  this.timeout(10000);
  // Setup the WebDriver before running the tests
  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });
  // Close the WebDriver after running the tests
  after(async function () {
    await driver.quit();
  });
  // Test case for successful login
  it('should login successfully with valid credentials', async function () {
    console.log('Navigating to login page...');
    await driver.get('http://localhost:3000/login');
    console.log('Filling in the email field...');
    await driver.findElement(By.id('email')).sendKeys('sltadmin@gmail.com');
    console.log('Filling in the password field...');
    await driver.findElement(By.id('password')).sendKeys('123456789aaa');
    console.log('Clicking the login button...');
    const loginButton = await driver.wait(until.elementIsVisible(driver.findElement(By.css('button.submit'))), 5000);
    await loginButton.click();
    console.log('Waiting for navigation...');
    await driver.wait(until.urlIs('http://localhost:3000/adminsltdashboard'), 30000); // Adjusted for more time
  });
});