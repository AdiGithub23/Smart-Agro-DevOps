const { Builder, By, Key, until } = require('selenium-webdriver');

let expect; // Declare `expect` here, to be imported dynamically

describe('SuperAdmin Page Tests', function() {
  let driver;
  this.timeout(20000); // Set a higher timeout for these tests

  before(async function() {
    // Dynamically import `chai` and assign `expect`
    const chai = await import('chai');
    expect = chai.expect;

    // Set up WebDriver before the tests
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    // Quit WebDriver after the tests
    if (driver) {
      await driver.quit();
    }
  });

  it('should login as SuperAdmin and navigate to SuperAdmin page', async function() {
    // Navigate to login page
    await driver.get('http://localhost:3000/login');

    // Enter super-admin credentials
    await driver.findElement(By.id('email')).sendKeys('superadmin@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('123456789aaa');

    // Click the login button
    const loginButton = await driver.findElement(By.css('button.submit'));
    await loginButton.click();

    // Wait for navigation to the SuperAdmin page (adjust the URL if needed)
    await driver.wait(until.urlIs('http://localhost:3000/superadmin'), 10000);

    // Verify the page title or any other unique element on the SuperAdmin page
    const title = await driver.getTitle();
    expect(title).to.equal('Fazenda'); // Adjust based on your actual title

    // Alternatively, you can check for a unique element on the SuperAdmin page
    // const headerText = await driver.findElement(By.css('h1')).getText();
    // expect(headerText).to.equal('Super Admin Dashboard'); // Adjust text as needed
  });

  it('should show validation error for empty email', async function() {
    // Navigate to login page
    await driver.get('http://localhost:3000/login');

    // Leave email empty and attempt login
    await driver.findElement(By.id('email')).sendKeys('', Key.RETURN);

    // Check for validation error message
    const errorMessage = await driver.findElement(By.css('.MuiFormHelperText-root')).getText();
    expect(errorMessage).to.equal('Email is required'); // Adjust based on your error message
  });
});
