'use client';

// Top navigation — links, auth state, mobile menu, admin entry for ADMIN role.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, User, LogOut, Briefcase, Bookmark, Bell, Shield, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { env } from '@/config/runtime';
import { useAuthStore } from '@/store/authStore';

type NavLink = { href: string; label: string; auth?: boolean };

const NAV_LINKS: NavLink[] = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/search', label: 'Search' },
  { href: '/saved', label: 'Saved', auth: true },
  { href: '/alerts', label: 'Alerts', auth: true },
];

/** Site header with primary nav and auth-aware actions. */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, status, logout } = useAuthStore();
  const isAuthed = status === 'authed' && user !== null;
  const isGuest = !isAuthed;

  const visibleLinks = NAV_LINKS.filter((link) => !link.auth || isAuthed);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    setMobileOpen(false);
  };

  const signInHref =
    pathname && pathname !== '/login'
      ? `/login?next=${encodeURIComponent(pathname)}`
      : '/login';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold text-primary">
          {env.appName}
        </Link>

        {/* Desktop nav — center area */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side — always pinned to the end */}
        <div className="ml-auto flex items-center gap-2">
          {isAuthed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
                  <User className="size-4" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/jobs/applied" className="cursor-pointer">
                    <Briefcase className="mr-2 size-4" />
                    Applied
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved" className="cursor-pointer">
                    <Bookmark className="mr-2 size-4" />
                    Saved
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/alerts" className="cursor-pointer">
                    <Bell className="mr-2 size-4" />
                    Alerts
                  </Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Shield className="mr-2 size-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isGuest ? (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href={signInHref}>Sign in</Link>
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/register">Register</Link>
              </Button>
              {/* Compact sign-in on small screens (visible next to menu icon) */}
              <Button size="sm" className="sm:hidden" asChild>
                <Link href={signInHref}>
                  <LogIn className="size-4" />
                  Sign in
                </Link>
              </Button>
            </>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="border-t px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium',
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              {isAuthed ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/jobs/applied"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm"
                  >
                    Applied
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm"
                    >
                      Admin
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : isGuest ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={signInHref} onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
