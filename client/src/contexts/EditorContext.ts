import React, { createContext } from "react";
import { EditorState, EditorAction } from "@/types/editor";

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);
