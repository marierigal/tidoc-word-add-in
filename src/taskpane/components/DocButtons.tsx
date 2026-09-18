import {
  Button, type ButtonProps, InteractionTag, InteractionTagPrimary, makeStyles, Text,
} from '@fluentui/react-components';
import {
  AddSquareRegular,
  ArrowResetRegular,
  CheckmarkRegular,
  DocumentEditRegular,
  PersonSquareAddRegular,
  TagAddRegular,
} from '@fluentui/react-icons';
import * as React from "react";

const getStyles = makeStyles({
  noPointer: {
    ":hover": {
      cursor: "default",
    }
  }
})

export const DocButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const styles = getStyles();

  return (
    <Button
      className={styles.noPointer}
      size="small"
      appearance="primary"
      {...props}
    >
      {children}
    </Button>
  )
}

export const DocTabCreate = () => <DocButton icon={<TagAddRegular />} appearance="outline">Créer</DocButton>
export const DocTabFill = () => <DocButton icon={<DocumentEditRegular />} appearance="outline">Remplir</DocButton>

export const DocButtonCreate = () => <DocButton icon={<AddSquareRegular />}>Créer une zone interactive</DocButton>
export const DocButtonInsert = () => <DocButton icon={<PersonSquareAddRegular />}>Insérer les données client</DocButton>
export const DocButtonCheck = () => <DocButton icon={<CheckmarkRegular />} />
export const DocButtonReset = () => <DocButton icon={<ArrowResetRegular />} appearance="transparent" />

export const DocTagGoto = ({ children }) => (
  <InteractionTag size="small" appearance="brand">
    <InteractionTagPrimary className={getStyles().noPointer}>
      <Text wrap={false}>{children}</Text>
    </InteractionTagPrimary>
  </InteractionTag>
)
