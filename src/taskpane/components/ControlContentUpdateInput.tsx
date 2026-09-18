import {
  Button,
  Input,
  type InputOnChangeData,
  makeStyles,
  Tooltip,
  useId,
} from '@fluentui/react-components';
import { ArrowResetRegular, CheckmarkRegular, TextTRegular } from '@fluentui/react-icons';
import * as React from 'react';

import { getContentControlText, updateContentControlText } from '../taskpane';

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

const ControlContentUpdateInput: React.FC<{ controlId: number }> = ({ controlId }) => {
  const styles = getStyles();

  const inputId = useId('input-id');

  const [value, setValue] = React.useState<string>('');
  const onInputChange = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setValue(data.value);
  };

  const handleInsert = async () => {
    await updateContentControlText(controlId, value);
  };

  const handleReset = async () => {
    const text = await getContentControlText(controlId);
    setValue(text);
  };

  React.useEffect(() => {
    getContentControlText(controlId).then(text => {
      setValue(text);
    });
  }, [controlId]);

  return (
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
        <Button appearance="primary" icon={<CheckmarkRegular />} onClick={handleInsert} />
      </Tooltip>
    </div>
  );
};

export default ControlContentUpdateInput;
