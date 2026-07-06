import { useEffect, useState } from "react";
import { productPath } from "../config/site";

function productFromLocation(products) {
  const pathMatch = window.location.pathname.match(/^\/products\/([^/]+)\/?$/);
  const hashMatch = window.location.hash.match(/^#product\/(.+)$/);
  const slug = pathMatch?.[1] ?? hashMatch?.[1];

  return slug ? products.find((item) => item.slug === slug) : null;
}

export function useHashProductRoute(products) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const applyRoute = () => {
      const product = productFromLocation(products);

      setSelectedProduct(product ?? null);

      if (product) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    applyRoute();
    window.addEventListener("hashchange", applyRoute);
    window.addEventListener("popstate", applyRoute);

    return () => {
      window.removeEventListener("hashchange", applyRoute);
      window.removeEventListener("popstate", applyRoute);
    };
  }, [products]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    window.history.pushState(null, "", productPath(product.slug));
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    window.history.pushState(null, "", "/#products");
    window.setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const clearProductAndGoToContact = () => {
    setSelectedProduct(null);
    window.history.pushState(null, "", "/#contact");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.setTimeout(() => {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const navigateToSection = (sectionId) => {
    setSelectedProduct(null);
    window.history.pushState(null, "", `/#${sectionId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return {
    selectedProduct,
    openProduct,
    closeProduct,
    clearProductAndGoToContact,
    navigateToSection,
  };
}
