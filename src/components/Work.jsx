import { useCallback, useEffect, useState } from 'react';
import { workSection, works } from '../services/content';
import { useInView } from '../hooks/useInView';
import SectionTitle from './SectionTitle';
import WorkCard from './WorkCard';
import Lightbox from './Lightbox';

export default function Work() {
  const { ref, inView } = useInView({ threshold: 0.02, rootMargin: '80px' });
  const [gallery, setGallery] = useState([]);
  const [index, setIndex] = useState(null);

  const isOpen = index !== null && gallery.length > 0;
  const current = isOpen ? gallery[index] ?? null : null;

  const close = useCallback(() => {
    setIndex(null);
    setGallery([]);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i === null || gallery.length === 0 ? i : (i + 1) % gallery.length));
  }, [gallery.length]);

  const prev = useCallback(() => {
    setIndex((i) =>
      i === null || gallery.length === 0 ? i : (i - 1 + gallery.length) % gallery.length,
    );
  }, [gallery.length]);

  const handleOpen = (project) => {
    if (!project?.gallery?.length) return;
    setGallery(project.gallery);
    setIndex(0);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, next, prev]);

  return (
    <section id="work" className="section section-alt">
      <div className="wrap">
        <SectionTitle title={workSection.title} lede={workSection.lede} />

        {works.length === 0 ? (
          <p className="empty-state">{workSection.emptyMessage}</p>
        ) : (
          <div className={`work-grid reveal ${inView ? 'is-visible' : ''}`} ref={ref}>
            {works.map((item) => (
              <WorkCard key={item.id} item={item} onOpen={() => handleOpen(item)} />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        isOpen={isOpen}
        current={current}
        index={index ?? 0}
        total={gallery.length}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </section>
  );
}
