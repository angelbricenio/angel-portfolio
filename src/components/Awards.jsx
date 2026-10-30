import { awards, awardPhotos } from '../services/content';
import { useInView } from '../hooks/useInView';
import SectionTitle from './SectionTitle';

const AWARD_ALTS = {
  '590478301_3680837865381047_1667494862286018520_n.jpg':
    'Mary Angel Bricenio with certificates and awards at an exhibition table',
  'grad trs (1).png':
    'Tres Marias staff stories feature congratulating Angel on graduating Cum Laude',
};

export default function Awards() {
  const { ref, inView } = useInView();

  return (
    <section id="awards" className="section">
      <div className="wrap">
        <SectionTitle title={awards.title} lede={awards.lede} />

        {awardPhotos.length > 0 ? (
          <div className={`awards-photos reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
            {awardPhotos.map((photo) => (
              <figure key={photo.path} className="awards-photo">
                <img
                  src={photo.src}
                  alt={AWARD_ALTS[photo.file] || `Award moment — ${photo.file}`}
                  width={560}
                  height={420}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        ) : null}

        <div className={`awards-grid reveal ${inView ? 'is-visible' : ''}`}>
          {awards.columns.map((column, colIdx) => (
            <ul key={colIdx} className="awards-list">
              {column.map((item) => (
                <li key={`${item.bold}${item.rest}`}>
                  <b>{item.bold}</b>
                  {item.rest}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
