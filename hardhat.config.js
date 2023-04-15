require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

 module.exports = {
   networks: {
     hardhat: {
       forking: {
         url: "https://_ALCHEMY_KEY_URL_",
         enabled: true,
         blockNumber: 760322, // pool creation event.
       }
     }
   },
   test: {

   },
   solidity: "0.7.3",
 };
