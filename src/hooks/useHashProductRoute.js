import { useEffect, useState } from "react";

export function useHashProductRoute(products) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const applyRoute = () => {
      const match = window.location.hash.match(/^#product\/(.+)$/);
      const product = match
        ? products.find((item) => item.slug === match[1])
        : null;

      setSelectedProduct(product ?? null);

      if (product) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    applyRoute();
    window.addEventListener("hashchange", applyRoute);

    return () => window.removeEventListener("hashchange", applyRoute);
  }, [products]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    window.location.hash = `product/${product.slug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    window.history.replaceState(null, "", "#products");
    window.setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const clearProductAndGoToContact = () => {
    setSelectedProduct(null);
    window.location.hash = "contact";
  };

  return {
    selectedProduct,
    openProduct,
    closeProduct,
    clearProductAndGoToContact,
  };
}

