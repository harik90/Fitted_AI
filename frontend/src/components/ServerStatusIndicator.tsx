import React, { useState, useEffect, useCallback } from 'react';
import { checkServerHealth } from '../lib/api';
import { RefreshCwIcon, ServerIcon } from './Icons';
import type { Translations } from '../lib/i18n';

interface ServerStatusProps {
  t: Translations;
  isDark?: boolean;
}

export const ServerStatusIndicator: React.FC<ServerStatusProps> = ({ t }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsRefreshing(true);
    const isUp = await checkServerHealth(4000);
    setStatus(isUp ? 'online' : 'offline');
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 45000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="server-status-wrap">
      <div className={`server-status-pill status-${status}`}>
        <span className={`status-pulse-dot dot-${status} ${isRefreshing ? 'is-refreshing' : ''}`} />
        <span className="status-pill-text">
          {status === 'checking' && t.serverStatus.checking}
          {status === 'online' && t.serverStatus.online}
          {status === 'offline' && t.serverStatus.offline}
        </span>
        <button
          type="button"
          className={`status-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={checkStatus}
          title={t.serverStatus.recheckBtn}
          aria-label={t.serverStatus.recheckBtn}
        >
          <RefreshCwIcon size={12} />
        </button>
      </div>

      {status === 'offline' && (
        <div className="server-offline-card">
          <div className="server-offline-content">
            <div className="server-offline-icon-box">
              <ServerIcon size={18} color="#f87171" />
            </div>
            <div className="server-offline-info">
              <div className="server-offline-title">{t.serverStatus.offline}</div>
              <p className="server-offline-desc">{t.serverStatus.offlineDesc}</p>
            </div>
          </div>

          <div className="server-offline-actions">
            <button
              type="button"
              className="recheck-server-btn"
              onClick={checkStatus}
              disabled={isRefreshing}
            >
              <RefreshCwIcon size={13} className={isRefreshing ? 'spinning' : ''} />
              <span>{t.serverStatus.recheckBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
