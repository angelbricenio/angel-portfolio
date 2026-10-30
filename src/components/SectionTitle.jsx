import { useInView } from '../hooks/useInView';

export default function SectionTitle({ title, lede, light = false }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`section-title reveal ${inView ? 'is-visible' : ''} ${light ? 'section-title--light' : ''}`}
    >
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
