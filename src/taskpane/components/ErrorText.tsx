import { makeStyles, Text, tokens } from '@fluentui/react-components';
import type { PropsWithChildren } from 'react';
import * as React from 'react';

const getStyles = makeStyles({
  error: {
    margin: 0,
    color: tokens.colorPaletteRedForeground1,
  },
});
const ErrorText: React.FC<PropsWithChildren> = ({ children }) => {
  const styles = getStyles();

  return (
    <Text className={styles.error} as="p" italic block>
      {children}
    </Text>
  );
};

export default ErrorText;
