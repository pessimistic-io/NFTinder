<template>
  <div id="app">
    <Main v-if="is_auth" :accounts="accounts"/>
    <span v-else-if="access_to_accounts">Metamask access required</span>
    <span v-else-if="incorrect_provider">Do you have multiple wallets installed?</span>
    <span v-else-if="!is_mainnet">Switch to mainnet to use this app</span>
    <span v-else-if="!is_rpc_connected">RPC error</span>
    <span v-else>Metamask authorization required</span>
  </div>
</template>

<script>

import Main from '@/components/Main';
import Swiper from '@/components/Swiper';
import detectEthereumProvider from '@metamask/detect-provider';
import { requestAccounts } from '@/scripts/requestAccounts';

export default {
  name: 'App',

  components: {
    Main,
    Swiper
  },

  data: () => {
    return {
      accounts: Array(),
      is_rpc_connected: false,
      access_to_accounts: false,
      chain_ID: '',
      incorrect_provider: true,
    }
  },

  computed: {
    is_mainnet() {
      return this.chain_ID === "0x1";
    },

    is_auth() {
      return Boolean(
        this.access_to_accounts &&
        this.accounts[0] &&
        !this.incorrect_provider &&
        this.is_mainnet
      );
    }
  },

  async beforeMount() {
    // Request access to accounts (metamask pop-up)
    requestAccounts()
      .then(this.handleRequestAccepted)
      .catch(this.handleRequestDenied);
    await this.authWeb3();
  },

  methods: {
    handleRequestAccepted() {
      this.access_to_accounts = true;
    },

    handleRequestDenied(err) {
      this.access_to_accounts = false;
      console.log('access:', err);
    },

    async authWeb3() {
      const provider = await detectEthereumProvider();

      if (provider) {
        this.checkProvider(provider);
        await this.updateEthAccounts();
        this.subscribeToAccountsChange();
        await this.updateChainID();
        this.subscribeToChainIDChange();

        this.checkRPCConnection(); // show app only when you can make RPC calls
        this.subscribeToRPCConnect();
        this.subscribeToRPCDisconnect();
      }
    },

    async updateEthAccounts() {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.handleAccountsChanged(accounts);
    },

    subscribeToAccountsChange() {
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
    },

    handleAccountsChanged(accounts) {
      // User switched main account
      if(accounts[0] !== this.accounts[0] && this.accounts[0] != undefined){
        // TODO: что делать в этом случае? Перезагруить страницу достаточно?
      }
      else {
        this.accounts = accounts;
      }
    },

    checkProvider(provider) {
      this.incorrect_provider = provider !== window.ethereum;
      console.log('incorrect_provider?', this.incorrect_provider);
    },

    async updateChainID() {
      const chain_ID = await window.ethereum.request({ method: 'eth_chainId' });
      this.handleChainChanged(chain_ID);
    },

    subscribeToChainIDChange() {
      window.ethereum.on('chainChanged', this.handleChainChanged);
    },

    handleChainChanged(chainID) {
      this.chain_ID = chainID;
    },

    checkRPCConnection() {
      this.is_rpc_connected = window.ethereum.isConnected();
    },

    subscribeToRPCConnect() {
      window.ethereum.on('connect', function(connect_info) {
        this.is_rpc_connected = true;
      }.bind(this));
    },

    subscribeToRPCDisconnect() {
      window.ethereum.on('disconnect', function(err) {
        this.is_rpc_connected = false;
        console.log('disconnect RPC:', err);
      }.bind(this));
    }
  }
}
</script>

<style lang="scss">

</style>
