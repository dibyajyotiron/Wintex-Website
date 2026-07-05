import { FileText } from "lucide-react";
import { cataloguePath } from "../../config/site";
import { products } from "../../data/products";

export function ProductsSection({ onOpenProduct }) {
  return (
    <section className="section-band products reveal" id="products">
      <div className="section-heading split-heading">
        <div>
          <span>Products</span>
          <h2>Built for precision across every weighing environment.</h2>
        </div>
        <p>
          Heavy-duty weighbridges, platform scales, table-top units, jewellery
          scales, and specialized compact systems for commercial and industrial
          use. Click any product to view its specification page.
        </p>
      </div>
      <div className="catalogue-row">
        <a className="secondary-action catalogue-action" href={cataloguePath} download>
          <FileText size={18} />
          Download full catalogue
        </a>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <button
            className="product-card"
            key={product.name}
            type="button"
            onClick={() => onOpenProduct(product)}
          >
            <img src={product.image} alt={product.name} />
            <div>
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <small>View specification</small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

