import { Image, makeStyles, tokens } from '@fluentui/react-components';
import * as React from 'react';
import ApiHealth from './ApiHealth';

export interface HeaderProps {
  logo: string;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '1rem',
    paddingTop: '2rem',
  },
  title: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightRegular,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
});

const Header: React.FC<HeaderProps> = ({ logo }: HeaderProps) => {
  const styles = useStyles();

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <Image width="90" height="90" src={logo} alt="TiDoc" />
        <h1 className={styles.title}>TiDoc</h1>
      </div>

      <ApiHealth />
    </section>
  );
};

export default Header;
