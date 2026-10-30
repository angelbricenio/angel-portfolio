import { site } from '../services/content';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        © {site.year} {site.name} · {site.brand} · {site.location}
      </div>
    </footer>
  );
}
