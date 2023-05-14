// loginHelper.js
const { By, Key, until } = require('selenium-webdriver');

const baseURL = 'http://localhost:4000';

async function login(driver, username, password) {
  await driver.get(`${baseURL}/login`);

  await driver.findElement(By.name('username')).sendKeys(username);
  await driver.findElement(By.name('password')).sendKeys(password, Key.RETURN);

  await driver.wait(until.urlIs(`${baseURL}/`), 10000);
}

module.exports = login;
