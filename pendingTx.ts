import ethers  from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const accountAddress = "0xDbB8B5806e68440780801511cEf9DA0C0554FC51";
const Provider = process.env.SEPOLIA_RPC;
let provider = new ethers.providers.JsonRpcProvider(Provider?.toString());
const main = async()=>{
  provider.getTransactionCount(accountAddress, 'pending')
  .then(count => {
    console.log(`Pending transaction count for ${accountAddress}: ${count}`);
  })
  .catch(error => {
    console.error('Error retrieving pending transaction count:', error);
  });
}

