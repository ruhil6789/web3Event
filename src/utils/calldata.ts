import { ethers } from 'ethers';
const abi = new ethers.utils.AbiCoder();

export const getLowLevelCalldata = async (address:any,value:any) => {
    let opData = abi.encode(["address", "uint256", "bytes"], [address, value.toString(), 0x00]);
    return opData
}