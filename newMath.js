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

const updateInfo = (type, id, curAmountLP, amountLP) => {
  const time = Number((new Date().getTime() / 1000).toFixed());

  if (!started) {
    startTime = time;
    started = true;
  }
  const dTime = time - UserInfo[id].lastUpdateTime;

  const lastWeight = UserInfo[id].weight;
  const curWeight = curAmountLP * dTime;
  const weight = (lastWeight + curWeight) / 2; // Calculate the average weight
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

  console.log(type + ' ~ after:', UserInfo[id]);
  console.log(type + ' ~ global:', { totalAmountLP, totalAmountWeight });

  return true;
};

const sendTransaction = (type, id, amountLP) => {
  console.log('user:', id);
  console.log(type + ' ~ before:', UserInfo[id]);
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

const getPercents = () => {
  for (let i = 0; i < UserInfo.length; i++) {
    if (UserInfo[i].amountLP > 0) {
      sendTransaction('reinvest', i, 0);
    }
  }
  for (let a = 0; a < UserInfo.length; a++) {
    percents[a] = UserInfo[a].weight / totalAmountWeight;
  }
  console.log(percents);
};

const _getTotalFarmed = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTime = time - startTime;
  totalFarmed = farmedByDay * dTime;
  console.log(totalFarmed);
  return totalFarmed;
};

const reInvest = () => {
  reinvestTime = Number((new Date().getTime() / 1000).toFixed());
  getPercents();
  const totalFarmed = _getTotalFarmed();

  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = percents[i] * totalFarmed;
    availibleLP[i] = amtLP;
  }

  console.log(availibleLP);

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
