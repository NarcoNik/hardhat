let totalAmountLP = 0;
let totalAmountWeight = 0;
let usersBalance = [{ bal: 100 }, { bal: 200 }, { bal: 100 }, { bal: 300 }, { bal: 100 }, { bal: 200 }, { bal: 500 }];
let UserInfo = [
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  },
  {
    amountLP: 0,
    lastUpdateTime: 0,
    weight: 0,
    lastWeight: 0
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const deposit = (user, amountLP) => {
  console.log('user:', user);
  const lastUpdateTime = Number((new Date().getTime() / 1000).toFixed());
  const weight = amountLP * (new Date().getTime() / 1000 - UserInfo[user].lastUpdateTime).toFixed();
  if (UserInfo[user].amountLP <= 0) {
    UserInfo[user] = { amountLP, lastUpdateTime, weight: 0, lastWeight: 0 };
  } else {
    UserInfo[user].amountLP += amountLP;
    UserInfo[user].lastUpdateTime = lastUpdateTime;
    console.log('deposit ~ totalAmountWeight:', totalAmountWeight);
    UserInfo[user].lastWeight = UserInfo[user].weight;
    totalAmountWeight -= UserInfo[user].lastWeight;
    console.log('deposit ~ totalAmountWeight:', totalAmountWeight);
    UserInfo[user].weight = (UserInfo[user].lastWeight + weight) / 2;
    console.log('deposit ~ totalAmountWeight:', totalAmountWeight);
  }
  totalAmountWeight += UserInfo[user].weight;
  totalAmountLP += amountLP;
  console.log('deposit ~ UserInfo[user]:', UserInfo[user]);
  console.log(
    'deposit ~ allValue:',
    {
      totalAmountLP,
      totalAmountWeight
    },
    '\n'
  );
};

const withdraw = (user, amountLP) => {
  console.log('user:', user);
  console.log('withdraw ~ UserInfo[user]:', UserInfo[user]);
  if (!UserInfo[user] || UserInfo[user].amountLP <= 0) return console.error('You dont using this pool');
  if (UserInfo[user].amountLP < amountLP) return console.error('Insufficient LP amount');

  const lastUpdateTime = (new Date().getTime() / 1000).toFixed();
  console.log('withdraw ~ lastUpdateTime:', lastUpdateTime);

  // UserInfo[user].lastWeight = UserInfo[user].weight;

  const curOldAmountWeight =
    UserInfo[user].amountLP * (new Date().getTime() / 1000 - UserInfo[user].lastUpdateTime).toFixed();

  console.log('🚀 ~ file: math.js:97 ~ withdraw ~ curOldAmountWeight:', curOldAmountWeight);
  // UserInfo[user].lastWeight = curOldAmountWeight;
  UserInfo[user].amountLP -= amountLP;

  const weight = UserInfo[user].amountLP * (new Date().getTime() / 1000 - UserInfo[user].lastUpdateTime).toFixed();
  console.log('🚀 ~ file: math.js:101 ~ withdraw ~ weight:', weight);

  UserInfo[user].weight = (curOldAmountWeight + weight) / 2;

  console.log('🚀 ~ file: math.js:107 ~ withdraw ~ newWeight:', (curOldAmountWeight + weight) / 2);

  totalAmountLP -= amountLP;
  totalAmountWeight += UserInfo[user].weight;
  // users.LP -= LP;
  // uint256 oldUserLPt = users.LP.mul(t);
  // users.LPt -= LP;

  // users.LPt = (oldUserLPt + LP.mul(t)).div(2);
  // users.lastUpdateTime = t;

  // if (LP >= users.LP) {
  //     delete userInfo[msg.sender];
  // }
  console.log('withdraw ~ UserInfo[user]:', UserInfo[user]);
  console.log(
    'withdraw ~ allValue:',
    {
      totalAmountLP,
      totalAmountWeight
    },
    '\n'
  );
};

deposit(1, 100);
sleep(1000).then(async () => {
  deposit(2, 200);
  return sleep(1000).then(() => {
    withdraw(1, 50);
  });
});

// function calculatePrivateLPS(totalLPS, users) {
//   const privateLPS = [];

//   // Calculate the total balance across all users
//   const totalBalance = users.reduce((acc, user) => {
//     return acc + user.balance1 + user.balance2 + user.balance3 + user.balance4 + user.balance5;
//   }, 0);

//   // Calculate the private LPS for each user
//   users.forEach(user => {
//     const userBalance = user.balance1 + user.balance2 + user.balance3 + user.balance4 + user.balance5;
//     const userWeight = userBalance / totalBalance;
//     const userPrivateLPS = userWeight * totalLPS;
//     privateLPS.push(userPrivateLPS);
//   });

//   return privateLPS;
// }

// const privateLPS = calculatePrivateLPS(totalLPS, users);
// console.log(privateLPS);
