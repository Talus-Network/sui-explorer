// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useSearchParams } from 'react-router-dom';

import { Network } from './utils/api/DefaultRpcClient';
import { queryClient } from './utils/queryClient';
import { useAuth } from './contexts/AuthContext';

// See also /apps/explorer/public/env-config.js
// See also /docker-entrypoint.sh
// See also /apps/explorer/src/types/env.d.ts
export const DEFAULT_NETWORK = window.__ENV__?.SUI_RPC_URL || '';
export const NetworkContext = createContext<
  [Network | string, (network: Network | string) => void]
>(['', () => null]);

export function useNetworkContext() {
  return useContext(NetworkContext);
}

// TODO: Remove this flexibility.
export function useNetwork(): [string, (network: Network | string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const { credentials } = useAuth();

  const network = useMemo(() => {
    const networkParam = searchParams.get('network');
    if (
      networkParam &&
      (Object.values(Network) as string[]).includes(networkParam.toUpperCase())
    ) {
      return networkParam.toUpperCase();
    }
    return networkParam ?? DEFAULT_NETWORK;
  }, [searchParams]);

  const setNetwork = (network: Network | string) => {
    // When resetting the network, we reset the query client at the same time:
    queryClient.cancelQueries();
    queryClient.clear();
    // Apply credentials to URLs if available
    if (typeof network === 'string' && network.includes('://') && credentials) {
      try {
        const url = new URL(network);
        // Only set credentials if not already present in the URL
        if (!url.username && !url.password) {
          url.username = credentials.username;
          url.password = credentials.password;
          setSearchParams({ network: url.toString() });
          return;
        }
      } catch (e) {
        // Invalid URL, fall through to default behavior
      }
    }

    // Handle URLs with auth credentials without lowercasing
    if (typeof network === 'string' && network.includes('://')) {
      try {
        const url = new URL(network);
        if (url.username || url.password) {
          setSearchParams({ network });
          return;
        }
      } catch (e) {
        // Invalid URL, fall through to default behavior
      }
    }

    setSearchParams({ network: network.toLowerCase() });
  };

  return [network, setNetwork];
}
