// One-off admin script — run locally, never imported by the app.
// Replaces mismatched product photos with real, verified Unsplash photos
// and renames each product to honestly describe what's actually shown.
// Adds 2 additional gallery images per product via product_images.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/fix-product-images.mjs

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const img = (id, w = 900, h = 1125) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// slug: existing product slug (unchanged, so routes/links keep working)
const PRODUCTS = [
  {
    slug: 'cotton-bunny-romper',
    name: 'Classic Cotton Romper',
    description: 'A soft, organic-cotton romper in classic white. Snap closures make changing quick and easy.',
    primary: '1622290319146-7b63df48a635',
    gallery: ['1583007109931-cdf68cdc4f4d', '1620354600301-e8b325ef1181'],
  },
  {
    slug: 'newborn-welcome-set',
    name: 'Newborn Welcome Set',
    description: "A colorful bundle of your baby's first pieces — soft cotton essentials in a range of gentle shades.",
    primary: '1766918780914-5df4a5a98c44',
    gallery: ['1510154221590-ff63e90a136f', '1537544176619-f79b157c634b'],
  },
  {
    slug: 'cloud-print-sleepsuit',
    name: 'Classic White Footed Sleepsuit',
    description: 'A soft, full-length footed sleepsuit with flat seams and easy changing access for midnight changes.',
    primary: '1620354600301-e8b325ef1181',
    gallery: ['1444318226545-dfd6106d7ec4', '1537544176619-f79b157c634b'],
  },
  {
    slug: 'striped-cotton-tee',
    name: 'Striped Cotton Tee',
    description: 'A everyday striped tee in breathable cotton jersey, cut generously for easy movement.',
    primary: '1581093835839-f1dcc85c1765',
    gallery: ['1628015975517-756ea7360359'],
  },
  {
    slug: 'everyday-jogger-pants',
    name: 'Soft Pink Knit Pants',
    description: 'Soft, stretchy knit pants with an easy elastic waist that grows with your little one.',
    primary: '1602887627273-85fff2433015',
    gallery: [],
  },
  {
    slug: 'sunday-pinafore-dress',
    name: 'White Occasion Dress',
    description: 'A dreamy white dress with delicate ruffle sleeves — made for twirling and special days.',
    primary: '1653835785932-1710eac6385d',
    gallery: ['1676509926048-5410d37f478d'],
  },
  {
    slug: 'weekend-coord-set',
    name: 'White Ruffle Playsuit',
    description: 'A soft ruffle-trim playsuit in breathable cotton — the easiest way to get dressed on a busy morning.',
    primary: '1568385247005-0d371d214a2c',
    gallery: [],
  },
  {
    slug: 'quilted-puffer-jacket',
    name: 'Yellow Puffer Snowsuit',
    description: 'A cosy quilted snowsuit in cheerful yellow, made to keep little ones warm on cold-weather outings.',
    primary: '1699516781997-21beee06a67f',
    gallery: ['1611883916950-9a433d1a5401'],
  },
  {
    slug: 'soft-knit-beanie',
    name: 'Heart Patch Knit Beanie',
    description: 'A gently stretchy knit beanie with a sweet heart patch that keeps its shape wash after wash.',
    primary: '1630650916169-87efcfd2cd3a',
    gallery: ['1611883916950-9a433d1a5401', '1513091250092-b06c2b7981bc'],
  },
  {
    slug: 'organic-muslin-swaddle',
    name: 'Organic Muslin Swaddle',
    description: 'An extra-large muslin swaddle that softens with every wash — doubles as a nursing cover or stroller shade.',
    primary: '1537544176619-f79b157c634b',
    gallery: ['1444318226545-dfd6106d7ec4'],
  },
  {
    slug: 'button-up-cardigan',
    name: 'Red Knit Hooded Cardigan',
    description: 'A soft knit hooded cardigan with playful ear details — a cosy layer for cooler evenings.',
    primary: '1611883916950-9a433d1a5401',
    gallery: ['1630650916169-87efcfd2cd3a'],
  },
  {
    slug: 'ribbed-footed-sleepsuit',
    name: 'Grey Bear-Hood Footed Romper',
    description: 'A snug, hooded footed romper with playful bear ears — no more searching for lost socks at bedtime.',
    primary: '1583007109931-cdf68cdc4f4d',
    gallery: ['1620354600301-e8b325ef1181'],
  },
  {
    slug: 'denim-look-dungarees',
    name: 'Denim-Look Dungarees',
    description: 'Soft denim-look dungarees with easy poppers for quick changes, built for everyday adventures.',
    primary: '1563330183-d44b627e4ea1',
    gallery: [],
  },
  {
    slug: 'floral-puff-sleeve-dress',
    name: 'Floral Tulle Party Dress',
    description: 'A lightweight floral tulle dress with gentle puff sleeves — perfect for celebrations and photos.',
    primary: '1676509926048-5410d37f478d',
    gallery: ['1653835785932-1710eac6385d'],
  },
  {
    slug: 'terry-cloth-romper',
    name: 'Hooded Terry Wrap',
    description: 'A textured terry wrap with a soft hood that feels like a warm towel hug all day long.',
    primary: '1564172327270-baad3ce623ad',
    gallery: [],
  },
  {
    slug: 'knit-booties-mitten-set',
    name: 'Knit Booties Set',
    description: 'Hand-knit booties to keep tiny feet warm — soft, stretchy, and easy to slip on.',
    primary: '1513091250092-b06c2b7981bc',
    gallery: ['1630650916169-87efcfd2cd3a'],
  },
  {
    slug: 'fleece-lined-snowsuit',
    name: 'Golden Winter Coverall',
    description: 'A cosy all-in-one winter coverall with a fold-over cuff to protect little hands from the cold.',
    primary: '1699516781997-21beee06a67f',
    gallery: ['1611883916950-9a433d1a5401'],
  },
  {
    slug: 'two-piece-lounge-set',
    name: 'Cotton Basics Collection',
    description: 'A rotation of soft cotton basics in easy everyday colors, ready for laundry day and beyond.',
    primary: '1760727772969-cb5cd59c6f30',
    gallery: [],
  },
];

async function run() {
  const summary = { updated: 0, galleryInserted: 0, errors: [] };

  for (const p of PRODUCTS) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .maybeSingle();

    if (fetchError || !product) {
      summary.errors.push(`Product "${p.slug}" not found: ${fetchError?.message || 'no row'}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: p.name,
        description: p.description,
        image_url: img(p.primary),
      })
      .eq('id', product.id);

    if (updateError) {
      summary.errors.push(`Update "${p.slug}": ${updateError.message}`);
      continue;
    }
    summary.updated += 1;

    if (p.gallery.length > 0) {
      const rows = p.gallery.map((id, i) => ({
        product_id: product.id,
        image_url: img(id),
        alt_text: p.name,
        display_order: i,
      }));
      const { error: galleryError } = await supabase.from('product_images').insert(rows);
      if (galleryError) {
        summary.errors.push(`Gallery "${p.slug}": ${galleryError.message}`);
      } else {
        summary.galleryInserted += rows.length;
      }
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

run();
