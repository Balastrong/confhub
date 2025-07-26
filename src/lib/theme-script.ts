export const themeScript = (function () {
  function themeFn() {
    try {
      const theme = localStorage.getItem("confhub-theme") || "system"
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          matchMedia("(prefers-color-scheme: dark)").matches)
      if (isDark) document.documentElement.classList.add("dark")
    } catch (e) {}
  }
  return `(${themeFn.toString()})();`
})()
