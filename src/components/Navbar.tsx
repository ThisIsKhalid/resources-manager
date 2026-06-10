"use client";

import { HtmlFile } from "@/lib/resources";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronRight,
  FiFileText,
  FiFolder,
  FiGrid,
  FiMenu,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";

const CATEGORY_EMOJI: Record<string, string> = {
  ai: "🤖",
  "c++": "⚙️",
  go: "🐹",
  interview: "💼",
  "system design": "🏗️",
  uncategorized: "📁",
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category.toLowerCase()] || "📄";
}

export default function Navbar({ files }: { files: HtmlFile[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("html-renderer-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(path);
      const next = isFav ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem("html-renderer-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        f.category.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q),
    );
  }, [files, searchQuery]);

  const groupedFiles = useMemo(() => {
    const groups: Record<string, HtmlFile[]> = {};
    const favGroup: HtmlFile[] = [];

    filteredFiles.forEach((f) => {
      if (favorites.includes(f.path)) favGroup.push(f);
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });

    return { groups, favGroup };
  }, [filteredFiles, favorites]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* ── Top Bar ── */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-50">
        <div className="absolute inset-0 bg-[#061E29]/70 backdrop-blur-2xl border-b border-[#1D546D]/40" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D546D] to-[#5F9598] flex items-center justify-center shadow-lg shadow-[#1D546D]/30 group-hover:shadow-[#5F9598]/30 transition-shadow">
              <FiFolder className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              Resources<span className="text-[#5F9598]">.</span>
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <FiGrid className="text-base" />
              Home
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1D546D] to-[#5F9598] hover:from-[#5F9598] hover:to-[#1D546D] transition-all shadow-lg shadow-[#1D546D]/25 active:scale-[0.97]"
            >
              <FiSearch className="text-base" />
              Browse All
              <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {files.length}
              </span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-[#1D546D]/40 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            aria-label="Open menu"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>
      </nav>

      {/* ── Overlay ── */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          isDrawerOpen
            ? "bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* ── Slide-in Drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] md:w-[480px] bg-[#061E29]/95 backdrop-blur-2xl border-l border-[#1D546D]/40 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 p-5 border-b border-[#1D546D]/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D546D] to-[#5F9598] flex items-center justify-center">
                <FiFolder className="text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                All Resources
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-[#1D546D]/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              aria-label="Close menu"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F9598] text-sm" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isDrawerOpen}
              className="w-full bg-white/5 border border-[#1D546D]/40 focus:border-[#5F9598]/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-8 custom-scrollbar">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-3">
              <FiSearch className="text-5xl opacity-30 text-[#5F9598]" />
              <p className="text-sm">No resources found</p>
            </div>
          ) : (
            <>
              {/* Favorites */}
              {groupedFiles.favGroup.length > 0 && !searchQuery && (
                <DrawerSection
                  title="Favorites"
                  emoji="⭐"
                  files={groupedFiles.favGroup}
                  favorites={favorites}
                  onToggleFav={toggleFavorite}
                  onSelect={() => setIsDrawerOpen(false)}
                />
              )}

              {/* Categories */}
              {Object.entries(groupedFiles.groups)
                .sort()
                .map(([category, catFiles]) => (
                  <DrawerSection
                    key={category}
                    title={category}
                    emoji={getCategoryEmoji(category)}
                    files={catFiles}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                    onSelect={() => setIsDrawerOpen(false)}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Drawer Section ── */
function DrawerSection({
  title,
  emoji,
  files,
  favorites,
  onToggleFav,
  onSelect,
}: {
  title: string;
  emoji: string;
  files: HtmlFile[];
  favorites: string[];
  onToggleFav: (e: React.MouseEvent, path: string) => void;
  onSelect: () => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest font-bold text-[#5F9598] flex items-center gap-2">
        <span>{emoji}</span> {title}
        <span className="text-[10px] bg-[#1D546D]/30 text-[#5F9598]/80 px-1.5 py-0.5 rounded-full font-mono">
          {files.length}
        </span>
      </h3>
      <div className="space-y-2">
        {files.map((file) => (
          <DrawerCard
            key={file.path}
            file={file}
            isFavorite={favorites.includes(file.path)}
            onToggleFav={onToggleFav}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Drawer Card ── */
function DrawerCard({
  file,
  isFavorite,
  onToggleFav,
  onClick,
}: {
  file: HtmlFile;
  isFavorite: boolean;
  onToggleFav: (e: React.MouseEvent, path: string) => void;
  onClick: () => void;
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      onClick={onClick}
      className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-[#1D546D]/60 transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-[#1D546D]/25 flex items-center justify-center text-[#5F9598] shrink-0 group-hover:bg-[#1D546D]/40 transition-colors">
        <FiFileText className="text-base" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-200 truncate capitalize group-hover:text-white transition-colors">
          {file.title}
        </p>
        {file.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {file.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => onToggleFav(e, file.path)}
          className={`p-1.5 rounded-lg transition-colors ${
            isFavorite
              ? "text-yellow-400 hover:bg-yellow-400/10"
              : "text-gray-600 opacity-0 group-hover:opacity-100 hover:text-yellow-400 hover:bg-yellow-400/10"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FiStar className={`text-sm ${isFavorite ? "fill-current" : ""}`} />
        </button>
        <FiChevronRight className="text-gray-600 group-hover:text-[#5F9598] transition-colors" />
      </div>
    </Link>
  );
}
