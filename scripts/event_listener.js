require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const rq = require('request-promise');
const { ethers, BigNumber } = require('ethers');
const root = path.dirname(require.main.filename);
const { PROD } = require("../scripts/includes/config");
const Util = require('../scripts/includes/utils');
const CONST = require('../scripts/includes/constants');
const Terminal = require('../scripts/classes/Terminal');
const Origination = require('../scripts/classes/Origination');

let providers, providerMainnet, providerArbinet, providerOptinet, providerPolynet, providerGoerli, providerLocalnet;
if(!PROD){
  providerLocalnet = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  providerGoerli = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT_MAINNET_GOERLI);
  providers = [providerLocalnet, providerGoerli];
} else {
  providerMainnet = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT_MAINNET);
  providerArbinet = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT_ARBINET);
  providerOptinet = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT_OPTINET);
  providerPolynet = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT_POLYNET);
  providers = [providerMainnet, providerArbinet, providerOptinet, providerPolynet];
}


////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////
executionManager();
async function executionManager(){
  if(!PROD){
    console.log(`Run on development mode.`);
  }
  for(let idx in providers){
    const xInit = await Util.initializeInst(providers[idx]);
    const TerminalInst = new Terminal(xInit, providers[idx]);
    await TerminalInst.listeningDeployedIncentivizedPool();
    await TerminalInst.listeningDeployedNonIncentivizedPool();

    const OriginationInst = new Origination(xInit, providers[idx]);
    await OriginationInst.listeningCreateFungibleListing();
  }
}
