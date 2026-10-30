import { about, aboutFeaturedPhoto } from '../services/content';
import { useInView } from '../hooks/useInView';
import SectionTitle from './SectionTitle';

export default function About() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section about-section">
      <div className="wrap">
        <div className={`about-layout reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
          <aside className="about-media" aria-label="About photo">
            <figure className="about-featured-wrap">
              <div className="about-featured">
                {aboutFeaturedPhoto ? (
                  <img
                    src={aboutFeaturedPhoto.src}
                    alt="Mary Angel Bricenio holding a drone in a nest-like seat by the water"
                    width={480}
                    height={640}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="placeholder">Add a photo to my_photo</div>
                )}
              </div>
              <figcaption className="about-featured-caption">
                Behind the lens — and the drone
              </figcaption>
            </figure>
          </aside>

          <div className="about-copy">
            <SectionTitle title={about.title} />
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            <div className="facts">
              {about.facts.map((fact) => (
                <div key={fact.label} className="fact">
                  <b>{fact.value}</b>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
