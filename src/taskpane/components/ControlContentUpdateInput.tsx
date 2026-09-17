import {
  Input,
  type InputOnChangeData,
  useId,
} from '@fluentui/react-components';
import { TextTRegular } from '@fluentui/react-icons';
import * as React from "react";
import { getContentControlText, updateContentControlText } from '../taskpane';

const DEBOUNCE_MS = 300;

const ControlContentUpdateInput: React.FC<{controlId: number}> = ({controlId}) => {
  const inputId = useId('input-id')

  const [value, setValue] = React.useState<string>('');

  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed the input with the text already present in the content control
  React.useEffect(() => {
    let cancelled = false;

    getContentControlText(controlId).then((text) => {
      if (!cancelled) {
        setValue(text);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [controlId]);

  // Cancel any pending update when the component unmounts
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const onInputChange = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setValue(data.value);

    // Debounce the write to Word so we don't queue one call per keystroke
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void updateContentControlText(controlId, data.value);
    }, DEBOUNCE_MS);
  }

  return (
    <Input id={inputId} contentBefore={<TextTRegular />} onChange={onInputChange} value={value} />
  )
}

export default ControlContentUpdateInput
