import { experience } from '../services/content';
import { useInView } from '../hooks/useInView';
import SectionTitle from './SectionTitle';

export default function Experience() {
  const { ref, inView } = useInView();

  return (
    <section id="experience" className="section section-alt">
      <div className="wrap">
        <SectionTitle title={experience.title} lede={experience.lede} />
        <div className={`awards-grid reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
          {experience.columns.map((column, colIdx) => (
            <ul key={colIdx} className="roles-list">
              {column.map((item) => (
                <li key={`${item.role}-${item.org}`}>
                  <span>
                    <b>{item.role}</b>, {item.org}
                  </span>
                  <em>{item.when}</em>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
