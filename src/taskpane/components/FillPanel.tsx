import {
  Button,
  Divider,
  InteractionTag,
  InteractionTagPrimary,
  Label,
  List,
  ListItem,
  makeStyles,
  SearchBox,
  Select,
  TagGroup,
  Text,
  tokens,
} from '@fluentui/react-components';
import { ArrowSyncRegular } from '@fluentui/react-icons';
import * as React from "react";
import { getRichTextTaggedControls, groupByTag, type TaggedControl } from '../taskpane';
import ClientSearch from './ClientSearch';

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontStyle: "italic",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }
});

const FillPanel: React.FC = () => {
  const styles = useStyles();

  const [groups, setGroups] = React.useState<Record<string, TaggedControl[]>>({});

  const handleRefresh = async () => {
    const controls = await getRichTextTaggedControls();
    setGroups(groupByTag(controls));
  }

  const scrollToContentControl = async (id: number) => {
    await Word.run(async (context) => {
      const cc = context.document.contentControls.getById(id);
      cc.select(); // selects the control's content AND scrolls it into view
      await context.sync();
    });
  };

  React.useEffect(() => {
    getRichTextTaggedControls().then(controls => setGroups(groupByTag(controls)));
  }, []);

  return (
    <div role="tabpanel" aria-labelledby="fill-panel-label" className={styles.root}>
      <Text className={styles.description}>Remplir les zones intéractives.</Text>

      <Button onClick={handleRefresh} icon={<ArrowSyncRegular />}>Mettre à jour la liste</Button>

      <List className={styles.list}>
        {Object.entries(groups).map(([tag, controls]) => (
          <ListItem key={tag} className={styles.listItem}>
            <Divider />

            <Text weight="bold" size={400}>{tag}</Text>

            <TagGroup size="extra-small">
              {controls.map((control, index) => (
                <InteractionTag key={control.id}>
                  <InteractionTagPrimary onClick={() => scrollToContentControl(control.id)}>
                    Voir #{index + 1}
                  </InteractionTagPrimary>
                </InteractionTag>
              ))}
            </TagGroup>

            <ClientSearch tag={tag} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default FillPanel
