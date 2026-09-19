import {
  AriaLiveAnnouncer,
  Button,
  type InputOnChangeData,
  List,
  ListItem,
  makeStyles,
  mergeClasses,
  SearchBox,
  type SearchBoxChangeEvent,
  Spinner,
  tokens,
  useId,
  useTypingAnnounce,
} from '@fluentui/react-components';
import { PersonSquareAddRegular } from '@fluentui/react-icons';
import * as React from 'react';

import { ClientApiService } from '../../services/api/ClientApiService';
import { ClientDataService } from '../../services/word/ClientDataService';
import { type Client, ClientType } from '../../types/Client';
import type { TaggedControl } from '../../types/TaggedControl';

const DEBOUNCE_MS = 300;

const useStyles = makeStyles({
  root: {
    position: 'relative',
    maxWidth: '400px',
  },
  searchBox: {
    width: '100%',
  },
  listBox: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    boxSizing: 'border-box',
    listStyleType: 'none',
    margin: 0,
    padding: `${tokens.spacingVerticalXS} 0`,
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  listBoxHidden: {
    display: 'none',
  },
  option: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  optionFocused: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    outline: 'none',
  },
  spinnerWrapper: {
    alignItems: 'center',
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    color: tokens.colorNeutralForeground3,
  },
  noResults: {
    color: tokens.colorNeutralForeground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
  },
  clientPreviewList: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: '1rem',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalS,
  },
  clientPreviewListItem: {
    display: 'grid',
    gridColumn: '1 / -1',
    gridTemplateColumns: 'subgrid',
  },
});

