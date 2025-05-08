// src/App.jsx - Responsive version with improved mobile header
import { useState, useRef, useEffect } from "react";
import RichEditor from "./components/RichEditor";
import { Button } from "./components/ui/button";
import { exportToPDF } from "./lib/export-to-pdf";
import { FaSave, FaPalette } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { cn } from "./lib/utils";
import {
  saveDocumentToLocalStorage,
  loadDocumentFromLocalStorage,
  setupAutoSave,
  stopAutoSave,
} from "./lib/storage";

// Available themes
const THEMES = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "desert", label: "Desert" },
];

function App() {
  const initial = loadDocumentFromLocalStorage();
  const [content, setContent] = useState(initial.content);
  const [codeTheme, setCodeTheme] = useState(initial.codeTheme);
  const [documentTitle, setDocumentTitle] = useState(initial.title);
  const [lastSaved, setLastSaved] = useState(initial.lastModified);
  const [isSaving, setIsSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [screenSize, setScreenSize] = useState("large"); // "small", "medium", or "large"

  const [theme, setTheme] = useState(
    () => localStorage.getItem("coddoc-theme") || "light"
  );
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const autoSaveRef = useRef(null);
  const themeMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("small");
      } else if (width < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto‐save every 5 seconds
  useEffect(() => {
    autoSaveRef.current = setupAutoSave(
      { id: "default", title: documentTitle, content, codeTheme },
      5000
    );
    return () => stopAutoSave(autoSaveRef.current);
  }, [content, documentTitle, codeTheme]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "desert");
    document.documentElement.classList.add(theme);
    localStorage.setItem("coddoc-theme", theme);
  }, [theme]);

  // Close theme menu
  useEffect(() => {
    const onClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Manual save
  const handleSave = () => {
    setIsSaving(true);
    const ok = saveDocumentToLocalStorage({
      id: "default",
      title: documentTitle,
      content,
      codeTheme,
    });
    if (ok) setLastSaved(new Date().toISOString());
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Export PDF
  const handleExport = async () => {
    setExporting(true);
    try {
      const editorEl = document.querySelector(".ProseMirror");
      if (!editorEl) throw new Error("Editor content not found");
      await exportToPDF(editorEl, {
        title: documentTitle || "codDoc Document",
        author: "codDoc User",
        includeToolbar: false,
        includeUI: false,
        margin: 15,
        quality: 2,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Responsive Header with editor-pane class preserved */}
      <header className="editor-pane border-b border-gray-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-800 shadow-sm relative">
        {/* Small Screen Layout (Mobile) */}
        {screenSize === "small" ? (
          <div className="flex flex-col space-y-3">
            {/* Top Row: Logo and Actions */}
            <div className="flex items-center justify-between">
              <img
                src="./codDocLogo.png"
                alt="codDoc Logo"
                className="h-14 w-26"
              />

              <div className="flex items-center gap-2">
                {/* Save Status */}
                {lastSaved && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isSaving ? "Saving..." : "✓"}
                  </div>
                )}

                {/* Save Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full text-primary"
                  onClick={handleSave}
                  title="Save document"
                >
                  <FaSave size={14} />
                </Button>

                {/* Mobile Menu - Using palette icon instead of 3-dots */}
                <div ref={mobileMenuRef} className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <BsThreeDotsVertical />
                  </Button>

                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-[1150]">
                      {" "}
                      {/* Theme Options */}
                      <div className="p-2 border-b border-gray-200 dark:border-zinc-700">
                        <div className="text-sm font-medium mb-1">Theme</div>
                        {THEMES.map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => {
                              setTheme(key);
                              setMobileMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-3 py-1.5 text-left text-sm rounded-md",
                              theme === key
                                ? "bg-gray-100 dark:bg-zinc-700 font-medium"
                                : "hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {/* Export Button */}
                      <div className="p-2">
                        <Button
                          onClick={() => {
                            handleExport();
                            setMobileMenuOpen(false);
                          }}
                          disabled={exporting}
                          className="w-full bg-primary hover:bg-primary/90 py-1.5 h-auto text-sm"
                        >
                          {exporting ? "Exporting..." : "Export to PDF"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Title Input */}
            <div className="w-full">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Document name"
                className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              />
            </div>
          </div>
        ) : screenSize === "medium" ? (
          /* Medium Screen Layout (Tablet/Small Desktop) */
          <div className="container mx-auto">
            <div className="flex flex-col space-y-3">
              {/* Top row with logo and controls */}
              <div className="flex items-center justify-between">
                <img
                  src="./codDocLogo.png"
                  alt="codDoc Logo"
                  className="h-9 w-auto"
                />

                <div className="flex items-center gap-2">
                  {/* Save Status - more compact */}
                  {lastSaved && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      {isSaving
                        ? "Saving..."
                        : `Saved: ${formatTime(lastSaved)
                            .split(":")
                            .slice(0, 2)
                            .join(":")}`}
                    </div>
                  )}

                  {/* Save Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-primary"
                    onClick={handleSave}
                    title="Save document"
                  >
                    <FaSave size={16} />
                  </Button>

                  {/* Theme Menu */}
                  <div ref={themeMenuRef} className="relative">
                    <button
                      onClick={() => setThemeMenuOpen((o) => !o)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                      title="Change theme"
                    >
                      <FaPalette size={16} />
                    </button>

                    {themeMenuOpen && (
                      <div className="absolute right-0 mt-2 w-36 z-[1200] bg-white text-gray-900 dark:bg-zinc-800 dark:text-gray-100 border border-gray-200 dark:border-zinc-700 rounded shadow-lg">
                        {" "}
                        {/* Added higher z-index */}
                        {THEMES.map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => {
                              setTheme(key);
                              setThemeMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700",
                              theme === key &&
                                "font-semibold bg-gray-100 dark:bg-zinc-700"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Export Button */}
                  <Button
                    onClick={handleExport}
                    disabled={exporting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {exporting ? "Exporting..." : "Export to PDF"}
                  </Button>
                </div>
              </div>

              {/* Document Title Input */}
              <div className="w-full">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Document name"
                  className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Large Screen Layout (Desktop) */
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo on the left */}
            <img
              src="./codDocLogo.png"
              alt="codDoc Logo"
              className="w-18 h-14 scale-[1.5]"
            />

            {/* Title input absolutely centered */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
              <div className="w-full max-w-lg mx-auto px-4">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Document name"
                  className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Controls on the right */}
            <div className="flex items-center gap-2">
              {lastSaved && (
                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {isSaving ? "Saving..." : `Saved at ${formatTime(lastSaved)}`}
                </div>
              )}

              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-primary"
                onClick={handleSave}
                title="Save document"
              >
                <FaSave size={16} />
              </Button>

              <div ref={themeMenuRef} className="relative">
                <button
                  onClick={() => setThemeMenuOpen((o) => !o)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                  title="Change theme"
                >
                  <FaPalette size={16} />
                </button>
                {themeMenuOpen && (
                  <div
                    className="
                    absolute right-0 mt-2 w-36 z-[1200]
                    bg-white text-gray-900
                    dark:bg-zinc-800 dark:text-gray-100
                    border border-gray-200 dark:border-zinc-700
                    rounded shadow-lg
                  "
                  >
                    {" "}
                    {/* Added higher z-index */}
                    {THEMES.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setTheme(key);
                          setThemeMenuOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700",
                          theme === key &&
                            "font-semibold bg-gray-100 dark:bg-zinc-700"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleExport}
                disabled={exporting}
                className="bg-primary hover:bg-primary/90"
              >
                {exporting ? "Exporting..." : "Export to PDF"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-auto">
        <div
          className={cn(
            "mx-auto p-6",
            screenSize === "small" ? "w-full" : "container"
          )}
        >
          <RichEditor
            content={content}
            onChange={setContent}
            placeholder="Start typing here or add a code block…"
            codeTheme={codeTheme}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 p-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} codDoc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
