let totalAmountLP = 0;
let totalAmountWeight = 0;
let percents = [];
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

const init = () => {
  UserInfo[0] = {
    user: 0,
    amountLP: 0,
    lastUpdateTime: Number((new Date().getTime() / 1000).toFixed()),
    weight: 0
  };
};
const updateInfo = (type, id, curAmountLP, amountLP) => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTime = time - UserInfo[id].lastUpdateTime;

  const lastWeight = UserInfo[id].weight;
  const curWeight = curAmountLP * dTime;

  if (type == 'deposit') {
    curAmountLP += amountLP;
    totalAmountLP += amountLP;
  }
  if (type == 'withdraw') {
    curAmountLP -= amountLP;
    totalAmountLP -= amountLP;
  }

  const weight = (lastWeight + curWeight) / 2;

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
  if (UserInfo.length == 0) init();
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

const getPercents = () => {
  for (let i = 0; i < UserInfo.length; i++) {
    // if (UserInfo[i].weight != 0) {
    const percentUser = Number(((UserInfo[i].weight * 100) / totalAmountWeight).toFixed(2));
    percents[i] = percentUser;
    // }
  }
  console.log(percents);
};

const getAvailibleLP = () => {
  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = (percents[i] * totalAmountLP) / 100;
    availibleLP[i] = amtLP;
  }
  console.log(availibleLP);
};
sendTransaction('deposit', 1, 100);
sleep(1000).then(async () => {
  sendTransaction('deposit', 2, 200);
  return sleep(1000).then(() => {
    sendTransaction('withdraw', 1, 50);
    return sleep(1000).then(() => {
      sendTransaction('deposit', 1, 150);
      return sleep(1000).then(() => {
        sendTransaction('deposit', 1, 0);
        sendTransaction('deposit', 2, 0);
        getPercents();
      });
    });
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
