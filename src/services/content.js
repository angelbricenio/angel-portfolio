import { basename, filenameToTitle, workFolder } from '../utils/filename';

/* ── Image loaders (add/remove files in these folders without changing code) ── */

const photoModules = import.meta.glob(
  '../assets/my_photo/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
);

// Flat files at work/ root
const workFlatModules = import.meta.glob(
  '../assets/work/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,jfif,JFIF}',
  { eager: true, import: 'default' },
);

// Nested project folders (church_photo/, eastbound_pickleball/, etc.)
const workNestedModules = import.meta.glob(
  '../assets/work/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,jfif,JFIF}',
  { eager: true, import: 'default' },
);

function toSortedEntries(modules) {
  return Object.entries(modules)
    .map(([path, src]) => ({ path, src, file: basename(path) }))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { sensitivity: 'base' }));
}

/** Prefer an explicit cover, then smaller/readable files (skip huge PNGs / odd names). */
function pickCover(images, preferredFile) {
  if (!images.length) return null;
  if (preferredFile) {
    const hit = images.find((img) => img.file === preferredFile);
    if (hit) return hit;
  }
  const scored = [...images].sort((a, b) => {
    const score = (item) => {
      const name = item.file.toLowerCase();
      let s = 0;
      if (/\.(jpe?g|jfif)$/i.test(item.file)) s += 3;
      if (/^[0-9a-f-]{8,}/i.test(item.file) || /^\d+_/.test(item.file)) s += 1;
      if (/screenshot|untitled|^\[+|^\.+/i.test(name)) s -= 5;
      if (/\.png$/i.test(item.file)) s -= 1;
      return s;
    };
    return score(b) - score(a) || a.file.localeCompare(b.file);
  });
  return scored[0];
}

export const photos = toSortedEntries(photoModules);

const allWorkModules = { ...workNestedModules, ...workFlatModules };
const allWorkImages = toSortedEntries(allWorkModules);

/**
 * Optional overrides keyed by filename OR by parent folder name.
 * Match portfolio.html titles where the sample aligns with those projects.
 */
export const workOverrides = {
  church_photo: {
    title: 'Event photography',
    description: 'Churches, weddings and family celebrations.',
    size: 'wide',
    coverFile: '490730489_3408054032659433_3551311845517019515_n.jpg',
  },
  'clothing-merch_design': {
    title: 'Brand posts',
    description: 'Posters and campaign visuals for clients.',
    size: 'default',
    coverFile: '1.jpg',
  },
  eastbound_pickleball: {
    title: 'Eastbound Pickleball',
    description: 'Social media layouts and branded posts for Eastbound.',
    size: 'wide',
    coverFile: 'EASTB (4).jpg',
  },
  freelance_photo: {
    title: 'Portraits',
    description: 'Natural-light sessions with garden and studio looks.',
    size: 'default',
    coverFile: '521ec809-c75a-48ed-9976-5b2465e0d40e.jfif',
  },
  product_design: {
    title: 'Graphic design',
    description: 'Social media layouts, menus and logo work.',
    size: 'default',
    coverFile: '1.jpg',
  },
  promotional_edit: {
    title: 'Food promo graphics',
    description: 'Menu posts and promo layouts for a pizza business.',
    size: 'default',
  },
  tres_marias_restaurant: {
    title: 'Tres Marias Alfresco',
    description: 'Menu posts and promo layouts for Tres Marias restaurant.',
    size: 'wide',
    coverFile: '741361180_1025119560101662_4674911163089582931_n.jpg',
  },
};

function resolveOverride(file, folder) {
  return workOverrides[file] || workOverrides[folder] || null;
}

/** Group images into project cards (one card per folder / flat file) with cover photos. */
function buildWorkProjects() {
  const groups = new Map();

  for (const item of allWorkImages) {
    const folder = workFolder(item.path);
    const key = folder || item.file;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  const preferredOrder = [
    'tres_marias_restaurant',
    'eastbound_pickleball',
    'church_photo',
    'clothing-merch_design',
    'product_design',
    'freelance_photo',
    'promotional_edit',
  ];

  const keys = [
    ...preferredOrder.filter((k) => groups.has(k)),
    ...[...groups.keys()].filter((k) => !preferredOrder.includes(k)).sort(),
  ];

  return keys
    .map((key, index) => {
      const images = groups.get(key);
      if (!images?.length) return null;

      const folder = images[0] && workFolder(images[0].path);
      const override = resolveOverride(key, folder || key);
      const cover = pickCover(images, override?.coverFile);
      const title = override?.title || filenameToTitle(folder || key);
      const description =
        override?.description ||
        (folder ? `${filenameToTitle(folder)} sample.` : 'Selected creative work.');
      const size =
        override?.size || (index % 3 === 0 ? 'wide' : index % 5 === 2 ? 'tall' : 'default');

      const gallery = images.map((img) => ({
        src: img.src,
        alt: `${title} — ${img.file}`,
        title,
        file: img.file,
      }));

      return {
        id: key,
        folder: folder || '',
        file: cover.file,
        src: cover.src,
        title,
        description,
        alt: `${title} cover image`,
        size,
        count: images.length,
        gallery,
      };
    })
    .filter(Boolean);
}

export const works = buildWorkProjects();

/** Flat list for lightbox navigation across the opened project */
export const workImages = allWorkImages;

const HERO_PHOTO_FILE =
  '598223506_3702402633224570_5675506191262133962_n.jpg';

const ABOUT_FEATURED_FILE =
  '524164099_3534375463360622_3369850943859112455_n.jpg';

export const heroPhoto =
  photos.find((p) => p.file === HERO_PHOTO_FILE) ?? photos[0] ?? null;

export const aboutFeaturedPhoto =
  photos.find((p) => p.file === ABOUT_FEATURED_FILE) ??
  photos.find((p) => p.file !== heroPhoto?.file) ??
  null;

/** Graduation / awards photos shown in the Awards section */
export const awardPhotos = photos.filter(
  (p) => p.file !== heroPhoto?.file && p.file !== aboutFeaturedPhoto?.file,
);

/* ── Page copy ── */

export const site = {
  name: 'Mary Angel Bricenio',
  brand: 'Angel Bricenio Creatives',
  logo: 'ANGEL BRICENIO CREATIVES',
  location: 'Batangas, Philippines',
  year: 2026,
};

export const hero = {
  eyebrow: 'Angel Bricenio Creatives',
  titleLine1: 'Mary Angel',
  titleLine2: 'Bricenio',
  roles:
    'Photographer, videographer, graphic artist, drone pilot and creative director. I also design UI/UX, websites and mobile games.',
  ctaPrimary: { label: 'See my work', href: '#work' },
  ctaSecondary: { label: 'Get in touch', href: '#contact' },
  portraitAlt: 'Mary Angel Bricenio seated with a camera',
};

export const marqueeItems = [
  'PHOTOGRAPHY',
  'VIDEOGRAPHY',
  'GRAPHIC DESIGN',
  'DRONE',
  'UI / UX',
  'WEB',
  'MOBILE GAMES',
  'CREATIVE DIRECTION',
];

export const about = {
  title: 'About me',
  paragraphs: [
    "I'm a Cum Laude graduate and Most Outstanding Student from STI College Batangas. I've been behind a camera since 2014, when I joined my school's camera club, and I've been making films since 2017.",
    'Today I lead creative work as Creative Manager of the STI Supreme Student Council and manage social media for local businesses. My capstone, Joe Adventure: Vocabulary, is a mobile game and web app that teaches English vocabulary.',
  ],
  facts: [
    { value: '10+', label: 'Years in photo and film' },
    { value: '25+', label: 'Contests and awards' },
    { value: '6', label: 'Disciplines' },
    { value: 'Cum Laude', label: 'STI College Batangas' },
  ],
};

export const workSection = {
  title: 'Selected work',
  lede: 'Tap any piece to see it larger.',
  emptyMessage: 'Work samples will appear here once you add images to src/assets/work/.',
};

export const awards = {
  title: 'Awards and wins',
  lede: 'Champion titles across film, photo and video, plus the recognitions that came with my capstone.',
  columns: [
    [
      { bold: 'Cum Laude', rest: ' and Most Outstanding Student' },
      { bold: 'Leadership Awardee', rest: '' },
      { bold: 'Champion', rest: ', Directors Cut (STI cluster), 2023' },
      { bold: 'Champion', rest: ', Shutter Best (STI cluster), 2023' },
      { bold: '1st place', rest: ', Directors Cut, 2024–2025' },
      { bold: 'Champion', rest: ', ICE Photo Exhibit, 2024' },
      { bold: 'Champion', rest: ', Born Film Photo Contest, 2022' },
      { bold: 'Champion', rest: ', Youthfest Glory Video Competition, 2018' },
      { bold: 'Champion', rest: ', Salakot Midya Batangas Pitik Barako, 2019' },
    ],
    [
      { bold: 'Champion', rest: ', Buwan ng Wika Photo Contest, University of Batangas, 2019' },
      { bold: '2nd runner up', rest: ', Buwan ng Wika short film' },
      { bold: 'Champion', rest: ', MFC Youth short film, 2020' },
      { bold: '5th place', rest: ', Regional Festival of Talents, Region 4A, 2018' },
      { bold: 'Champion', rest: ', Battle of the Band, Batangas' },
      { bold: 'Winner', rest: ', Batangas Live Your Dream, Soroptimist International' },
      { bold: 'Capstone:', rest: " Overall Best Exhibition, Best Booth People's Choice" },
      { bold: 'Capstone:', rest: ' Best in Communication, Best in Brochure (Champion)' },
      { bold: 'Capstone:', rest: ' Best in Poster and Best in Research Implementation (1st runner up)' },
    ],
  ],
};

export const experience = {
  title: 'Experience and leadership',
  lede: "Where I've worked, led and volunteered.",
  columns: [
    [
      { role: 'Creative Manager', org: 'STI Supreme Student Council', when: 'Present' },
      { role: 'Film maker', org: 'STI College Batangas', when: 'Present' },
      { role: 'Social media executive', org: 'Tres Marias Alfresco', when: 'Present' },
      {
        role: 'CODE media director and social media executive',
        org: 'Gee Designs and Build Construction',
        when: 'Present',
      },
      { role: 'Youth lit servant', org: 'MFC', when: 'Present' },
    ],
    [
      {
        role: 'Chief photojournalist',
        org: 'Southern Time Initiative, STI Batangas',
        when: '2022–2024',
      },
      { role: 'Photojournalist', org: 'The Westernian Advocate, Batch 21', when: 'Former' },
      { role: 'Filmmaker', org: 'Teatro Anino, University of Batangas', when: '2017–2019' },
      { role: 'Member', org: 'Camera Club, University of Batangas', when: '2014–2019' },
      { role: 'Youth lit creatives', org: 'MFC', when: 'Former' },
    ],
  ],
};

/**
 * Software I use — exact list from the brief.
 * Icons are resolved in the Software component via react-icons/si.
 */
export const software = {
  title: 'Software I use',
  lede: 'The tools behind the photos, films, designs and builds.',
  items: [
    {
      id: 'photoshop',
      name: 'Photoshop',
      description: 'Photo editing and retouching',
      initials: 'Ps',
      icon: 'SiAdobephotoshop',
    },
    {
      id: 'canva',
      name: 'Canva',
      description: 'Quick social media and promo layouts',
      initials: 'Ca',
      icon: 'SiCanva',
    },
    {
      id: 'after-effects',
      name: 'After Effects',
      description: 'Motion graphics and video effects',
      initials: 'Ae',
      icon: 'SiAdobeaftereffects',
    },
    {
      id: 'capcut',
      name: 'CapCut',
      description: 'Fast video editing',
      initials: 'Cc',
      icon: 'SiCapcut',
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'UI/UX design and app prototypes',
      initials: 'Fi',
      icon: 'SiFigma',
    },
    {
      id: 'android-studio',
      name: 'Android Studio',
      description: 'Mobile app and game development',
      initials: 'AS',
      icon: 'SiAndroidstudio',
    },
    {
      id: 'visual-studio',
      name: 'Visual Studio',
      description: 'Coding and web development',
      initials: 'VS',
      icon: 'SiVisualstudio',
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'AI assistant for writing, coding and ideas',
      initials: 'Cl',
      icon: 'SiClaude',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'AI assistant for research and brainstorming',
      initials: 'GPT',
      icon: 'SiOpenai',
    },
  ],
};

/**
 * Contact links — replace the placeholders below with your real URLs/email.
 * Edit this object in src/services/content.js
 */
export const contact = {
  title: "Let's make something together.",
  lede: "Photo, video, design or an app. Tell me about your project and I'll get back to you.",
  email: 'hello@angelbriceniocreatives.com', // ← replace with your email
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/yourhandle' }, // ← replace
    { label: 'Facebook', href: 'https://facebook.com/yourpage' }, // ← replace
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourprofile' }, // ← replace
  ],
};

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Software', href: '#software' },
  { label: 'Awards', href: '#awards' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];
