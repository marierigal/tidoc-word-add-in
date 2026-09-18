import {
  Button,
  Divider,
  InteractionTag,
  InteractionTagPrimary,
  Label,
  List,
  ListItem,
  makeStyles,
  TagGroup,
  Text,
  tokens,
} from '@fluentui/react-components';
import { ArrowSyncRegular, DocumentPdfRegular } from '@fluentui/react-icons';
import * as React from 'react';

import {
  exportToPdf,
  getRichTextTaggedControls,
  groupByTag,
  type GroupedTaggedControls,
  scrollToContentControl,
} from '../taskpane';

import ClientSearch from './ClientSearch';
import ControlContentUpdateInput from './ControlContentUpdateInput';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    paddingBottom: '200px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tagGroup: {
    flexWrap: 'wrap',
    rowGap: tokens.spacingVerticalXS,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    alignItems: 'baseline',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    // Use 2px gap below the label (per the design system)
    gap: '2px',
  },
});

const FillPanel: React.FC = () => {
  const styles = useStyles();

  const [groups, setGroups] = React.useState<GroupedTaggedControls>({});

  const handleRefresh = async () => {
    const controls = await getRichTextTaggedControls();
    setGroups(groupByTag(controls));
  };

  React.useEffect(() => {
    getRichTextTaggedControls().then(controls => setGroups(groupByTag(controls)));
  }, []);

  return (
    <section role="tabpanel" aria-labelledby="fill-panel-label" className={styles.root}>
      <Text className={styles.description}>Remplir les zones interactives.</Text>

      <Button onClick={handleRefresh} icon={<ArrowSyncRegular />}>
        Mettre à jour la liste
      </Button>

      <Button appearance="primary" onClick={exportToPdf} icon={<DocumentPdfRegular />}>
        Exporter en PDF
      </Button>

      <List className={styles.list}>
        {Object.entries(groups).map(([tag, { controls, hasData }]) => (
          <ListItem key={tag} className={styles.listItem}>
            <Divider />

            {hasData ? (
              <>
                <Text weight="bold" size={400}>
                  {tag}
                </Text>

                <div className={styles.flexRow}>
                  <TagGroup size="extra-small" appearance="brand" className={styles.tagGroup}>
                    <Text wrap={false}>Aller à :</Text>

                    {controls.map((control, index) => (
                      <InteractionTag key={control.id}>
                        <InteractionTagPrimary onClick={() => scrollToContentControl(control.id)}>
                          <Text>#{index + 1}</Text>
                        </InteractionTagPrimary>
                      </InteractionTag>
                    ))}
                  </TagGroup>
                </div>

                <ClientSearch controls={controls} />
              </>
            ) : (
              controls.map(control => (
                <div className={styles.listItem} key={control.id}>
                  <div className={styles.flexRow}>
                    <Text weight="bold" size={400}>
                      {tag}
                    </Text>

                    <InteractionTag size="small" appearance="brand">
                      <InteractionTagPrimary onClick={() => scrollToContentControl(control.id)}>
                        <Text wrap={false}>Aller à</Text>
                      </InteractionTagPrimary>
                    </InteractionTag>
                  </div>

                  <div className={styles.inputGroup}>
                    <Label>Remplir le contenu de la zone</Label>
                    <ControlContentUpdateInput controlId={control.id} />
                  </div>
                </div>
              ))
            )}
          </ListItem>
        ))}
      </List>
    </section>
  );
};

export default FillPanel;
