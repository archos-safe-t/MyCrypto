import { WalletLib } from 'shared/enclave/types';
const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;
const LedgerEth = require('@ledgerhq/hw-app-eth').default;

async function getEthApp() {
  console.log(`Creating transport ${TransportNodeHid}`);

  const transport = await TransportNodeHid.create();

  console.log('Returning new instance');
  console.log(`instance ${LedgerEth} ${transport}`);
  return new LedgerEth(transport);
}

const Ledger: WalletLib = {
  async getChainCode(dpath: string) {
    console.log('Getting eth app');
    const app = await getEthApp();
    try {
      console.log(app);
      console.log('getting address');
      const res = await app.getAddress(dpath);
      console.log(res);
      return {
        publicKey: res.publicKey,
        chainCode: res.chainCode
      };
    } catch (err) {
      console.log('wtf', err);
      throw new Error('test');
    }
  }
};

export default Ledger;
