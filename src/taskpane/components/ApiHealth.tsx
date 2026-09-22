import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { CircleFilled } from '@fluentui/react-icons';
import React from 'react';
import { useInterval } from '../../hooks/useInterval';
import { ClientApiService } from '../../services/api/ClientApiService';

interface BridgeStatus {
  isHealthy: boolean;
  lastSyncDate: Date | null;
}

const useStyles = makeStyles({
  healthOk: {
    color: tokens.colorPaletteGreenForeground1,
  },
  healthError: {
    color: tokens.colorPaletteRedForeground1,
  },
  apiMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontColor: tokens.colorNeutralForeground3,
  },
});

const ApiHealth: React.FC = () => {
  const styles = useStyles();

  const [status, setStatus] = React.useState<BridgeStatus>({
    isHealthy: false,
    lastSyncDate: null,
  });

  useInterval(async () => {
    try {
      const isHealthy = await ClientApiService.isHealthy();
      const lastSyncDate = await ClientApiService.getLastSyncDate();
      setStatus({ isHealthy, lastSyncDate });
    } catch {
      setStatus({ isHealthy: false, lastSyncDate: null });
    }
  }, 60_000);

  return (
    <Text className={styles.apiMessage} size={200} italic as="p">
      {status.isHealthy ? (
        <>
          <CircleFilled className={styles.healthOk} />
          {status.lastSyncDate
            ? `CRM synchronisé le : ${status.lastSyncDate.toLocaleString()}`
            : 'Synchronisez le CRM maintenant'}
        </>
      ) : (
        <>
          <CircleFilled className={styles.healthError} />
          Erreur de connexion
        </>
      )}
    </Text>
  );
};

export default ApiHealth;
