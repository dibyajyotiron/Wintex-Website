import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import { contactEmail } from "../../config/site";

export function ProductPage({ product, onBack, onEnquire }) {
  const productEmailUrl = useMemo(() => {
    if (!product) return `mailto:${contactEmail}`;

    const body = [
      `Hello Wintex, I would like to enquire about ${product.name}.`,
      "",
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      "",
      "Please share pricing, availability, configuration options, and next steps.",
    ].join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent(`Enquiry for ${product.name}`)}&body=${encodeURIComponent(body)}`;
  }, [product]);

  return (
    <section className="product-page section-band reveal">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={17} />
        Back to products
      </button>
      <div className="product-page-hero">
        <div className="product-page-copy">
          <span>{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.summary}</p>
          <div className="hero-actions">
            <a className="primary-action" href={product.download} download>
              Download specification
              <Download size={18} />
            </a>
            <button className="secondary-action" type="button" onClick={onEnquire}>
              Enquire now
              <ArrowRight size={18} />
            </button>
            <a className="secondary-action" href={productEmailUrl}>
              Email enquiry
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="product-page-media">
          <img src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="product-info-grid">
        {product.types && (
          <article>
            <strong>Types of weighbridge</strong>
            <ul>
              {product.types.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        )}
        <article>
          <strong>Key specifications</strong>
          <ul>
            {product.specs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <strong>Product features</strong>
          <ul>
            {product.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <strong>Best used for</strong>
          <ul>
            {product.applications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
