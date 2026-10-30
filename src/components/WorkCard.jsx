export default function WorkCard({ item, onOpen }) {
  return (
    <article className="work-card">
      <button
        type="button"
        className="work-card-media"
        onClick={onOpen}
        aria-label={`View larger: ${item.title}`}
      >
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          width={480}
          height={600}
        />
        {item.count > 1 ? (
          <span className="work-card-count" aria-hidden="true">
            {item.count} photos
          </span>
        ) : null}
      </button>
      <div className="work-card-body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}
