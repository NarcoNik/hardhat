const farmedByDay = 100;

let totalLP = 0;
let totalWeight = 0;
let startTotalWeight = 0;

let started = false;

let ReinvestInfo = [];
let season = 0;
let reinvestTime = 0;
let currentFarmed = 0;
let lastUpdateTime = 0;

let UserInfo = [];
let percents = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const updateInfo = (type, id, curAmountLP, amountLP, time) => {
  const user = UserInfo[id];
  if (!started) {
    ReinvestInfo[season] = {
      season: season,
      startTime: time,
      reinvestTime: 0,
      startTotalWeight: 0,
      endTotalWeight: 0,
      totalFarmed: 0,
      totalLP: 0
    };
    reinvestTime = time;
    startTotalWeight = 0;
    started = true;
  }
  console.log(ReinvestInfo[season]);
  const dTime = time - lastUpdateTime;
  if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

  const weight = user.weight + curAmountLP * (totalWeight - user.lastTotalWeight);

  if (type == 'deposit') {
    curAmountLP += amountLP;
    totalLP += amountLP;
  }
  if (type == 'withdraw') {
    curAmountLP -= amountLP;
    totalLP -= amountLP;
  }

  if (user.season != season) {
    for (let i = 0; i < ReinvestInfo.length; i++) {
      if (i <= user.season && user.season < ReinvestInfo.length && i + 1 != season) {
        const poolInfo = ReinvestInfo[i];
        const weightSeason =
          user.weight + user.amountLP * (poolInfo.endTotalWeight - user.lastTotalWeight);

        const dTimeSeason = poolInfo.reinvestTime - poolInfo.startTime;
        const percent = weightSeason / dTimeSeason;

        const availibleToClaim = percent * poolInfo.totalFarmed;

        UserInfo[id] = {
          amountLP: user.amountLP + availibleToClaim,
          weight: weightSeason,
          lastTotalWeight: poolInfo.endTotalWeight,
          season
        };
      } else if (i + 1 == season) {
        const currentWeight = user.weight + user.amountLP * (totalWeight - user.lastTotalWeight);
        if (type == 'deposit') {
          UserInfo[id] = {
            amountLP: user.amountLP + amountLP,
            weight: currentWeight,
            lastTotalWeight: totalWeight,
            season
          };
          totalLP += amountLP;
        }
        if (type == 'withdraw') {
          UserInfo[id] = {
            amountLP: user.amountLP - amountLP,
            weight: currentWeight,
            lastTotalWeight: totalWeight,
            season
          };
          totalLP -= amountLP;
        }
      }
    }
  } else {
    UserInfo[id] = {
      amountLP: curAmountLP,
      weight,
      lastTotalWeight: totalWeight,
      season
    };
  }

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
        season: season
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
  const dTimeAll = time - reinvestTime;
  const dTime = time - lastUpdateTime;
  const totalWeights = totalWeight + dTime / totalLP;
  const percent =
    (users.weight + users.amountLP * (totalWeights - users.lastTotalWeight)) / dTimeAll;

  console.log('getPercentForOneUser:\n', percent);
  return percent;
};

const getPercents = time => {
  const dTimeAll = time - reinvestTime;
  const dTime = time - lastUpdateTime;
  const totalWeights = totalWeight + dTime / totalLP;

  for (let a = 0; a < UserInfo.length; a++) {
    percents[a] =
      (UserInfo[a].weight + UserInfo[a].amountLP * (totalWeights - UserInfo[a].lastTotalWeight)) /
      dTimeAll;
  }
  console.log('getPercents:\n', percents);
};

const _getCurrentFarmed = time => {
  let dTime = time - reinvestTime;
  currentFarmed = farmedByDay * dTime;
  console.log('_getCurrentFarmed:\n', currentFarmed);
  return currentFarmed;
};

const reInvest = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  getPercents(time);
  _getCurrentFarmed(time);

  const availibleLP = [];
  for (let i = 0; i < UserInfo.length; i++) {
    const amtLP = percents[i] * currentFarmed;
    availibleLP[i] = amtLP;
  }
  totalLP += currentFarmed;

  reinvestTime = time;

  ReinvestInfo[season] = {
    season: season,
    startTime: reinvestTime,
    reinvestTime: time,
    startTotalWeight: startTotalWeight,
    endTotalWeight: totalWeight,
    totalFarmed: currentFarmed,
    totalLP: totalLP
  };

  currentFarmed = 0;
  season++;

  ReinvestInfo[season] = {
    season: season,
    startTime: reinvestTime,
    reinvestTime: 0,
    startTotalWeight: startTotalWeight,
    endTotalWeight: 0,
    totalFarmed: 0,
    totalLP: 0
  };
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
