require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const rq = require('request-promise');
const { ethers, BigNumber } = require('ethers');
const root = path.dirname(require.main.filename);
const { PROD } = require("../scripts/includes/config");
const Utils = require('../scripts/includes/utils');
const CONST = require('../scripts/includes/constants');
const MONTR = require('../scripts/includes/monitor');
const { Webhook } = require('discord-webhook-node');

let provider, webhooks, hookObj, currentStatus, intervalId;
if(!PROD){
  provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  webhooks = require('./includes/webhooks_dev.json');
} else {
  provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMYENDPOINT);
  webhooks = require('./includes/webhooks.json');
}
let apiurl = "https://_API_UTL_";
let tmpDataFile = 'tmp_api_monitor.json';
let prevData = require('../'+tmpDataFile);
let graphApiurl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
let tmpGraphFile = 'tmp_graph_monitor.json';
let prevGraphData = require('../'+tmpGraphFile);

////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////
executionManager();
async function executionManager(){
  if(!PROD){
    console.log(`Run on development mode.`);
  }

  let start_date_r = new Date().toLocaleString('en-US', {timezone:'America/Log_Angeles'});
  console.log(">> start at:", start_date_r);

  let action = process.argv[2];
  hookObj = new Webhook(webhooks.terminalapi);

  if(!action){
    process.exit('Please make sure action flag is defined');
  } else {
    switch (action) {
      case 'terminalAPIDown':
        console.log("Terminal API is down.");
        console.log("Down? prevData>>>", prevData.time, "|", prevData.status);
        // send down notif once.
        if(prevData.status == '200'){
          await MONTR.createEmbedMSG(hookObj);
          let timeoutObj = setInterval(callbackFunc, 5000); // 60 sec = a min, 2000 = 5 sec
          intervalId = timeoutObj[Symbol.toPrimitive](); //intervalId is an interger
          // update status to 404 in tmp_api_monitor.json
          let data = {time: new Date(),status: '404'};
          await Utils.storeData(data, './'+tmpDataFile);
          console.log("terminalAPIDown>data>>>", data);
        }
        break;
      case 'subgraphAPIDown':
        console.log("Subgraph API is down.");
        console.log("Down? prevGraphData>>>", prevGraphData.time, "|", prevGraphData.status);
        // send down notif once.
        if(prevGraphData.status == '200'){
          await MONTR.createEmbedMSGDiscord(
              hookObj,
              'DOWN',
              'Subgraph API Monitoring',
              'https://thegraph.com',
              'Subgraph API is DOWN!',
              '404'
          );
          let timeoutObj = setInterval(callbackFuncSubgraph, 5000); // 60 sec = a min, 2000 = 5 sec
          intervalIdSubgraph = timeoutObj[Symbol.toPrimitive](); //intervalIdSubgraph is an interger
          // update status to 404 in tmp_api_monitor.json
          let data = {time: new Date(),status: '404'};
          await Utils.storeData(data, './'+tmpGraphFile);
          console.log("subgraphAPIDown>data>>>", data);
        }
        break;
      default:
    }
  }
  let end_date = new Date().toLocaleString('en-US', {timezone:'America/Log_Angeles'});
  console.log(">> end at:", end_date);
}


async function callbackFunc() {
  // another monitoring for server up
  try{
      const response = await axios.get(apiurl);
      console.log("response.status from callbackFunc>>>", response.status);
      if(response.status == 200){
        console.log("Up? prevData>>>", prevData.time, "|", prevData.status);
        currentStatus = 200;
        console.log("callbackFunc > intervalId>>>", intervalId);
        // Later you can clear the timer by calling clearInterval with the intervalId like,
        clearInterval(intervalId);
        // send server up notif.
        await MONTR.createEmbedMSGUP(hookObj);
        let data = {time: new Date(),status: '200'};
        console.log("data>>>", data);
        await Utils.storeData(data, './'+tmpDataFile);
      } else if(response.status == 404) {
        // let the script keeps ping the api server.
        await Utils.notifyOnDiscord('private','let the script keep ping the api server');
      }
  } catch(axiosErr){
      console.log(axiosErr);
  }
}

async function callbackFuncSubgraph() {
  // another monitoring for server up
  try{
      const response = await axios.get(graphApiurl);
      console.log("response.status from callbackFunc>>>", response.status);
      if(response.status == 200){
        console.log("Up? prevGraphData>>>", prevGraphData.time, "|", prevGraphData.status);
        currentStatus = 200;
        console.log("callbackFunc > intervalIdSubgraph>>>", intervalIdSubgraph);
        // Later you can clear the timer by calling clearInterval with the intervalIdSubgraph like,
        clearInterval(intervalIdSubgraph);
        // send server up notif.
        await MONTR.createEmbedMSGDiscord(
            hookObj,
            'UP',
            'Subgraph API Monitoring',
            'https://thegraph.com',
            'Subgraph API is Up!',
            'None'
        );
        let data = {time: new Date(),status: '200'};
        console.log("data>>>", data);
        await Utils.storeData(data, './'+tmpGraphFile);
      } else if(response.status == 404) {
        // let the script keeps ping the api server.
        await Utils.notifyOnDiscord('private','let the script keep ping the subgraph api');
      }
  } catch(axiosErr){
      console.log(axiosErr);
  }
}
