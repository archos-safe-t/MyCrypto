import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import KeyCodes from 'shared/keycodes';
import { AppState } from 'reducers';
import { translateRaw } from 'translations';
import { isValidETHAddress } from 'libs/validators';
import {
  TAddLabelForAddress,
  TRemoveLabelForAddress,
  addLabelForAddress,
  removeLabelForAddress,
  AddressLabelPair
} from 'actions/addressBook';
import { getAddressLabelPairs } from 'selectors/addressBook';
import { Input, Identicon } from 'components/ui';
import AddressBookTableRow from './AddressBookTableRow';
import './AddressBookTable.scss';

interface DispatchProps {
  addLabelForAddress: TAddLabelForAddress;
  removeLabelForAddress: TRemoveLabelForAddress;
}

interface StateProps {
  rows: ReturnType<typeof getAddressLabelPairs>;
}

type Props = DispatchProps & StateProps;

interface State {
  editingRow: number | null;
  temporaryLabel: string;
  temporaryAddress: string;
}

class AddressBookTable extends React.Component<Props, State> {
  public state: State = {
    editingRow: null,
    temporaryLabel: '',
    temporaryAddress: ''
  };

  private addressInput: HTMLInputElement | null = null;

  private labelInput: HTMLInputElement | null = null;

  public render() {
    const { rows } = this.props;
    const { temporaryLabel, temporaryAddress } = this.state;

    return (
      <table className="AddressBookTable table" onKeyDown={this.handleKeyDown}>
        <tbody>
          <tr className="AddressBookTable-row">
            <td>
              <div className="AddressBookTable-cell">
                <div className="AddressBookTable-cell-identicon">
                  <Identicon address={temporaryAddress} size="100%" />
                </div>
                <Input
                  placeholder={translateRaw('NEW_ADDRESS')}
                  value={temporaryAddress}
                  onChange={this.setTemporaryAddress}
                  setInnerRef={this.setAddressInputRef}
                />
              </div>
            </td>
            <td>
              <div className="AddressBookTable-cell">
                <Input
                  placeholder={translateRaw('NEW_LABEL')}
                  value={temporaryLabel}
                  onChange={this.setTemporaryLabel}
                  setInnerRef={this.setLabelInputRef}
                />
              </div>
            </td>
            <td>
              <div className="AddressBookTable-cell AddressBookTable-cell-action">
                <button className="btn btn-sm btn-success" onClick={this.handleAddEntry}>
                  <i className="fa fa-plus" />
                </button>
              </div>
            </td>
          </tr>
          <tr className="AddressBookTable-spacer" />
          {rows.map(this.makeLabelRow)}
        </tbody>
      </table>
    );
  }

  private handleSave = (addressToLabel: AddressLabelPair) => {
    this.props.addLabelForAddress(addressToLabel);
    this.setEditingRow(null);
  };

  private handleAddEntry = () => {
    const { temporaryLabel: label, temporaryAddress: address } = this.state;

    if (!isValidETHAddress(address) && this.addressInput) {
      return this.addressInput.focus();
    }

    if (!label && this.labelInput) {
      return this.labelInput.focus();
    }

    if (label && isValidETHAddress(address)) {
      this.handleSave({ label, address });
      this.clearTemporaryFields();
    }
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.keyCode === KeyCodes.ENTER) {
      this.handleAddEntry();
    }
  };

  private setEditingRow = (editingRow: number | null) => this.setState({ editingRow });

  private makeLabelRow = (addressToLabel: AddressLabelPair, index: number) => {
    const { editingRow } = this.state;
    const isEditingRow = index === editingRow;

    return (
      <AddressBookTableRow
        key={index}
        index={index}
        address={addressToLabel.address}
        label={addressToLabel.label}
        isEditing={isEditingRow}
        onSave={(labelToSave: string) =>
          this.handleSave({
            label: labelToSave,
            address: addressToLabel.address
          })
        }
        onEditClick={() => this.setEditingRow(index)}
        onRemoveClick={() => this.props.removeLabelForAddress(addressToLabel.address)}
      />
    );
  };

  private setTemporaryLabel = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ temporaryLabel: e.target.value });

  private setTemporaryAddress = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ temporaryAddress: e.target.value });

  private clearTemporaryFields = () =>
    this.setState({
      temporaryLabel: '',
      temporaryAddress: ''
    });

  private setAddressInputRef = (node: HTMLInputElement) => (this.addressInput = node);

  private setLabelInputRef = (node: HTMLInputElement) => (this.labelInput = node);
}

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = state => ({
  rows: getAddressLabelPairs(state)
});

const mapDispatchToProps: DispatchProps = { addLabelForAddress, removeLabelForAddress };

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookTable);