import { useState } from "react";
import { Toast } from "./components/common/Toast";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { WhatsAppWidget } from "./components/layout/WhatsAppWidget";
import { ProductPage } from "./components/product/ProductPage";
import { AboutSection } from "./components/sections/AboutSection";
import { ClientsSection } from "./components/sections/ClientsSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { MetricsStrip } from "./components/sections/MetricsStrip";
import { ProductsSection } from "./components/sections/ProductsSection";
import { QualitySection } from "./components/sections/QualitySection";
import { ServicesSection } from "./components/sections/ServicesSection";
import { products } from "./data/products";
import { sectionOrder } from "./data/navigation";
import { useActiveSection } from "./hooks/useActiveSection";
import { useHashProductRoute } from "./hooks/useHashProductRoute";
import { useSeoMeta } from "./hooks/useSeoMeta";
import { useScreenStage } from "./hooks/useScreenStage";
import { useTheme } from "./hooks/useTheme";

function HomePage({ onOpenProduct }) {
  return (
    <>
      <HeroSection />
      <MetricsStrip />
      <AboutSection />
      <ServicesSection />
      <ProductsSection onOpenProduct={onOpenProduct} />
      <QualitySection />
      <ClientsSection />
      <ContactSection />
    </>
  );
}

function App() {
  const [toast, setToast] = useState("");
  const { theme, toggleTheme } = useTheme();
  const {
    selectedProduct,
    openProduct,
    closeProduct,
    clearProductAndGoToContact,
  } = useHashProductRoute(products);

  const activeSection = useActiveSection(sectionOrder, Boolean(selectedProduct));
  useSeoMeta(selectedProduct);
  useScreenStage(!selectedProduct);

  const showSoon = (channel) => {
    setToast(`${channel} is coming soon`);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="site-shell">
      <Header
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="top" className="screen-stack">
        {selectedProduct ? (
          <ProductPage
            product={selectedProduct}
            onBack={closeProduct}
            onEnquire={clearProductAndGoToContact}
          />
        ) : (
          <HomePage onOpenProduct={openProduct} />
        )}
      </main>

      <Footer theme={theme} onComingSoon={showSoon} />
      <Toast message={toast} />
      <WhatsAppWidget />
    </div>
  );
}

export default App;
