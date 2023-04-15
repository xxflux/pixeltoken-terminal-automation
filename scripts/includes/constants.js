const fs = require('fs');;
const path = require('path');
const { ethers } = require('ethers');
const root = path.dirname(require.main.filename);
const DEC_18 = ethers.utils.parseEther('1');

const ERC20ABI = JSON.parse(fs.readFileSync(path.join(root,'/abi/dai.abi')));
const LMTERMINALABI = JSON.parse(fs.readFileSync(path.join(root,'/abi/terminal.abi')));
const LMTERMINALABIGOERLIABI = JSON.parse(fs.readFileSync(path.join(root,'/abi/terminaloerli.abi')));
const ORIGINATIONGOERLIABI = JSON.parse(fs.readFileSync(path.join(root,'/abi/originationoerli.abi')));

const ERC20 = {
  ADDRESS: '0xa56E56B1EeE555b8B2F410186Dad4A309e8b0d74',
  ABI: ERC20ABI,
};
const ERC20ARBI = {
  ADDRESS: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  ABI: ERC20ABI,
};
const ERC20OPTI = {
  ADDRESS: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  ABI: ERC20ABI,
};
const ERC20POLY = {
  ADDRESS: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  ABI: ERC20ABI,
};
const ERC20GOERLI = {
  ADDRESS: '0xE68104D83e647b7c1C15a91a8D8aAD21a51B3B3E',
  ABI: ERC20ABI,
};
const ERC20RINKE = {
  ADDRESS: '0xb99ddaA704cf8Cf6eCD34265835FCb0Db627bDaF',
  ABI: ERC20ABI,
};
const LMTERMINAL = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABI,
};
const LMTERMINALARBI = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABI,
};
const LMTERMINALOPTI = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABI,
};
const LMTERMINALPOLY = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABI,
};
const LMTERMINALGOERLI = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABIGOERLIABI,
};
const LMTERMINALRINKE = {
  ADDRESS: '0x__',
  ABI: LMTERMINALABI,
};
const ORIGINATIONGOERLI = {
  ADDRESS: '0x__',
  ABI: ORIGINATIONGOERLIABI,
};

module.exports = {
  ERC20,
  ERC20ARBI,
  ERC20OPTI,
  ERC20POLY,
  ERC20GOERLI,
  ERC20RINKE,
  DEC_18,
  LMTERMINAL,
  LMTERMINALARBI,
  LMTERMINALOPTI,
  LMTERMINALPOLY,
  LMTERMINALGOERLI,
  LMTERMINALRINKE,
  ORIGINATIONGOERLI
}
