// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { LinkWithQuery } from '~/ui/utils/LinkWithQuery';
import NetworkSelect from '../network/Network';
import Search from '../search/Search';
import { useAuth } from '~/contexts/AuthContext'; // Import the auth hook

function Header() {
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 0);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const callback = () => {
      setIsScrolled(window.scrollY > 0);
    };
    document.addEventListener('scroll', callback, { passive: true });
    return () => {
      document.removeEventListener('scroll', callback);
    };
  }, []);

  return (
    <header
      className={clsx(
        'flex h-header justify-center overflow-visible bg-white/40 backdrop-blur-xl transition-shadow',
        isScrolled && 'shadow-effect-ui-regular'
      )}
    >
      <div className="flex h-full max-w-[1440px] flex-1 items-center gap-5 px-5 2xl:p-0">
        <LinkWithQuery
          data-testid="nav-logo-button"
          to="/"
          className="flex flex-nowrap items-center gap-1 text-hero-darkest text-nowrap"
        >
          Talus Devnet Sui Explorer
        </LinkWithQuery>
        <div className="flex w-full gap-2 items-center">
          <div className="flex-1">
            <Search />
          </div>
          <NetworkSelect />
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-4 h-10 rounded border border-transparent bg-hero-darkest/5 px-4 font-mono text-body font-medium leading-9 text-hero-darkest/80 transition hover:bg-hero-darkest/10 focus:bg-hero-darkest/10"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
