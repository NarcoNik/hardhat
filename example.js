class User {
  constructor(id) {
    this.id = id;
    this.investedCoins = 0;
    this.withdrawnCoins = 0;
    this.investmentStartDate = null;
    this.rewards = [];
  }

  invest(coins, currentDate) {
    if (this.investmentStartDate) {
      this.calculateAndAddRewards(currentDate);
    }
    this.investedCoins += coins;
    this.investmentStartDate = currentDate;
  }

  withdraw(coins, currentDate) {
    this.calculateAndAddRewards(currentDate);
    if (this.investedCoins >= coins) {
      this.withdrawnCoins += coins;
      this.investedCoins -= coins;
    } else {
      console.error('Not enough invested coins to withdraw.');
    }
  }

  calculateAndAddRewards(currentDate) {
    if (this.investmentStartDate) {
      const daysInvested = Math.ceil(
        (currentDate - this.investmentStartDate) / (1000 * 60 * 60 * 24)
      );
      const userWeight = this.investedCoins * daysInvested;
      const totalWeight = this.investedCoins + this.withdrawnCoins;
      const percentage = userWeight / totalWeight;
      const rewards = percentage * 100; // В день приходит 100 ревардов
      this.rewards.push(rewards);
    }
  }

  calculateTotalRewards() {
    return this.rewards.reduce((total, dailyReward) => total + dailyReward, 0);
  }

  calculateWeight(currentDate) {
    if (!this.investmentStartDate) {
      return 0;
    }

    const daysInvested = Math.ceil(
      (currentDate - this.investmentStartDate) / (1000 * 60 * 60 * 24)
    );
    return this.investedCoins * daysInvested;
  }
}

class InvestmentSystem {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  distributeRewards(currentDate) {
    for (const user of this.users) {
      user.calculateAndAddRewards(currentDate);
    }
  }

  getTotalRewards() {
    let totalRewards = 0;
    for (const user of this.users) {
      totalRewards += user.calculateTotalRewards();
    }
    return totalRewards;
  }

  calculateUserPercentage(userId) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      const totalRewards = this.getTotalRewards();
      return Math.min((user.calculateTotalRewards() / totalRewards) * 100, 100);
    }
    return 0;
  }
}

// Пример использования
const system = new InvestmentSystem();

const user1 = new User(1);
const user2 = new User(2);

user1.invest(10, new Date(2023, 0, 1)); // Первый пользователь вложил 10 монет в первый день
user2.invest(10, new Date(2023, 0, 1)); // Второй пользователь вложил 10 монет в первый день

user1.withdraw(4, new Date(2023, 0, 2)); // Первый пользователь вывел 4 монеты во второй день

system.addUser(user1);
system.addUser(user2);

// Через 4 дня (включая первый день)
for (let i = 0; i < 4; i++) {
  const currentDate = new Date(2023, 0, i + 1);
  system.distributeRewards(currentDate);
}

console.log('Total Rewards:', system.getTotalRewards());

for (const user of system.users) {
  const userPercentage = system.calculateUserPercentage(user.id);
  console.log(`User ${user.id} is entitled to ${userPercentage}% of the total rewards.`);
}
