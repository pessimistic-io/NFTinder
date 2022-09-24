import { ethers } from 'ethers';

export function getQuicknodeProvider() {
  return new ethers.providers.JsonRpcProvider(process.env.VUE_APP_QUICKNODE);
}
