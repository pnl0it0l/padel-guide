"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import LoginButton from "./LoginButton";

interface HeaderProps {
  showCreateTournament?: boolean;
}

export default function Header({ showCreateTournament = false }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive(path)
        ? "text-white bg-blue-600/20 border border-blue-500/30"
        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
    }`;

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-700/50 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
              <svg
                className="w-9 h-9 text-blue-400 relative z-10 group-hover:text-blue-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                Padel Guide
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Portugal
              </p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            <Link href="/#fpp" className={navLinkClass("/#fpp")}>
              FPP
            </Link>
            <Link href="/#reservas" className={navLinkClass("/#reservas")}>
              Reservas
            </Link>
            <Link href="/#treino" className={navLinkClass("/#treino")}>
              Treino
            </Link>
            <Link href="/tournaments" className={navLinkClass("/tournaments")}>
              Torneios
            </Link>
            <Link href="/#comunidade" className={navLinkClass("/#comunidade")}>
              Comunidade
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Create Tournament Button (conditional) */}
            {showCreateTournament && (
              <Link
                href="/tournaments/create"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Criar Torneio
              </Link>
            )}

            {/* Login Button */}
            <LoginButton />

            {/* Mobile menu button placeholder */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
