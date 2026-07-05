import { useEffect } from "react";

export function useScreenStage(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const panels = [...document.querySelectorAll(".screen-stack > .section-band")];
    if (!panels.length) return undefined;

    const setCurrentPanel = (panel) => {
      panels.forEach((item) => {
        item.classList.toggle("is-current-screen", item === panel);
      });
    };

    setCurrentPanel(panels[0]);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target) {
          setCurrentPanel(visible.target);
        }
      },
      {
        rootMargin: "-22% 0px -38% 0px",
        threshold: [0.2, 0.36, 0.52, 0.68],
      },
    );

    panels.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, [enabled]);
}

