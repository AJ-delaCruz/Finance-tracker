const { Builder, By, Key, until } = require('selenium-webdriver');
const baseURL = process.env.node === 'test' ? '' : 'http://localhost:4000';
const login = require('./login');

describe('Dashboard Test', () => {
    let driver;

    // Set up the WebDriver instance using Chrome
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await login(driver, 'test@gmail.com', 'test'); // login function before tests
        // Navigate to the dashboard page
        await driver.get(`${baseURL}/`);

        // wait until h3 tag is visible for 10 secs due to loading variable in dashboard component
        await driver.wait(until.elementLocated(By.tagName('h3')), 10000);
    });

    // Close the WebDriver when done
    afterAll(async () => {
        await driver.quit();
    });


    test('Displays account summary', async () => {
        // // Find account grid tiles and get the count
        // const accountTiles = await driver.findElements(By.css('.account-tile'));
        // const accountCount = accountTiles.length;

        // // Assert that there is at least one account tile
        // expect(accountCount).toBeGreaterThan(0);

        // Assert that the account summary section is present on dashboard
        const accountSummaryElement = await driver.findElement(By.css('.account-summary'));
        expect(accountSummaryElement).toBeDefined();
    });

    test('Displays recent transactions', async () => {
        // // Find transaction grid tiles and get the count
        // const transactionTiles = await driver.findElements(By.css('.transactions'));
        // const transactionCount = transactionTiles.length;

        // // Assert that there is at least one transaction tile
        // expect(transactionCount).toBeGreaterThan(0);

        // Assert that the recent transactions section is present on dashboard
        const transactionElement = await driver.findElement(By.css('.transactions'));
        expect(transactionElement).toBeDefined();
    });

    test('Displays budget overview', async () => {
        // // Find budget items and get the count
        // const budgetItems = await driver.findElements(By.css('.budget-item'));
        // const budgetCount = budgetItems.length;

        // // Assert that there is at least one budget item
        // expect(budgetCount).toBeGreaterThan(0);

        // Assert that the budget overview section is present on dashboard
        const budgetElement = await driver.findElement(By.css('.budget'));
        expect(budgetElement).toBeDefined();
    });

    test('Displays goals', async () => {
        // // Find goal items and get the count
        // const goalItems = await driver.findElements(By.css('.goal-item'));
        // const goalCount = goalItems.length;

        // // Assert that there is at least one goal item
        // expect(goalCount).toBeGreaterThan(0);
        // Assert that the goals section is present on dashboard
        const goalElement = await driver.findElement(By.css('.goals'));
        expect(goalElement).toBeDefined();
    });
});
