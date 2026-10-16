export default function CollectionsLoading() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Loading</p>
          <h2>Preparing the atelier edit.</h2>
        </div>
        <div className="featured-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="product-card" key={index}>
              <div className="product-media skeleton" style={{ aspectRatio: '3 / 4' }}></div>
              <div className="card-body">
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text short"></div>
                <div className="skeleton skeleton-text short"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
