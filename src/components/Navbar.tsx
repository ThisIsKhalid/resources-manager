"use client";

import { HtmlFile } from "@/lib/resources";
import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBookOpen,
  FiChevronRight,
  FiFileText,
  FiMenu,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";

export default function Navbar({ files }: { files: HtmlFile[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        localStorage.getItem("html-renderer-favorites") || "[]",
      );
    } catch {
      return [];
    }
  });

  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return files;

    return files.filter(
      (file) =>
        file.title.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        file.category.toLowerCase().includes(query) ||
        file.path.toLowerCase().includes(query),
    );
  }, [files, searchQuery]);

  const groupedFiles = useMemo(() => {
    return filteredFiles.reduce<Record<string, HtmlFile[]>>((groups, file) => {
      groups[file.category] = groups[file.category] || [];
      groups[file.category].push(file);
      return groups;
    }, {});
  }, [filteredFiles]);

  const toggleFavorite = useCallback((event: React.MouseEvent, path: string) => {
    event.preventDefault();
    event.stopPropagation();

    setFavorites((current) => {
      const next = current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path];
      localStorage.setItem("html-renderer-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    const context = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -18,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
      });
    });

    return () => context.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";

    if (isDrawerOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current.querySelectorAll(".drawer-reveal"),
        { x: 18, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.035,
        },
      );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-[#ded2c0] bg-[#fffaf0]/88 text-[#201a14] backdrop-blur-xl"
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#201a14] text-[#fffaf0]">
              <FiBookOpen />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Resources
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#625647] transition hover:bg-[#f1e7d6]"
            >
              Home
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#201a14] px-4 py-2 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#3a3027]"
            >
              <FiSearch />
              Browse
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                {files.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c9b6] bg-white/65 text-[#201a14] transition hover:border-[#201a14] md:hidden"
            aria-label="Open resource drawer"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 z-[60] bg-[#201a14]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={drawerRef}
        className={`fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-[460px] flex-col border-l border-[#ded2c0] bg-[#fffaf0] shadow-[0_24px_80px_rgba(32,26,20,0.22)] transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="drawer-reveal border-b border-[#ded2c0] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#90724c]">
                Browse shelf
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#201a14]">
                All resources
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c9b6] bg-white text-[#201a14] transition hover:border-[#201a14]"
              aria-label="Close resource drawer"
            >
              <FiX />
            </button>
          </div>

          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d7d69]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search notes"
              autoFocus={isDrawerOpen}
              className="h-12 w-full rounded-full border border-[#d7c9b6] bg-white pl-11 pr-10 text-sm text-[#201a14] outline-none transition placeholder:text-[#a59683] focus:border-[#201a14]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#8d7d69] transition hover:bg-[#f1e7d6] hover:text-[#201a14]"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </label>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-5">
          {filteredFiles.length === 0 ? (
            <div className="drawer-reveal flex h-64 flex-col items-center justify-center rounded-[8px] border border-dashed border-[#d7c9b6] text-center">
              <FiSearch className="mb-3 text-3xl text-[#a59683]" />
              <p className="font-semibold text-[#201a14]">No matches</p>
              <p className="mt-1 text-sm text-[#786a59]">
                Try a different title or category.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedFiles)
                .sort()
                .map(([category, categoryFiles]) => (
                  <section key={category} className="drawer-reveal space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#786a59]">
                        {category}
                      </h3>
                      <span className="rounded-full border border-[#d7c9b6] px-2 py-0.5 text-xs text-[#8d7d69]">
                        {categoryFiles.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {categoryFiles.map((file) => (
                        <DrawerResource
                          key={file.path}
                          file={file}
                          isFavorite={favorites.includes(file.path)}
                          onToggleFavorite={toggleFavorite}
                          onSelect={() => setIsDrawerOpen(false)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function DrawerResource({
  file,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: {
  file: HtmlFile;
  isFavorite: boolean;
  onToggleFavorite: (event: React.MouseEvent, path: string) => void;
  onSelect: () => void;
}) {
  return (
    <Link
      href={`/${file.slug.join("/")}`}
      onClick={onSelect}
      className="group flex items-center gap-3 rounded-[8px] border border-transparent bg-white/65 p-3 transition hover:border-[#d7c9b6] hover:bg-white"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#eadfce] bg-[#fffaf0] text-[#90724c]">
        <FiFileText />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold capitalize text-[#201a14]">
          {file.title}
        </span>
        <span className="block truncate text-xs text-[#8d7d69]">
          {file.description || file.path}
        </span>
      </span>

      <button
        onClick={(event) => onToggleFavorite(event, file.path)}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
          isFavorite
            ? "bg-[#201a14] text-white"
            : "text-[#b1a28d] hover:bg-[#f1e7d6] hover:text-[#201a14]"
        }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FiStar className={isFavorite ? "fill-current" : ""} />
      </button>

      <FiChevronRight className="shrink-0 text-[#b1a28d] transition group-hover:translate-x-0.5 group-hover:text-[#201a14]" />
    </Link>
  );
}
