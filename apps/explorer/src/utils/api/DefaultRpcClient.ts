// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  SuiClient,
  SuiHTTPTransport,
  getFullnodeUrl,
} from '@mysten/sui.js/client';
import { useAuth } from '../../contexts/AuthContext';

export enum Network {
  LOCAL = 'LOCAL',
  DEVNET = 'DEVNET',
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

export const NetworkConfigs: Record<Network, { url: string }> = {
  [Network.LOCAL]: { url: getFullnodeUrl('localnet') },
  [Network.DEVNET]: { url: getFullnodeUrl('devnet') },
  [Network.TESTNET]: { url: getFullnodeUrl('testnet') },
  [Network.MAINNET]: { url: getFullnodeUrl('mainnet') },
};

// Authentication is handled internally via environment variables
const defaultClientMap: Map<Network | string, SuiClient> = new Map();

// NOTE: This class should not be used directly in React components, prefer to use the useSuiClient() hook instead
export const createSuiClient = (
  network: Network | string,
  config?: { url: string }
) => {
  const existingClient = defaultClientMap.get(network);
  const { credentials } = useAuth();

  if (existingClient) return existingClient;

  // Handle both enum values and direct URL strings
  let networkUrl =
    network in Network
      ? config?.url || NetworkConfigs[network as Network].url
      : network;

  // Configure transport options
  const transportOptions: any = { url: networkUrl };

  // Check if URL contains embedded credentials
  let username, password;

  // Use provided credentials if available
  if (credentials?.username && credentials?.password) {
    username = credentials.username;
    password = credentials.password;
  }

  // Add basic auth headers if credentials are found
  if (username && password) {
    const base64Credentials = btoa(`${username}:${password}`);
    transportOptions.rpc = {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    };
  }

  const client = new SuiClient({
    transport: new SuiHTTPTransport(transportOptions),
  });

  defaultClientMap.set(network, client);
  return client;
};
