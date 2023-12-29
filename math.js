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

const updateInfo = (type, id, amountLP, time) => {
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
    started = true;
  }
  const dTime = time - lastUpdateTime;
  if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

  const weight =
    UserInfo[id].weight + UserInfo[id].amountLP * (totalWeight - UserInfo[id].lastTotalWeight);
  let newAmountLP = UserInfo[id].amountLP;
  if (type == 'deposit') {
    newAmountLP += amountLP;
    totalLP += amountLP;
  }
  if (type == 'withdraw') {
    newAmountLP -= amountLP;
    totalLP -= amountLP;
  }

  if (UserInfo[id].season != season) {
    for (let i = UserInfo[id].season; i < ReinvestInfo.length; i++) {
      if (i + 1 != season) {
        const poolInfo = ReinvestInfo[i];
        const weightSeason =
          UserInfo[id].weight +
          UserInfo[id].amountLP * (poolInfo.endTotalWeight - UserInfo[id].lastTotalWeight);

        const dTimeSeason = poolInfo.reinvestTime - poolInfo.startTime;
        const percent = weightSeason / dTimeSeason;

        const availibleToClaim = percent * poolInfo.totalFarmed;

        UserInfo[id] = {
          amountLP: UserInfo[id].amountLP + availibleToClaim,
          weight: weightSeason,
          lastTotalWeight: poolInfo.endTotalWeight,
          season
        };
        totalLP += availibleToClaim;
      } else {
        const currentWeight =
          UserInfo[id].weight +
          UserInfo[id].amountLP * (totalWeight - UserInfo[id].lastTotalWeight);
        if (type == 'deposit') {
          UserInfo[id] = {
            amountLP: UserInfo[id].amountLP + amountLP,
            weight: currentWeight,
            lastTotalWeight: totalWeight,
            season
          };
        }
        if (type == 'withdraw') {
          UserInfo[id] = {
            amountLP: UserInfo[id].amountLP - amountLP,
            weight: currentWeight,
            lastTotalWeight: totalWeight,
            season
          };
        }
      }
    }
  } else {
    UserInfo[id] = {
      amountLP: newAmountLP,
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

  if (type == 'withdraw') {
    if (!UserInfo[id] || UserInfo[id].amountLP <= 0)
      return console.error('You dont using this pool');
    if (UserInfo[id].amountLP < amountLP) return console.error('Insufficient LP amount');
  }
  if (updateInfo(type, id, amountLP, time)) {
    //tranfer
    console.log('Done\n');
    //emit
  } else return console.error('hz tut potom uzhe dumat');
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
  let dTime = reinvestTime == 0 ? time - startTime : time - reinvestTime;
  const currentFarmed = farmedByDay * dTime;
  console.log('_getCurrentFarmed:\n', currentFarmed);
  return currentFarmed;
};

const reInvest = () => {
  const time = Number((new Date().getTime() / 1000).toFixed());
  getPercents(time);
  const currentFarmed = _getCurrentFarmed(time);

  totalLP += currentFarmed;

  ReinvestInfo[season] = {
    season: season,
    startTime: reinvestTime,
    reinvestTime: time,
    startTotalWeight: startTotalWeight,
    endTotalWeight: totalWeight,
    totalFarmed: currentFarmed,
    totalLP: totalLP
  };

  reinvestTime = time;
  season++;

  ReinvestInfo[season] = {
    season: season,
    startTime: reinvestTime,
    reinvestTime: 0,
    startTotalWeight: totalWeight,
    endTotalWeight: 0,
    totalFarmed: 0,
    totalLP: 0
  };
  console.log('reinvest:\n', ReinvestInfo[season - 1]);
  console.log('reinvest:\n', ReinvestInfo[season]);
  return true;
};

sendTransaction('deposit', 0, 20);
sleep(1000).then(async () => {
  sendTransaction('deposit', 2, 100);
  await sleep(2000);
  sendTransaction('deposit', 1, 20);
  await sleep(3000);
  sendTransaction('withdraw', 0, 8);
  await sleep(2000);
  sendTransaction('withdraw', 0, 7);
  await sleep(1000);
  reInvest();
  sendTransaction('deposit', 1, 0);
  await sleep(5000);
  sendTransaction('deposit', 0, 0);
  await sleep(2000);
  reInvest();
  sendTransaction('deposit', 1, 0);
  await sleep(3000);
  sendTransaction('deposit', 0, 0);
  await sleep(1000);
  sendTransaction('deposit', 2, 0);
  await sleep(1000);
  reInvest();
});
