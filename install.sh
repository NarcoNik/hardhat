#### Node.js
####################################################################################
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v20.9.0
nvm list
nvm install lts/Iron
npm i -g npm@latest
nvm use v20.9.0
npm i -g yarn prettier eslint

cd ./hardhat
npm i
npx hardhat compile

####################################################################################
