import {
  makeStyles,
  type SelectTabData,
  type SelectTabEvent,
  Tab,
  TabList,
} from '@fluentui/react-components';
import { ChatHelpRegular, DocumentEditRegular, TagAddRegular } from '@fluentui/react-icons';
import * as React from 'react';

import CreatePanel from './CreatePanel';
import FillPanel from './FillPanel';
import Header from './Header';
import HelpPanel from './HelpPanel';

enum TabPanel {
  FILL,
  CREATE,
  HELP,
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
  },
  panel: {
    padding: '1rem',
  },
});

const App: React.FC = () => {
  const styles = useStyles();

  const [activePanel, setActivePanel] = React.useState<TabPanel>(TabPanel.HELP);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setActivePanel(data.value as TabPanel);
  };

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" />

      <nav>
        <TabList selectedValue={activePanel} onTabSelect={onTabSelect}>
          <Tab id="fill-panel-label" icon={<DocumentEditRegular />} value={TabPanel.FILL}>
            Remplir
          </Tab>
          <Tab id="create-panel-label" icon={<TagAddRegular />} value={TabPanel.CREATE}>
            Créer
          </Tab>
          <Tab id="help-panel-label" icon={<ChatHelpRegular />} value={TabPanel.HELP}>
            Aide
          </Tab>
        </TabList>
      </nav>

      <div className={styles.panel}>
        {activePanel === TabPanel.FILL && <FillPanel />}
        {activePanel === TabPanel.CREATE && <CreatePanel />}
        {activePanel === TabPanel.HELP && <HelpPanel />}
      </div>
    </div>
  );
};

export default App;