const ClientSearch: React.FC<{ controls: TaggedControl[] }> = ({ controls }) => {
  const styles = useStyles();

  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [hideActiveDescendant, setHideActiveDescendant] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedResult, setSelectedResult] = React.useState<Client | null>(null);

  const listBoxId = useId();
  const announceId = useId('typeahead');
  const { typingAnnounce, inputRef } = useTypingAnnounce<HTMLInputElement>();
  const optionRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const cancelRef = React.useRef<(() => void) | null>(null);

  // Debounced search when query changes
  React.useEffect(() => {
    if (!query) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    setIsOpen(true);
    setFocusedIndex(-1);

    const debounceTimer = setTimeout(() => {
      let cancelled = false;
      ClientApiService.search(query).then(data => {
        if (!cancelled) {
          setResults(data);
          optionRefs.current = new Array(data.length).fill(null);
          setIsLoading(false);
        }
      });

      // Store cancel in the ref so the cleanup can access it
      cancelRef.current = () => {
        cancelled = true;
      };
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, [query]);

  React.useEffect(() => {
    if (!isOpen || isLoading) {
      return;
    }

    if (results.length > 0) {
      typingAnnounce(`${results.length} result${results.length !== 1 ? 's' : ''} available`, {
        batchId: announceId,
      });
    } else if (query.length > 0) {
      typingAnnounce('Aucun résultat trouvé', { batchId: announceId });
    }
  }, [isLoading, isOpen, results.length, query.length, typingAnnounce, announceId]);

  // Keep focused option scrolled into view
  React.useEffect(() => {
    if (focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const handleChange = (_: SearchBoxChangeEvent, data: InputOnChangeData) => {
    setQuery(data.value);
    setSelectedId(null);

    if (!data.value) {
      return;
    }

    // useTypingAnnounce waits until the user pauses typing before announcing,
    // preventing interference with screen reader keyboard echo.
    typingAnnounce('Recherche en cours…', { batchId: announceId });
  };

  const handleSelect = (client: Client) => {
    setSelectedId(client.reference);
    setQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
    setSelectedResult(client);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHideActiveDescendant(false);
      setFocusedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHideActiveDescendant(false);
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setHideActiveDescendant(true);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[focusedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
      setHideActiveDescendant(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    // Close if focus leaves both the input and the listBox
    const relatedTarget = e.relatedTarget as Node | null;
    const listBoxEl = document.getElementById(listBoxId);
    if (!e.currentTarget.contains(relatedTarget) && !listBoxEl?.contains(relatedTarget)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const insertResultData = async () => {
    await ClientDataService.insertClientData(controls, selectedResult);
  };

  const showDropdown = isOpen && (isLoading || results.length > 0);
  const noResults = isOpen && !isLoading && query.length > 0 && results.length === 0;
  const activedescendant =
    focusedIndex >= 0 && !hideActiveDescendant ? `${listBoxId}-option-${focusedIndex}` : undefined;

  return (
    <AriaLiveAnnouncer>
      <div className={styles.root}>
        <SearchBox
          className={styles.searchBox}
          ref={inputRef}
          aria-autocomplete="list"
          aria-controls={listBoxId}
          aria-expanded={showDropdown || noResults}
          aria-activedescendant={activedescendant}
          placeholder="Rechercher un client..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          root={{ onBlur: handleBlur }}
        />

        <ul
          id={listBoxId}
          role="listbox"
          aria-label="Résultats de recherche"
          className={mergeClasses(
            styles.listBox,
            !showDropdown && !noResults && styles.listBoxHidden
          )}
        >
          {isLoading ? (
            <li className={styles.spinnerWrapper}>
              <Spinner size="tiny" label="Chargement des résultats..." labelPosition="after" />
            </li>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <li
                key={result.reference}
                id={`${listBoxId}-option-${index}`}
                ref={el => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={selectedId === result.reference}
                className={mergeClasses(
                  styles.option,
                  focusedIndex === index && styles.optionFocused
                )}
                onMouseDown={e => {
                  // Prevent input blur before click registers
                  e.preventDefault();
                }}
                onClick={() => handleSelect(result)}
              >
                {result.type === ClientType.PROFESSIONAL ? result.company : result.lastName}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>Aucun résultat trouvé</li>
          )}
        </ul>
      </div>

      {selectedResult && (
        <>
          <List className={styles.clientPreviewList}>
            <ListItem className={styles.clientPreviewListItem}>
              Référence : <strong>{selectedResult.reference}</strong>
            </ListItem>
            {selectedResult.type === ClientType.PROFESSIONAL && (
              <>
                <ListItem className={styles.clientPreviewListItem}>
                  Nom de l'entreprise : <strong>{selectedResult.company}</strong>
                </ListItem>
                {selectedResult.siret && (
                  <ListItem className={styles.clientPreviewListItem}>
                    SIRET : <strong>{selectedResult.siret}</strong>
                  </ListItem>
                )}
              </>
            )}
            {selectedResult.firstName && (
              <ListItem className={styles.clientPreviewListItem}>
                Prénom : <strong>{selectedResult.firstName}</strong>
              </ListItem>
            )}
            {selectedResult.lastName && (
              <ListItem className={styles.clientPreviewListItem}>
                Nom : <strong>{selectedResult.lastName}</strong>
              </ListItem>
            )}
            {selectedResult.email && (
              <ListItem className={styles.clientPreviewListItem}>
                Email : <strong>{selectedResult.email}</strong>
              </ListItem>
            )}
            {selectedResult.phone && (
              <ListItem className={styles.clientPreviewListItem}>
                Téléphone : <strong>{selectedResult.phone}</strong>
              </ListItem>
            )}
            {selectedResult.address && (
              <ListItem className={styles.clientPreviewListItem}>
                Adresse : <strong>{selectedResult.address}</strong>
              </ListItem>
            )}
            {selectedResult.cp && (
              <ListItem className={styles.clientPreviewListItem}>
                Code Postal : <strong>{selectedResult.cp}</strong>
              </ListItem>
            )}
            {selectedResult.city && (
              <ListItem className={styles.clientPreviewListItem}>
                Ville : <strong>{selectedResult.city}</strong>
              </ListItem>
            )}
            {selectedResult.note && (
              <ListItem className={styles.clientPreviewListItem}>
                Note : <strong>{selectedResult.note}</strong>
              </ListItem>
            )}
            {selectedResult.accountantId && (
              <ListItem className={styles.clientPreviewListItem}>
                Compte Comptable : <strong>{selectedResult.accountantId}</strong>
              </ListItem>
            )}
          </List>

          <Button appearance="primary" icon={<PersonSquareAddRegular />} onClick={insertResultData}>
            Insérer les données client
          </Button>
        </>
      )}
    </AriaLiveAnnouncer>
  );
};

export default ClientSearch;
