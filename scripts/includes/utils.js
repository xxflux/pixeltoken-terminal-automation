#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const rq = require('request-promise');
const { exec } = require("child_process");
const { ethers, BigNumber } = require('ethers');
const axios = require('axios');
const CONST = require('../includes/constants');
const { PROD } = require("./config");

let webhooks;
let pixelTokenteam;
if(!PROD){
  webhooks = require('../includes/webhooks_dev.json');
  pixelTokenteam = [
    "_DISCORD_ID_00",
  ];
} else {
  webhooks = require('../includes/webhooks.json');
  pixelTokenteam = [
    "_DISCORD_ID_01",
    "_DISCORD_ID_02",
    "_DISCORD_ID_03",
    "_DISCORD_ID_04"
  ];
}


exports.getNet = function (chainId){
  switch(chainId){
    case 1: // Mainnet
    case 31337: // local fork
      LMTERMINAL = CONST.LMTERMINAL;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20;
      netName = 'Mainnet';
      assetPlatformId = 'ethereum';
      txExploreUrl = 'https://etherscan.io/tx/';
      LMTERMINAL = CONST.LMTERMINALGOERLI;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20KOVAN;
      netName = 'Mainnet Goerli';
      assetPlatformId = 'ethereum-goerli';
      txExploreUrl = 'https://goerli.etherscan.io/tx/';
      break;
    case 42161: // Arbitrum
      LMTERMINAL = CONST.LMTERMINALARBI;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20ARBI;
      netName = 'Arbitrum';
      assetPlatformId = 'arbitrum-one';
      txExploreUrl = 'https://arbiscan.io/tx/';
      break;
    case 10: // Optimistic
      LMTERMINAL = CONST.LMTERMINALOPTI;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20OPTI;
      netName = 'Optimistic';
      assetPlatformId = 'optimistic-ethereum';
      txExploreUrl = 'https://optimistic.etherscan.io/tx/';
      break;
    case 137: // Polygon
      LMTERMINAL = CONST.LMTERMINALPOLY;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20POLY;
      netName = 'Polygon';
      assetPlatformId = 'polygon-ethereum';
      txExploreUrl = 'https://polygonscan.com/tx/';
      break;
    case 5: // Mainnet Goerli
      LMTERMINAL = CONST.LMTERMINALGOERLI;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20GOERLI;
      netName = 'Mainnet Goerli';
      assetPlatformId = 'ethereum-goerli';
      txExploreUrl = 'https://goerli.etherscan.io/tx/';
      break;
    case 4: // Mainnet Rinkeby
      LMTERMINAL = CONST.LMTERMINALRINKE;
      ORIGINATION = CONST.ORIGINATIONGOERLI;
      ERC20 = CONST.ERC20RINKE;
      netName = 'Mainnet Rinkeby';
      assetPlatformId = 'ethereum-rinkeby';
      txExploreUrl = 'https://rinkeby.etherscan.io/tx/';
      break;
    default:
      console.log("Unknown.chainId>>>", chainId);
      LMTERMINAL = null;
      ORIGINATION = null;
      ERC20 = null;
      netName = 'Unknown';
      assetPlatformId = null;
      txExploreUrl = null;
  }

  return {
    'ERC20': ERC20,
    'LMTERMINAL': LMTERMINAL,
    'ORIGINATION': ORIGINATION,
    'netName': netName,
    'assetPlatformId': assetPlatformId,
    'txExploreUrl': txExploreUrl,

  }
}


exports.initializeInst = async function (provider){
  let wallet = await ethers.Wallet.fromEncryptedJson(
    fs.readFileSync(process.env.AUTOMANAGERWALLET).toString(),
    process.env.AUTOMANAGERPASSWORD
  );
  wallet = await wallet.connect(provider);

  let chainId = wallet.provider._network.chainId;
  let { LMTERMINAL, ORIGINATION } = await this.getNet(chainId);

  LMTerminal = new ethers.Contract(LMTERMINAL.ADDRESS, LMTERMINAL.ABI, wallet);
  LMOrigination = new ethers.Contract(ORIGINATION.ADDRESS, ORIGINATION.ABI, wallet);

  return {
    wallet,
    LMTerminal,
    LMOrigination,
  }
}


