import { Image, makeStyles, tokens } from '@fluentui/react-components';
import * as React from 'react';

export interface HeaderProps {
  logo: string;
}

const useStyles = makeStyles({
  welcome__header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '2rem',
    paddingTop: '2rem',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  message: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightRegular,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
});

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { logo } = props;
  const styles = useStyles();

  return (
    <section className={styles.welcome__header}>
      <Image width="90" height="90" src={logo} alt="TiDoc" />
      <h1 className={styles.message}>TiDoc</h1>
    </section>
  );
};

export default Header;
