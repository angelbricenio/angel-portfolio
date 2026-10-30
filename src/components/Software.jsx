import { SiAndroidstudio, SiClaude, SiFigma } from 'react-icons/si';
import { software } from '../services/content';
import { useInView } from '../hooks/useInView';
import SectionTitle from './SectionTitle';

/** Simple Icons available in this react-icons build. Others use initials badges. */
const ICONS = {
  SiFigma,
  SiAndroidstudio,
  SiClaude,
};

function SoftwareIcon({ item }) {
  const Icon = ICONS[item.icon];
  if (Icon) {
    return <Icon aria-hidden="true" className="software-icon" />;
  }
  return (
    <span className="software-badge" aria-hidden="true">
      {item.initials}
    </span>
  );
}

export default function Software() {
  const { ref, inView } = useInView();

  return (
    <section id="software" className="section">
      <div className="wrap">
        <SectionTitle title={software.title} lede={software.lede} />
        <ul className={`software-grid reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
          {software.items.map((item) => (
            <li key={item.id} className="software-card">
              <div className="software-icon-wrap">
                <SoftwareIcon item={item} />
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
