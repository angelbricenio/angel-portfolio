import { contact } from '../services/content';
import { useInView } from '../hooks/useInView';

export default function Contact() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="section contact">
      <div className={`wrap reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
        <h2>{contact.title}</h2>
        <p className="contact-lede">{contact.lede}</p>

        <div className="contact-actions">
          <a className="btn btn-on-dark" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <ul className="contact-socials">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
