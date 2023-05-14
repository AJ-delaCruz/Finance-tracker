const { Builder, By, Key, until } = require('selenium-webdriver');

const baseURL = 'http://localhost:4000'; 

describe('Login Test', () => {
    let driver;

    // Set up the WebDriver instance using chrome
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    //close the WebDriver when done
    afterAll(async () => {
        await driver.quit();
    });

    test('Login with valid credentials', async () => {

         // Navigate to a login page
        await driver.get(`${baseURL}/login`);

        // Find username and password input fields and enter values, then press key
        await driver.findElement(By.name('username')).sendKeys('test@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('test', Key.RETURN);

        //wait until url matches the home page "/" for 10 secs
        await driver.wait(until.urlIs(`${baseURL}/`), 10000);

        //find <h> tag and gets the value
        const dashboardTitle = await driver.findElement(By.tagName('h3')).getText();
        //test case dashboard title is correct using Jest expect
        expect(dashboardTitle).toBe('Account Overview');
    });

});
