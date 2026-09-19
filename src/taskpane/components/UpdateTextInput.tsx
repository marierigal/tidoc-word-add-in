import {
  Button,
  Input,
  type InputOnChangeData,
  makeStyles,
  Spinner,
  Tooltip,
  useId,
} from '@fluentui/react-components';
import { ArrowResetRegular, CheckmarkRegular, TextTRegular } from '@fluentui/react-icons';
import * as React from 'react';

import { useAsyncAction } from '../../hooks/useAsyncAction';
import { ContentControlsService } from '../../services/word/ContentControlsService';

import ErrorText from './ErrorText';

const getStyles = makeStyles({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2px',
  },
  input: {
    flexGrow: 1,
  },
});

const UpdateTextInput: React.FC<{ controlId: number }> = ({ controlId }) => {
  const styles = getStyles();

  const inputId = useId('input-id');

  const { run: updateText, error, isLoading } = useAsyncAction(ContentControlsService.setText);

  const [value, setValue] = React.useState<string>('');
  const onInputChange = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setValue(data.value);
  };

  const handleInsert = async () => {
    await updateText(controlId, value);
  };

  const handleReset = async () => {
    const text = await ContentControlsService.getText(controlId);
    setValue(text);
  };

  React.useEffect(() => {
    ContentControlsService.getText(controlId).then(text => {
      setValue(text);
    });
  }, [controlId]);

  return (
    <>
      <div className={styles.flexRow}>
        <Input
          id={inputId}
          className={styles.input}
          contentBefore={<TextTRegular />}
          contentAfter={
            <Tooltip content="Réinitialiser" relationship="label">
              <Button appearance="transparent" icon={<ArrowResetRegular />} onClick={handleReset} />
            </Tooltip>
          }
          onChange={onInputChange}
          value={value}
        />

        <Tooltip content="Mettre à jour" relationship="label">
          <Button
            appearance="primary"
            icon={
              isLoading ? <Spinner appearance="inverted" size="extra-tiny" /> : <CheckmarkRegular />
            }
            onClick={handleInsert}
          />
        </Tooltip>
      </div>

      {error && <ErrorText>{error}</ErrorText>}
    </>
  );
};

export default UpdateTextInput;
