import Web3 from 'web3';

export function getConnectedWeb3Instance() {
  return new Web3(window.ethereum);
}
