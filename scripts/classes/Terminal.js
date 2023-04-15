const { ethers, BigNumber } = require('ethers');
const Utils = require('../includes/utils');
const CONST = require('../includes/constants');

class Terminal {
  constructor(xInit, provider){
    this.provider = provider;
    this.xInit = xInit;
    this.netName;
    this.assetPlatformId;
    this.txExploreUrl;
    if(this.provider._network){
      let netData = Utils.getNet(this.provider._network.chainId);
      this.netName = netData.netName;
      this.assetPlatformId = netData.assetPlatformId;
      this.txExploreUrl = netData.txExploreUrl;
    }
  }

  async listeningDeployedIncentivizedPool(){
    console.log("listening DeployedIncentivizedPool");
    console.log("this.netName>>>", this.netName, " | netID>>>", (this.provider._network) ? this.provider._network.chainId : '');
    let log;
    let filter = this.xInit.LMTerminal.filters.DeployedIncentivizedPool(null, null, null, null, null, null);
    filter.address = this.xInit.LMTerminal.address;
    filter.fromBlock = 0;
    filter.toBlock = "latest";
    this.xInit.LMTerminal.on(filter, (clrInstance, token0, token1, fee, lowerTick, upperTick, event) => {

      try{
        this.tokensCall(token0, token1).then((tokenInfo) => {
          let txHash = event.transactionHash;
          log = `${this.netName} | DeployedIncentivizedPool: clrInstance:${clrInstance}, token0(${tokenInfo.token0Info.symbol}-${token0}), token1:(${tokenInfo.token1Info.symbol}-${token1}), fee(${fee}), lowerTick(${lowerTick}), upperTick(${upperTick})`;
          console.log(log);
          Utils.notifyOnDiscord('terminal', log, (this.txExploreUrl) ? this.txExploreUrl+txHash : '');
          try{
            this.chainCall().then(() => {
              Utils.notifyOnDiscord("private", "chainCall is done");
            });
          }catch(e){
            console.log("Having error chainCall | ", e);
            Utils.notifyOnDiscord("private", "Having error chainCall | "+e);
          }
        });
      }catch(e){
        console.log("Having error tokensCall | ", e);
        Utils.notifyOnDiscord("private", "Having error tokensCall | "+e);
      }
    })
  }

  async listeningDeployedNonIncentivizedPool(){
    console.log("listening DeployedNonIncentivizedPool");
    console.log("this.netName>>>", this.netName, " | netID>>>", (this.provider._network) ? this.provider._network.chainId : '');
    let log;
    let filter = this.xInit.LMTerminal.filters.DeployedNonIncentivizedPool(null, null, null, null, null, null);
    filter.address = this.xInit.LMTerminal.address;
    filter.fromBlock = 0;
    filter.toBlock = "latest";
    this.xInit.LMTerminal.on(filter, (clrInstance, token0, token1, fee, lowerTick, upperTick, event) => {
      console.log("listeningDeployedNonIncentivizedPool>LMTerminal>>>");
      try{
        this.tokensCall(token0, token1).then((tokenInfo) => {
          let txHash = event.transactionHash;
          log = `${this.netName} | DeployedNonIncentivizedPool: clrInstance:${clrInstance}, token0(${tokenInfo.token0Info.symbol}-${token0}), token1:(${tokenInfo.token1Info.symbol}-${token1}), fee(${fee}), lowerTick(${lowerTick}), upperTick(${upperTick})`;
          console.log(log);
          Utils.notifyOnDiscord('terminal', log, (this.txExploreUrl) ? this.txExploreUrl+txHash : '');
          try{
            this.chainCall().then(() => {
              Utils.notifyOnDiscord("private", "chainCall is done");
            });
          }catch(e){
            console.log("Having error chainCall | ", e);
            Utils.notifyOnDiscord("private", "Having error chainCall | "+e);
          }
        });
      }catch(e){
        console.log("Having error tokensCall | ", e);
        Utils.notifyOnDiscord("private", "Having error tokensCall | "+e);
      }
    })
  }

  async tokensCall(token0, token1){
    console.log("tokens call here");
    let token0Info, token1Info;
    if(this.assetPlatformId){
      token0Info = await Utils.getTokenInfo(this.provider, token0);
      token1Info = await Utils.getTokenInfo(this.provider, token1);
    } else {
      token0Info = {'symbol':'Unknown'};
      token1Info = {'symbol':'Unknown'};
    }
    return {
      token0Info,
      token1Info
    };
  }

  async chainCall(){
    console.log("chained call here");
    return true;
  }

}

module.exports = Terminal;
