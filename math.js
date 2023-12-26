let totalLP = 0;
let totalWeight = 0;
let percents = [];
let farmedByDay = 100;
let currentFarmed = 0;
let totalFarmed = 0;
let startTime = 0;
let lastUpdateTime = 0;
let reinvestedTime = 0;
let started = false;
let UserInfo = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const updateInfo = (type, id, curAmountLP, amountLP, time) => {
  if (!started) {
    startTime = time;
    started = true;
  }
  const dTime = time - lastUpdateTime;
  if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

  const weight = UserInfo[id].weight + curAmountLP * (totalWeight - UserInfo[id].lastTotalWeight);

  if (type == 'deposit') {
    curAmountLP += amountLP;
    totalLP += amountLP;
  }
  if (type == 'withdraw') {
    curAmountLP -= amountLP;
    totalLP -= amountLP;
  }
  if (totalFarmed != 0 && UserInfo[id].lastTotalFarmed != totalFarmed) {
    const dTimeAll = time - startTime;
    const percent = weight / dTimeAll;
    UserInfo[id].availibleToClaim = percent * totalFarmed;
    UserInfo[id].lastTotalFarmed = totalFarmed;
  }

  UserInfo[id].amountLP = curAmountLP;
  UserInfo[id].weight = weight;
  UserInfo[id].lastTotalWeight = totalWeight;

  lastUpdateTime = time;
  console.log('after:', UserInfo[id]);
  console.log('global:', { totalLP, totalWeight });

  return true;
};

const sendTransaction = (type, id, amountLP) => {
  const time = Number((new Date().getTime() / 1000).toFixed());

  if (type == 'deposit') {
    if (UserInfo[id] == undefined || UserInfo[id].amountLP <= 0) {
      UserInfo[id] = {
        amountLP: 0,
        weight: 0,
        lastTotalWeight: 0,
        availibleToClaim: 0,
        lastTotalFarmed: 0
      };
    }
  }

  console.log(type + ' user:', id);
  console.log('before:', UserInfo[id]);
  let curAmountLP = UserInfo[id].amountLP;

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
const getPercentForOneUser = id => {
  const users = UserInfo[id];
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTimeAll = time - startTime;
  const dTime = time - lastUpdateTime;
  const totalWeights = totalWeight + dTime / totalLP;
  const percent =
    (users.weight + users.amountLP * (totalWeights - users.lastTotalWeight)) / dTimeAll;

  console.log('getPercentForOneUser:\n', percent);
  return percent;
};

const getPercents = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  const dTimeAll = time - startTime;
  const dTime = time - lastUpdateTime;
  const totalWeights = totalWeight + dTime / totalLP;

  for (let a = 0; a < UserInfo.length; a++) {
    percents[a] =
      (UserInfo[a].weight + UserInfo[a].amountLP * (totalWeights - UserInfo[a].lastTotalWeight)) /
      dTimeAll;
  }
  console.log('getPercents:\n', percents);
};

const _getCeurrentFarmed = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  let dTime;
  if (reinvestedTime != 0) dTime = time - reinvestedTime;
  else dTime = time - startTime;
  currentFarmed = farmedByDay * dTime;
  console.log('_getCurrentFarmed:\n', currentFarmed);
  return currentFarmed;
};

const reInvest = () => {
  getPercents();
  _getCeurrentFarmed();

  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = percents[i] * currentFarmed;
    availibleLP[i] = amtLP;
  }
  totalLP += currentFarmed;
  totalFarmed += currentFarmed;
  currentFarmed = 0;
  reinvestedTime = Number((new Date().getTime() / 1000).toFixed());
  console.log('reinvest:\n', availibleLP);
  return true;
};

sendTransaction('deposit', 0, 20);
sleep(3000).then(async () => {
  sendTransaction('deposit', 1, 20);
  await sleep(3000);
  sendTransaction('withdraw', 0, 8);
  await sleep(2000);
  sendTransaction('withdraw', 0, 7);
  await sleep(1000);
  reInvest();
  await sleep(1000);
  sendTransaction('withdraw', 1, 5);
  await sleep(1000);
  sendTransaction('deposit', 0, 5);
  await sleep(1000);
  reInvest();
});
