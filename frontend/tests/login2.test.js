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
  // Test case for login failure with invalid credentials
it('should show an error message for invalid credentials', async function () {
    await driver.get('http://localhost:3000/login');
    console.log("Navigated to login page");
  
    // Fill in the email field
    console.log("Filling in the email field...");
    await driver.findElement(By.id('email')).sendKeys('invaliduser@example.com'); // Invalid email
  
    // Fill in the password field
    console.log("Filling in the password field...");
    await driver.findElement(By.id('password')).sendKeys('invalidpassword'); // Invalid password
  
    // Click the login button
    console.log("Clicking the login button...");
    await driver.findElement(By.css('button.submit')).click();
  
    // Wait for the alert to appear
    console.log("Waiting for the alert/error message...");
    try {
      // Wait for the alert to be present and then switch to it
      await driver.wait(until.alertIsPresent(), 10000); // Wait for the alert to appear
      const alert = await driver.switchTo().alert(); // Switch to the alert
  
      // Get the alert text
      const alertMessage = await alert.getText();
      console.log(`Error message received: ${alertMessage}`);
  
      // Accept the alert to close it
      await alert.accept();
  
      // Verify that the correct error message is displayed
      assert.strictEqual(alertMessage, 'Login failed: Invalid credentials or user unavailble'); // Replace with your actual error message
    } catch (error) {
      console.error("Error while waiting for the alert message:", error);
      throw error; // Rethrow to fail the test
    }
  });  
});