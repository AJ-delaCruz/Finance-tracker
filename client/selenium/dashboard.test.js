const { Builder, By, Key, until } = require('selenium-webdriver');
const baseURL = 'http://localhost:4000';
const login = require('./login');

describe('Dashboard Test', () => {
    let driver;

    // Set up the WebDriver instance using Chrome
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await login(driver, 'test@gmail.com', 'test'); // login function before tests
        // Navigate to the dashboard page
        await driver.get(`${baseURL}/`);
    });

    // Close the WebDriver when done
    afterAll(async () => {
        await driver.quit();
    });


    test('Displays account summary', async () => {
        // // Navigate to the dashboard page
        // await driver.get(`${baseURL}/`);

        // Find account grid tiles and get the count
        const accountTiles = await driver.findElements(By.css('.account-tile'));
        const accountCount = accountTiles.length;

        // Assert that there is at least one account tile
        expect(accountCount).toBeGreaterThan(0);
    });

    test('Displays recent transactions', async () => {
        // Navigate to the dashboard page
        // await driver.get(`${baseURL}/`);

        // Find transaction grid tiles and get the count
        const transactionTiles = await driver.findElements(By.css('.transactions'));
        const transactionCount = transactionTiles.length;

        // Assert that there is at least one transaction tile
        expect(transactionCount).toBeGreaterThan(0);
    });

    test('Displays budget overview', async () => {
        // Navigate to the dashboard page
        // await driver.get(`${baseURL}/`);

        // Find budget items and get the count
        const budgetItems = await driver.findElements(By.css('.budget-item'));
        const budgetCount = budgetItems.length;

        // Assert that there is at least one budget item
        expect(budgetCount).toBeGreaterThan(0);
    });

    test('Displays goals', async () => {
        // Navigate to the dashboard page
        // await driver.get(`${baseURL}/`);

        // Find goal items and get the count
        const goalItems = await driver.findElements(By.css('.goal-item'));
        const goalCount = goalItems.length;

        // Assert that there is at least one goal item
        expect(goalCount).toBeGreaterThan(0);
    });
});
