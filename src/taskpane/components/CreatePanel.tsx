import {
  Button,
  Dropdown,
  Input,
  type InputOnChangeData,
  Label,
  makeStyles,
  Option,
  type OptionOnSelectData,
  type SelectionEvents,
  Text,
  tokens,
  useId,
} from '@fluentui/react-components';
import { AddSquareRegular } from '@fluentui/react-icons';
import * as React from 'react';

import { tagSelection } from '../taskpane';

const tagTypeOptions = [
  { label: 'Texte enrichit', value: 'RichText' },
  { label: 'Liste déroulante', value: 'DropDownList' },
  { label: 'Case à cocher', value: 'CheckBox' },
  { label: 'Image', value: 'Picture' },
];

const tagDataOptions = [
  { label: '-', value: '' },
  { label: 'Réference', value: 'reference' },
  { label: 'Type', value: 'type' },
  { label: 'Nom / Raison sociale', value: 'name' },
  { label: "Nom de l'entreprise", value: 'company' },
  { label: 'SIRET', value: 'siret' },
  { label: 'Prénom', value: 'firstName' },
  { label: 'Nom', value: 'lastName' },
  { label: 'Email', value: 'email' },
  { label: 'Téléphone', value: 'phone' },
  { label: 'Adresse', value: 'address' },
  { label: 'Code Postal', value: 'cp' },
  { label: 'Ville', value: 'city' },
  { label: 'Memo', value: 'note' },
  { label: 'Compte Comptable', value: 'accountantId' },
];

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    // Use 2px gap below the label (per the design system)
    gap: '2px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
});

const CreatePanel: React.FC = () => {
  const styles = useStyles();

  const tagNameInputId = useId('tag-name-input');
  const tagDataInputId = useId('tag-data-input');
  const tagTypeInputId = useId('tag-type-input');
  const listItemsInputId = useId('tag-items-input');

  const [tagName, setTagName] = React.useState<string>('');
  const onTagNameChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    setTagName(data.value);
  };

  const [tagDataSelectedOptions, setTagDataSelectedOptions] = React.useState<string[]>([
    tagDataOptions[0].value,
  ]);
  const [tagDataValue, setTagDataValue] = React.useState<string>(tagDataOptions[0].label);
  const onTagDataSelect = (_event: SelectionEvents, data: OptionOnSelectData) => {
    setTagDataSelectedOptions(data.selectedOptions);
    setTagDataValue(data.optionText ?? tagTypeOptions[0].label);
  };

  const [tagTypeSelectedOptions, setTagTypeSelectedOptions] = React.useState<string[]>([
    tagTypeOptions[0].value,
  ]);
  const [tagTypeValue, setTagTypeValue] = React.useState<string>(tagTypeOptions[0].label);
  const onTagTypeSelect = (_event: SelectionEvents, data: OptionOnSelectData) => {
    setTagTypeSelectedOptions(data.selectedOptions);
    setTagTypeValue(data.optionText ?? tagTypeOptions[0].label);

    // Reset list items
    setListItems('');

    // Reset tag data
    setTagDataValue(tagDataOptions[0].label);
    setTagDataSelectedOptions([tagDataOptions[0].value]);
  };

  const [listItems, setListItems] = React.useState<string>('');
  const onListItemsChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    setListItems(data.value);
  };

  const addTagToSelection = async () => {
    const tagData = tagDataSelectedOptions[0]
      ? tagDataOptions.filter(option => option.value === tagDataSelectedOptions[0])[0]
      : null;
    const listItemsArray = listItems.split(',').map(item => item.trim());
    await tagSelection(tagName, tagData, tagTypeSelectedOptions[0], listItemsArray);
  };

  return (
    <section role="tabpanel" aria-labelledby="create-panel-label" className={styles.root}>
      <Text className={styles.description}>
        Créer une zone interactive à la position du curseur.
      </Text>

      <form onSubmit={addTagToSelection} className={styles.form}>
        <div className={styles.inputGroup}>
          <Label htmlFor={tagNameInputId}>Nom de la zone</Label>
          <Input id={tagNameInputId} onChange={onTagNameChange} value={tagName} required />
        </div>

        {tagTypeSelectedOptions[0] === 'RichText' && (
          <div className={styles.inputGroup}>
            <Label htmlFor={tagDataInputId}>Donnée client à insérer</Label>
            <Dropdown
              id={tagDataInputId}
              onOptionSelect={onTagDataSelect}
              selectedOptions={tagDataSelectedOptions}
              value={tagDataValue}
            >
              {tagDataOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Dropdown>
          </div>
        )}

        <div className={styles.inputGroup}>
          <Label htmlFor={tagTypeInputId}>Type de zone</Label>
          <Dropdown
            id={tagTypeInputId}
            onOptionSelect={onTagTypeSelect}
            selectedOptions={tagTypeSelectedOptions}
            value={tagTypeValue}
          >
            {tagTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Dropdown>
        </div>

        {tagTypeSelectedOptions[0] === 'DropDownList' && (
          <div className={styles.inputGroup}>
            <Label htmlFor={listItemsInputId}>Options de la liste (séparés par une virgule)</Label>
            <Input
              id={listItemsInputId}
              onChange={onListItemsChange}
              placeholder="Oui, Non, Peut-être"
              value={listItems}
              required
            />
          </div>
        )}

        <Button appearance="primary" icon={<AddSquareRegular />} type="submit">
          Créer une zone interactive
        </Button>
      </form>
    </section>
  );
};

export default CreatePanel;
