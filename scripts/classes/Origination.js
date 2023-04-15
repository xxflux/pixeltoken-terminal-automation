const { ethers, BigNumber } = require('ethers');
const Utils = require('../includes/utils');
const CONST = require('../includes/constants');

class Origination {
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

  async listeningCreateFungibleListing(){
    console.log("listening CreateFungibleListing");
    console.log("this.netName>>>", this.netName, " | netID>>>", (this.provider._network) ? this.provider._network.chainId : '');
    let log;
    let filter = this.xInit.LMOrigination.filters.CreateFungibleListing(null, null);
    filter.address = this.xInit.LMOrigination.address;
    filter.fromBlock = 0;
    filter.toBlock = "latest";
    this.xInit.LMOrigination.on(filter, (originationPool, msgsender, event) => {

      try{
        let txHash = event.transactionHash;
        log = `${this.netName} | CreateFungibleListing: originationPool:${originationPool}, msg.sender(${msgsender})`;
        console.log(log);
        Utils.notifyOnDiscord("private", log, (this.txExploreUrl) ? this.txExploreUrl+txHash : '');
        try{
          this.chainCall().then(() => {
            Utils.notifyOnDiscord("private", "chainCall is done");
          });
        }catch(e){
          console.log("Having error chainCall | ", e);
          Utils.notifyOnDiscord("private", "Having error chainCall | "+e);
        }

      }catch(e){
        console.log("Having error event | ", e);
        Utils.notifyOnDiscord("private", "Having error event | "+e);
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
    console.log("origination chained call here");
    return true;
  }

}

module.exports = Origination;
