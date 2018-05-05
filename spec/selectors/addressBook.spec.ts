import {
  getAddressLabels,
  getLabelAddresses,
  getAddressLabelEntry,
  getAddressLabelPairs
} from 'selectors/addressBook';
import { getInitialState } from './helpers';

describe('addressBook: Selectors', () => {
  const state = {
    ...getInitialState(),
    addressBook: {
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      },
      entries: {
        0: {
          address: '0x0',
          addressError: 'Derp',
          label: 'Foo',
          labelError: 'Derp'
        }
      }
    }
  };

  describe('getAddressLabels', () => {
    it('should return a hash of addresses to labels', () => {
      expect(getAddressLabels(state)['0x0']).toEqual('Foo');
    });
  });

  describe('getLabelAddresses', () => {
    it('should return a hash of labels to addresses', () => {
      expect(getLabelAddresses(state).Foo).toEqual('0x0');
    });
  });

  describe('getAddressLabelEntry', () => {
    it('should return an address label entry', () => {
      expect(getAddressLabelEntry(state, '0')).toEqual({
        address: '0x0',
        addressError: 'Derp',
        label: 'Foo',
        labelError: 'Derp'
      });
    });
  });

  describe('getAddressLabelPairs', () => {
    it('should return an array of objects that contain an address and a label', () => {
      expect(getAddressLabelPairs(state)[0]).toEqual({
        address: '0x0',
        label: 'Foo'
      });
    });
  });
});
