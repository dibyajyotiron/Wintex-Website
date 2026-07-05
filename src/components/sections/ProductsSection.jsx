import { FileText } from "lucide-react";
import { OptimizedImage } from "../common/OptimizedImage";
import { cataloguePath, productPath } from "../../config/site";
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
          <a
            className="product-card"
            key={product.name}
            href={productPath(product.slug)}
            onClick={(event) => {
              event.preventDefault();
              onOpenProduct(product);
            }}
          >
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={product.imageWidth}
              height={product.imageHeight}
              widths={[360, 540, 720]}
              sizes="(max-width: 680px) calc(100vw - 34px), (max-width: 980px) calc((100vw - 54px) / 2), 386px"
            />
            <div>
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <small>View specification</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
