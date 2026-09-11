const FAMILIES = [
  {
    title: 'Organic & everyday cotton',
    used: '100% Organic Cotton, 100% Cotton',
    text: "Our default choice for anything worn close to the skin. Breathable, machine-washable, and gentle enough for a newborn's first weeks.",
  },
  {
    title: 'Cotton terry & French terry',
    used: 'Cotton Terry, Cotton French Terry',
    text: 'A looped, slightly textured weave — soft like a towel, with just enough structure to hold its shape through active days and repeated washes.',
  },
  {
    title: 'Muslin',
    used: '100% Organic Muslin Cotton',
    text: 'Loosely woven and lightweight, muslin actually gets softer with every wash. It breathes well, which is why it shows up in swaddles and layering pieces.',
  },
  {
    title: 'Knits',
    used: 'Cotton Knit, Ribbed Cotton, Acrylic Knit',
    text: 'Stretchy without losing shape, knit fabrics move with a growing baby instead of resisting them — used for cardigans, beanies, and loungewear.',
  },
  {
    title: 'Blended stretch cotton',
    used: '95% Cotton, 5% Elastane',
    text: 'A small amount of elastane added to cotton for pieces that need to stretch and recover, like footed sleepsuits, without losing the feel of natural fabric.',
  },
  {
    title: 'Fleece-lined outerwear',
    used: 'Polyester Shell, Fleece Lining',
    text: 'For jackets and snowsuits, a durable outer shell paired with a soft fleece lining — built to handle cooler weather without the bulk.',
  },
];

function Materials() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Materials</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        We look for fabrics that feel gentle against delicate skin and hold
        up to everyday wear and washing — natural, breathable materials over
        anything synthetic or scratchy wherever we can help it.
      </p>

      <div className="mt-10 space-y-8">
        {FAMILIES.map((family) => (
          <div key={family.title}>
            <h2 className="font-heading text-xl text-foreground mb-1">{family.title}</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Used in: {family.used}
            </p>
            <p className="text-muted-foreground leading-relaxed">{family.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="font-heading text-xl text-foreground mb-2">Care instructions</h2>
        <p className="text-muted-foreground leading-relaxed">
          Every product page lists the exact material and care instructions
          for that piece, so you always know what you're bringing home. As a
          general rule: wash cold, skip the bleach, and air-dry or tumble
          dry low — delicate knits and muslin do best hand-washed and laid
          flat to dry.
        </p>
      </div>
    </div>
  );
}

export default Materials;