exports.getTokenInfo = async function (provider, tokenAddress){
  let wallet = await ethers.Wallet.fromEncryptedJson(
    fs.readFileSync(process.env.AUTOMANAGERWALLET).toString(),
    process.env.AUTOMANAGERPASSWORD
  );
  wallet = await wallet.connect(provider);

  let chainId = wallet.provider._network.chainId;
  let { ERC20 } = await this.getNet(chainId);

  tokenInst = new ethers.Contract(tokenAddress, ERC20.ABI, wallet);

  return {
    'symbol': await tokenInst.symbol(),
  }
}


exports.usdcUnit = async function (amount){
  let weiStr = await BigNumber.from("1000000").mul(amount);
  return await BigNumber.from(weiStr);
}

exports.usdcToUnit = async function (amount){
  let weiStr = await BigNumber.from("1000000").div(amount);
  return await BigNumber.from(weiStr);
}


exports.notifyOnDiscord = async function(to, title, txLink){
  let utc_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  utc_date = utc_date+' +UTC'
  let local_date = new Date().toLocaleString('en-US',{timezone:'America/Los_Angeles'});

  let uri;
  switch(to){
    case 'prod':
      uri = process.env.DISCORDWEBHOOK;
      break;
    case 'terminal':
      uri = webhooks.terminal;
      break;
    case 'terminalnoreward':
      uri = webhooks.terminalnoreward;
      break;
    default:
      uri = process.env.DISCORDWEBHOOKPRIVATE;
  }

  let content =
`\`\`\`css
[${utc_date}]
${title.substring(0,500)}
\`\`\``;
  if(txLink){
    content = content + " [Check tx >]("+txLink+")"
  }
  var options = {
    method: 'POST',
    uri: uri,
    body: {
        content: content
    },
    json: true // Automatically stringifies the body to JSON
  };

  await rq(options).then((r) => {
    console.log(`[${local_date}] Discord notify sent - ${title}`)
  }).catch((e) => {
    console.error(e);
  });
}

exports.notifyOnDiscordWithTag = async function(log) {
    let membertag = "";
    let privateTags = [
      "_DISCORD_ID_01",
      "_DISCORD_ID_02"
    ];
    for(let i=0; i < privateTags.length; i++){
      membertag += "<@"+privateTags[i]+">";
    }
    await axios.post(process.env.DISCORDWEBHOOKPRIVATE, {
        content: membertag + log
    });
    console.log(membertag + log);
}

async function executeChildProcess (cml){
  const { stdout, stderr } = await exec(cml);
  //console.error('stderr:', stderr);
  return stdout;
}

exports.getDateFromJSON = async function(url) {
  let jsonData = JSON.parse(fs.readFileSync(url));
  //console.log("jsonData>>", jsonData);
  return jsonData;
}


exports.storeData = async function (data, path){
  //console.log(data, path);
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}


exports.xAssetLevNotification = async function (log) {
    await axios.post(webhooks.xassetlev, {
        username: "xAssetLev Health Ratio monitoring",
        avatar_url: "",
        content: log
    });
}


exports.storeAppendData = async function(data, path){
  let preData = await fs.readFileSync(path)
  let objData = JSON.parse(preData)
  console.log(typeof data === 'object')
  if(typeof data === 'object'){
    objData.push(data)
  } else {
    objData.push(data[0])
  }

  try {
    fs.writeFileSync(path, JSON.stringify(objData))
  } catch (err) {
    console.error(err)
  }
}

exports.getDateFromJSON = async function(url) {
  let jsonData = JSON.parse(fs.readFileSync(url));
  return jsonData;
}

exports.hoursAgo = async function(hours){
  var d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

exports.bnDecimals = async function (amount, _decimals) {
   let decimal = Math.pow(10, _decimals);
   let decimals = new BigNumber.from(decimal.toString());
   return new BigNumber.from(amount).mul(decimals);
}


// getting token info from Etherchain
exports.tokenInfoFromCoinGecko = async function (assetPlatformId, tokenAddress) {
  let tokenInfo;
  let url = `https://api.coingecko.com/api/v3/coins/${assetPlatformId}/contract/${tokenAddress}`;
  await rq(url).then((r) => {
    let rqObj = JSON.parse(r);
    console.log("rqObj.result>>>", rqObj.result);
    if(rqObj){
      tokenInfo = rqObj.result;
    }
  }).catch((e) => {
    console.error(e);
    return {
      tokenInfo:null,
    };
  });

  return {
    tokenInfo:null,
  };
}
