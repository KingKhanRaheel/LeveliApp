import { useEffect } from "react";
import { themes, applyTheme } from "@/lib/themes";

export function useTheme() {
  useEffect(() => {
    const savedThemeId = localStorage.getItem("selected_theme") || "default";
    const theme = themes.find(t => t.id === savedThemeId);
    
    if (theme) {
      const isDark = document.documentElement.classList.contains("dark");
      applyTheme(theme, isDark);
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const savedThemeId = localStorage.getItem("selected_theme") || "default";
          const theme = themes.find(t => t.id === savedThemeId);
          
          if (theme) {
            const isDark = document.documentElement.classList.contains("dark");
            applyTheme(theme, isDark);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
}
