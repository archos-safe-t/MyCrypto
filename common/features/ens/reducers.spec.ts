import { createStore } from 'redux';

import { resolveDomainRequested } from './actions';
import ens from './reducers';

const store = createStore(ens);
const INITIAL_STATE = store.getState();

describe('customTokens reducer', () => {
  it('handles resolveDomainRequested', () => {
    const ensName = 'ensName';

    expect(ens(undefined as any, resolveDomainRequested(ensName))).toEqual({
      ...INITIAL_STATE,
      domainRequests: { ensName: { state: 'PENDING' } },
      domainSelector: { currentDomain: 'ensName' }
    });
  });
});