import {
  Button,
  Dropdown,
  Input,
  Option,
  type InputOnChangeData,
  Label,
  makeStyles,
  type OptionOnSelectData,
  type SelectionEvents,
  useId,
  tokens,
  Text,
} from '@fluentui/react-components';
import * as React from "react";
import { tagSelection } from '../taskpane';

const tagTypes = [
  { label: "Texte enrichit", value: "RichText" },
  { label: "Liste déroulante", value: "DropDownList" },
  { label: "Case à cocher", value: "CheckBox" },
  { label: "Image", value: "Picture" },
]

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    gap: "2px",
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
  }
});

const CreatePanel: React.FC = () => {
  const styles = useStyles();

  const tagNameInputId = useId("tag-name-input");
  const tagTypeInputId = useId("tag-type-input");
  const listItemsInputId = useId("tag-items-input");

  const [tagName, setTagName] = React.useState<string>("");

  const onTagNameChange = (_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setTagName(data.value);
  }

  const [tagTypeSelectedOptions, setTagTypeSelectedOptions] = React.useState<string[]>([tagTypes[0].value]);
  const [tagTypeValue, setTagTypeValue] = React.useState<string>(tagTypes[0].label);

  const onTagTypeSelect = (_event: SelectionEvents, data: OptionOnSelectData) => {
    setTagTypeSelectedOptions(data.selectedOptions);
    setTagTypeValue(data.optionText ?? tagTypes[0].label);
  }

  const [listItems, setListItems] = React.useState<string[]>([]);

  const onListItemsChange = (_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setListItems(data.value.split(',').map((item) => item.trim()));
  }

  const addTagToSelection = async () => {
    await tagSelection(tagName, tagTypeSelectedOptions[0], listItems);
    setTagName("");
    setListItems([]);
  }
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await addTagToSelection()
    }
  };

  return (
    <div role="tabpanel" aria-labelledby="create-panel-label" className={styles.root}>
      <Text className={styles.description}>Créer une zone intéractive à la position du curseur.</Text>

      <div className={styles.inputGroup}>
        <Label htmlFor={tagNameInputId}>Nom de la zone intéractive</Label>
        <Input id={tagNameInputId} onChange={onTagNameChange} value={tagName} onKeyDown={(e) => handleKeyDown(e)} />
      </div>

      <div className={styles.inputGroup}>
        <Label htmlFor={tagTypeInputId}>Type de zone intéractive (optionnel)</Label>
        <Dropdown
          id={tagTypeInputId}
          onOptionSelect={onTagTypeSelect}
          selectedOptions={tagTypeSelectedOptions}
          value={tagTypeValue}
        >
          {tagTypes.map((tagType) => (
            <Option key={tagType.value} value={tagType.value}>
              {tagType.label}
            </Option>
          ))}
        </Dropdown>
      </div>

      {tagTypeSelectedOptions[0] === "DropDownList" && (
        <div className={styles.inputGroup}>
          <Label htmlFor={listItemsInputId}>Choix de la liste (séparés par une virgule)</Label>
          <Input id={listItemsInputId} onChange={onListItemsChange} value={listItems.join(',')} />
        </div>
      )}

      <Button appearance="primary" onClick={addTagToSelection}>Créer un zone intéractive</Button>
    </div>
  )
}

export default CreatePanel
