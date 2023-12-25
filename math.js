let totalLP = 0;
let totalWeight = 0;
let totalWeightForAll = 0;
let percents = [];
let farmedByDay = 100;
let totalFarmed = 0;
let startTime = 0;
let lastUpdateTime = 0;
let started = false;
let UserInfo = [
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  },
  {
    user: 0,
    amountLP: 0,
    weight: 0,
    lastTotalWeight: 0
  }
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const updateInfo = (type, id, curAmountLP, amountLP, time) => {
  if (!started) {
    startTime = time;
    started = true;
  }
  const dTime = time - lastUpdateTime;
  if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;
  totalWeightForAll -= UserInfo[id].weight;
  const weight = UserInfo[id].weight + curAmountLP * (totalWeight - UserInfo[id].lastTotalWeight);
  totalWeightForAll += weight;

  if (type == 'deposit') {
    curAmountLP += amountLP;
    totalLP += amountLP;
  }
  if (type == 'withdraw') {
    curAmountLP -= amountLP;
    totalLP -= amountLP;
  }

  UserInfo[id].user = id;
  UserInfo[id].amountLP = curAmountLP;
  UserInfo[id].weight = weight;
  UserInfo[id].lastTotalWeight = totalWeight;

  lastUpdateTime = time;
  console.log('after:', UserInfo[id]);
  console.log('global:', { totalLP, totalWeight });

  return true;
};

const sendTransaction = (type, id, amountLP) => {
  console.log(type + ' user:', id);
  console.log('before:', UserInfo[id]);
  const time = Number((new Date().getTime() / 1000).toFixed());
  let curAmountLP = UserInfo[id].amountLP;

  if (type == 'deposit') {
    if (curAmountLP <= 0) {
      UserInfo[id] = {
        user: id,
        amountLP,
        weight: 0,
        lastTotalWeight: 0
      };
    }
  }

  if (type == 'withdraw') {
    if (!UserInfo[id] || curAmountLP <= 0) return console.error('You dont using this pool');
    if (curAmountLP < amountLP) return console.error('Insufficient LP amount');
  }
  if (updateInfo(type, id, curAmountLP, amountLP, time)) {
    //tranfer
    console.log('Done\n');
    //emit
  } else return console.error('hz tut potom uzhe dumat');
};

const getPercents = () => {
  for (let i = 0; i < UserInfo.length; i++) {
    if (UserInfo[i].amountLP > 0) {
      sendTransaction('reinvest', i, 0);
    }
  }

  for (let a = 0; a < UserInfo.length; a++) {
    percents[a] = UserInfo[a].weight / totalWeightForAll;
  }
  console.log('getPercents:\n', percents);
};

const _getTotalFarmed = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTime = time - startTime;
  totalFarmed = farmedByDay * dTime;
  console.log('_getTotalFarmed:\n', totalFarmed);
  return totalFarmed;
};

const reInvest = () => {
  getPercents();
  _getTotalFarmed();

  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = percents[i] * totalFarmed;
    availibleLP[i] = amtLP;
  }
  console.log('reinvest:\n', availibleLP);
  return true;
};

sendTransaction('deposit', 1, 10);
sendTransaction('deposit', 2, 10);
sleep(1000).then(async () => {
  sendTransaction('withdraw', 1, 4);
  await sleep(3000);
  sendTransaction('deposit', 1, 10);
  await sleep(6000);
  reInvest();
});
