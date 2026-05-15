"use client";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
}

export default function CodeEditor({ value, onChange, onRun }: CodeEditorProps) {
  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) {
    // Cmd+Enter / Ctrl+Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);

    // Focus editor on mount
    editor.focus();
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="go"
      value={value}
      onChange={onChange}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'GeistMono', 'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "line",
        tabSize: 4,
        insertSpaces: false,
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        bracketPairColorization: { enabled: true },
        formatOnPaste: true,
        suggestOnTriggerCharacters: true,
      }}
    />
  );
}