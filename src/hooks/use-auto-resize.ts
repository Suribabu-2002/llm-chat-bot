"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useAutoResize(
  ref: RefObject<HTMLTextAreaElement | null>,
  maxHeight: number = 160
) {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const handleInput = () => {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    };

    textarea.addEventListener("input", handleInput);
    return () => textarea.removeEventListener("input", handleInput);
  }, [ref, maxHeight]);

  const resize = () => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  };

  return { resize };
}
