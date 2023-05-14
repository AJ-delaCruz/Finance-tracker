const { Builder, By, Key, until } = require('selenium-webdriver');
const login = require('./login');
const baseURL = 'http://localhost:4000';

describe('Bill Test', () => {
    let driver;

    beforeAll(async () => {
        // Set up the WebDriver instance using Chrome
        driver = await new Builder().forBrowser('chrome').build();
        await login(driver, 'test@gmail.com', 'test'); // login function before tests
        await driver.get(`${baseURL}/bill`); // Navigate to the Bills page
    });

    // Close the WebDriver when done
    afterAll(async () => {
        await driver.quit();
    });

    test('Verify the Bills page is loaded', async () => {
        // Test to verify that the Bills page is loaded correctly
        const pageTitle = await driver.findElement(By.css('.bills .top h2')).getText(); // Find the page title element
        expect(pageTitle).toEqual('Bills'); // Assert that the page title is 'Bills'
    });

    test('Verify Add Bill button exists', async () => {
        // Test to verify that the Add Bill button exists on the page
        const addBillButton = await driver.findElement(By.css('.bills .top button')); // Find the Add Bill button
        const buttonText = await addBillButton.getText(); // Get the text of the button
        expect(buttonText).toEqual('ADD BILL'); // Assert that the button text is 'Add Bill'
    });

    test('Verify Add Bill Modal opens and closes', async () => {
        // Test to verify that the Add Bill modal opens and closes correctly
        const addBillButton = await driver.findElement(By.css('.bills .top button')); // Find the Add Bill button
        await addBillButton.click(); // Click the Add Bill button

        const modalTitle = await driver.findElement(By.css('.MuiDialogTitle-root')).getText(); // Find the modal title element
        expect(modalTitle).toEqual('Add Bill'); // Assert that the modal title is 'Add Bill'

        const cancelButton = await driver.findElement(By.xpath("//button[contains(text(), 'Cancel')]")); // Find the Cancel button
        await cancelButton.click(); // Click the Cancel button

        await driver.wait(until.stalenessOf(await driver.findElement(By.css('.MuiDialog-root'))), 1000); // Wait for the modal to close
        const isModalStillVisible = await driver.findElements(By.css('.MuiDialog-root')).then(found => !!found.length); // Check if the modal is still visible
        expect(isModalStillVisible).toBe(false); // Assert that the modal is no longer visible
    });

    test('Add a new bill using Add Bill Modal', async () => {
        // Test to add a new bill using the Add Bill modal
        const addBillButton = await driver.findElement(By.css('.bills .top button')); // Find the Add Bill button
        await addBillButton.click(); // Click the Add Bill button

        await driver.findElement(By.name('name')).sendKeys('Test Bill'); // Find the name input and enter 'Test Bill'
        await driver.findElement(By.name('amount')).sendKeys('100'); // Find the amount input and enter '100'
        await driver.findElement(By.name('dueDate')).sendKeys('6/15/2023'); // Find the due date input and enter '6-15-2023'


        // const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Add')]"));
        const submitButton = await driver.findElement(By.css('[data-testid="add-bill-button"]'));
        await driver.wait(until.elementIsVisible(submitButton), 10000);

        await submitButton.click();

        await driver.wait(until.stalenessOf(await driver.findElement(By.css('.MuiDialog-root'))), 1000); // Wait for the modal to close

        const billRows = await driver.findElements(By.css('.bills .bottom .table-row')); // Find all the bill rows
        const newBillExists = billRows.some(async (row) => {
            // Check if the new bill exists in the bill rows
            const nameCell = await row.findElement(By.css('.center-align:first-child')); // Find the name cell
            const amountCell = await row.findElement(By.css('.center-align:nth-child(2)')); // Find the amount cell
            const dueDateCell = await row.findElement(By.css('.center-align:nth-child(3)')); // Find the due date cell

            const name = await nameCell.getText(); // Get the text of the name cell
            const amount = await amountCell.getText(); // Get the text of the amount cell
            const dueDate = await dueDateCell.getText(); // Get the text of the due date cell

            return name === 'Test Bill' && amount === '$100' && dueDate === '6/15/2023'; // Check if the values match the new bill
        });

        expect(newBillExists).toBe(true); // Assert that the new bill exists in the bill rows

    });
});
