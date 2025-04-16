// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  SuiClient,
  SuiHTTPTransport,
  getFullnodeUrl,
} from '@mysten/sui.js/client';

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
  if (existingClient) return existingClient;

  // Handle both enum values and direct URL strings
  const networkUrl =
    network in Network
      ? config?.url || NetworkConfigs[network as Network].url
      : network;

  // Configure transport options
  const transportOptions: any = { url: networkUrl };

  // Access environment variables through Vite's import.meta.env
  const username = import.meta.env?.VITE_SUI_RPC_USERNAME;
  const password = import.meta.env?.VITE_SUI_RPC_PASSWORD;

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
