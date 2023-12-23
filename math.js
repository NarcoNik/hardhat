let totalAmountLP = 0;
let totalAmountWeight = 0;
let percents = [];
let farmedByDay = 100;
let totalFarmed = 0;
let startTime = 0;
let reinvestTime = 0;
let started = false;
let UserInfo = [
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  },
  {
    user: 0,
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Updates the user information based on the type of transaction (deposit or withdraw).
 * @param {string} type - The type of transaction ('deposit' or 'withdraw').
 * @param {number} id - The user ID.
 * @param {number} curAmountLP - The current amount of LP (Liquidity Provider) tokens.
 * @param {number} amountLP - The amount of LP tokens involved in the transaction.
 * @returns {boolean} - Returns true if the update is successful.
 */
const updateInfo = (type, id, curAmountLP, amountLP) => {
  const time = Number((new Date().getTime() / 1000).toFixed());

  if (!started) {
    startTime = time;
    started = true;
  }
  const dTime = time - UserInfo[id].lastUpdateTime;

  const lastWeight = UserInfo[id].weight;
  const curWeight = curAmountLP * dTime;
  const weight = lastWeight + curWeight; // Calculate the average weight
  if (type == 'deposit') {
    curAmountLP += amountLP;
    totalAmountLP += amountLP;
  }
  if (type == 'withdraw') {
    curAmountLP -= amountLP;
    totalAmountLP -= amountLP;
  }

  UserInfo[id].user = id;
  UserInfo[id].amountLP = curAmountLP;
  UserInfo[id].lastUpdateTime = time;
  UserInfo[id].weight = weight;

  if (totalAmountWeight != 0) totalAmountWeight -= lastWeight;
  totalAmountWeight += weight;

  console.log('after:', UserInfo[id]);
  console.log('global:', { totalAmountLP, totalAmountWeight });

  return true;
};

/**
 * Sends a transaction for a user.
 * @param {string} type - The type of transaction ('deposit' or 'withdraw').
 * @param {number} id - The user ID.
 * @param {number} amountLP - The amount of LP tokens involved in the transaction.
 */
const sendTransaction = (type, id, amountLP) => {
  console.log(type + ' user:', id);
  console.log('before:', UserInfo[id]);
  let curAmountLP = UserInfo[id].amountLP;

  if (type == 'deposit') {
    if (curAmountLP <= 0) {
      UserInfo[id] = {
        user: id,
        amountLP,
        lastUpdateTime: Number((new Date().getTime() / 1000).toFixed()),
        weight: 0
      };
    }
  }

  if (type == 'withdraw') {
    if (!UserInfo[id] || curAmountLP <= 0) return console.error('You dont using this pool');
    if (curAmountLP < amountLP) return console.error('Insufficient LP amount');
  }
  if (updateInfo(type, id, curAmountLP, amountLP)) {
    //tranfer
    console.log('Done\n');
    //emit
  } else return console.error('hz tut potom uzhe dumat');
};

// const getMidWeight = num => {
//   console.log(num);
//   num = num.filter(elem => elem != 0);
//   let sum;
//   if (num.length != 0) {
//     sum = num.reduce((a, b) => a + b, 0);
//   } else sum = 0;
//   const midWeight = sum / num.length;

//   console.log({ sum, midWeight, totalAmountWeight });
//   return { midWeight };
// };

/**
 * Calculates the percentages of each user's weight based on the total weight.
 */
const getPercents = () => {
  for (let i = 0; i < UserInfo.length; i++) {
    if (UserInfo[i].amountLP > 0) {
      sendTransaction('reinvest', i, 0);
    }
  }
  for (let a = 0; a < UserInfo.length; a++) {
    percents[a] = UserInfo[a].weight / totalAmountWeight;
  }
  console.log('getPercents:\n', percents);
};
/**
 * Calculates the total farmed amount based on the time elapsed since the start time.
 * @returns {number} - The total farmed amount.
 */
const _getTotalFarmed = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTime = time - startTime;
  totalFarmed = farmedByDay * dTime;
  console.log('_getTotalFarmed:\n', totalFarmed);
  return totalFarmed;
};
/**
 * Reinvests the available LP tokens based on the percentages and total farmed amount.
 * @returns {boolean} - Returns true if the reinvestment is successful.
 */
const reInvest = () => {
  reinvestTime = Number((new Date().getTime() / 1000).toFixed());
  getPercents();
  const totalFarmed = _getTotalFarmed();

  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = percents[i] * totalFarmed;
    availibleLP[i] = amtLP;
  }
  console.log('reinvest:\n', availibleLP);
  return true;
};

// sendTransaction('deposit', 1, 100);
// sleep(1000).then(async () => {
//   sendTransaction('deposit', 2, 200);
//   return sleep(2000).then(() => {
//     sendTransaction('withdraw', 1, 50);
//     return sleep(3000).then(() => {
//       sendTransaction('deposit', 1, 250);
//       return sleep(5000).then(() => {
//         reInvest();
//       });
//     });
//   });
// });

sendTransaction('deposit', 1, 10);
sendTransaction('deposit', 2, 10);
sleep(1000).then(async () => {
  sendTransaction('withdraw', 1, 4);
  return sleep(3000).then(() => {
    reInvest();
  });
});
