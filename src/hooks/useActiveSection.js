import { useEffect, useState } from "react";

export function useActiveSection(sectionOrder, disabled = false) {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    if (disabled) return undefined;

    const updateActiveSection = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.34;
      let current = "top";

      sectionOrder.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= viewportAnchor) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [disabled, sectionOrder]);

  return activeSection;
}

