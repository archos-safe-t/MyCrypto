import { getWalletLib } from 'shared/enclave/server/wallets';
import { GetChainCodeParams, GetChainCodeResponse } from 'shared/enclave/types';

export default async function(params: GetChainCodeParams): Promise<GetChainCodeResponse> {
  console.log(`Getting wallet lib`);
  const wallet = getWalletLib(params.walletType);
  console.log(`Gettig chain code`);
  return wallet.getChainCode(params.dpath);
}
