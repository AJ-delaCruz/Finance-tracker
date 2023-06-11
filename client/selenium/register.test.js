const { Builder, By, Key, until } = require('selenium-webdriver');

const baseURL = process.env.node === 'test' ? '' : 'http://localhost:4000';

describe('Register Test', () => {
    let driver;

    // Set up the WebDriver instance using chrome

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    //close the WebDriver when done
    afterAll(async () => {
        await driver.quit();
    });

    test.skip('Register with valid credentials', async () => {
    // test('Register with valid credentials', async () => {
        // Navigate to a register page
        await driver.get(`${baseURL}/register`);

        // Find username and password input fields and enter values, then press key
        await driver.findElement(By.name('username')).sendKeys('test67');
        await driver.findElement(By.name('password')).sendKeys('testpassword', Key.RETURN);

       
        //wait until url matches the login page "/login" for 10 secs
        await driver.wait(until.urlIs(`${baseURL}/login`), 10000);

        //test case LOGIN matches the button name
        const loginButton = await driver.findElement(By.tagName('button'));
        expect(await loginButton.getText()).toBe('LOGIN');
    });
});
