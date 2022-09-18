// Metamask request to access accounts
export async function requestAccounts() {
  return await window.ethereum.request({ method: 'eth_requestAccounts' });
}
