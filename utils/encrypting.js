require('dotenv').config();
const fs = require('fs');
const { ethers, BigNumber } = require('ethers')
const provider = new ethers.providers.InfuraProvider(null, process.env.NETENDPOINT)
// this is onetime script only for you(owner of wallet),
// so it is ok to hard code the private key,
// as long as you dont share this script.
// Dont commit this to git with hard coded private key.
const privateKey = "_YOUR_PRIVATE_KEY_"
const password = "_YOUR_PASSWORD_"
const wallet = new ethers.Wallet(privateKey, provider)

////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////
executionManager();
async function executionManager(){
  encrypting()
}

////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////
async function encrypting(){
  function callback(percent) {
      console.log("Encrypting: " + parseInt(percent * 100) + "% complete");
  }
  var encryptPromise = wallet.encrypt(password, callback);
  encryptPromise.then(function(json) {
      console.log(json);
  });
}
