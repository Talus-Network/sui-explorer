// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SocialDiscord24, SocialTwitter24 } from '@mysten/icons';
import { type ReactNode } from 'react';

type FooterItem = {
  category: string;
  items: { title: string; children: ReactNode; href: string }[];
};
export type FooterItems = FooterItem[];

function FooterIcon({ children }: { children: ReactNode }) {
  return <div className="flex items-center text-steel-darker">{children}</div>;
}

export const footerLogoLink = {
  title: 'taluslabs',
  href: 'https://talus.network/',
};

export const footerLinks = [
  {
    title: 'GitHub',
    href: 'https://github.com/Talus-Network',
  },
];

export const socialLinks = [
  {
    children: (
      <FooterIcon>
        <SocialDiscord24 />
      </FooterIcon>
    ),
    href: 'https://discord.com/invite/talusnetwork',
  },
  {
    children: (
      <FooterIcon>
        <SocialTwitter24 />
      </FooterIcon>
    ),
    href: 'https://x.com/TalusNetwork',
  },
];

export const legalLinks = [];
