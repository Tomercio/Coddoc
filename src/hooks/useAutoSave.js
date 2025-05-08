import { useEffect, useRef, useState } from "react";

export function useAutoSave(
  editor,
  { key = "coddoc-drafts", interval = 5000 } = {}
) {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  });
  const timer = useRef();

  const saveNow = () => {
    if (!editor) return;
    const doc = editor.getJSON();
    const timestamp = Date.now();
    const entry = { timestamp, doc };
    const newHist = [entry, ...history].slice(0, 20); // cap at 20
    localStorage.setItem(key, JSON.stringify(newHist));
    setHistory(newHist);
  };

  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(saveNow, interval);
    };
    editor.on("update", handler);
    return () => {
      clearTimeout(timer.current);
      editor.off("update", handler);
    };
  }, [editor, history]);

  const restore = (snapshot) => {
    editor.commands.setContent(snapshot.doc);
  };

  return { history, restore, saveNow };
}
