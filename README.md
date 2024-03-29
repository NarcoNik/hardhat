# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

## Локальный деплой:

1. `npm i`
2. `cp .env.example .env`.
3. `npm run ln` Запустить докер ноды
4. `npm run compile;`
5. `npm run deploy:local;` Деплой контракта

## Starting tests:

1.  Запуск теста в локальной форк ноде:  
    `npm run test tests/uni-v3.test.ts`
2.  npm run test + any file in ./tests - start only choose test
    exapmle: npm run test tests/uni-v3.test.ts
3.  npm run test - start all of the tests in folder ./tests

## Code Formating:

1.  `npm run format` - formatting code with prettier & check warn/err in code
2.  `npm run lint` - formatting .sol & check warn/err in contracts

The provided code snippet appears to be a JavaScript implementation of a financial calculation or investment system. However, without additional context or specific requirements, it is difficult to provide a detailed specification for the code.

Based on the code, here are some observations and possible specifications:

Variables and Data Structures:
totalAmountLP: Represents the total amount of LP (Liquidity Provider) tokens.
totalAmountWeight: Represents the total weight of LP tokens.
percents: An array that stores the calculated percentages for each user.
farmedByDay: Represents the amount farmed per day.
totalFarmed: Represents the total amount farmed.
startTime: Represents the start time of the investment.
reinvestTime: Represents the time of reinvestment.
started: A boolean flag indicating whether the investment has started.
UserInfo: An array of objects representing user information, including user ID, LP amount, last update time, and weight.
Functions:
sleep: A utility function that returns a promise that resolves after a specified time.
updateInfo: Updates the user information based on the type of transaction (deposit or withdraw) and the LP amount.
sendTransaction: Handles the deposit and withdraw transactions, updating user information and triggering the updateInfo function.
getPercents: Calculates the percentages for each user based on their weight and the total weight.
\_getTotalFarmed: Calculates the total farmed amount based on the start time and the farmed amount per day.
reInvest: Triggers the reinvestment process, calculating the available LP for each user based on their percentage and the total farmed amount.
Usage:
The code includes commented-out code blocks that demonstrate the usage of the functions and simulate transactions and reinvestment. You can uncomment and modify these blocks to test the functionality.
Overall, the code seems to be a work in progress, as some parts are commented out and there are console.log statements for debugging purposes. To provide a more specific specification, it would be helpful to have more information about the desired functionality and requirements of the investment system.
