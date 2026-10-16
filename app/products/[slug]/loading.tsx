export default function ProductLoading() {
  return (
    <section className="product-detail section">
      <div className="product-gallery">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="skeleton" style={{ aspectRatio: '3 / 4' }} key={index}></div>
        ))}
      </div>
      <div className="product-panel">
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton" style={{ height: '48px', marginTop: '16px' }}></div>
      </div>
    </section>
  );
}
