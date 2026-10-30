import { hero, heroPhoto } from '../services/content';
import { useInView } from '../hooks/useInView';

export default function Hero() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <section className="hero" aria-label="Introduction" ref={ref}>
      <div className={`wrap hero-grid reveal ${inView ? 'is-visible' : ''}`}>
        <div className="hero-copy">
          <p className="hero-eyebrow">{hero.eyebrow}</p>
          <h1 className="hero-title">
            <span className="hero-title-line">{hero.titleLine1}</span>
            <span className="hero-title-line hero-title-line--accent">{hero.titleLine2}</span>
          </h1>
          <p className="hero-roles">{hero.roles}</p>
          <div className="hero-btns">
            <a className="btn" href={hero.ctaPrimary.href}>
              {hero.ctaPrimary.label}
            </a>
            <a className="btn btn-ghost" href={hero.ctaSecondary.href}>
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        <figure className="hero-portrait">
          {heroPhoto ? (
            <img
              src={heroPhoto.src}
              alt={hero.portraitAlt}
              width={560}
              height={700}
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="placeholder" role="img" aria-label="Portrait placeholder">
              Add a portrait to <code>src/assets/my_photo/</code>
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}
