const DEFAULT_PHRASES = ['Soft & Gentle', 'Made With Love', 'Everyday Comfort', 'Thoughtfully Designed'];

/**
 * Full-bleed horizontally scrolling text banner. Content is duplicated
 * so the track loops seamlessly; pauses automatically for viewers who
 * prefer reduced motion (the track just renders statically instead).
 */
function ScrollingText({ phrases = DEFAULT_PHRASES, direction = 'left' }) {
  const track = (
    <div className="flex items-center shrink-0">
      {phrases.map((phrase, i) => (
        <span key={i} className="flex items-center">
          <span className="font-heading text-3xl md:text-5xl text-background px-6 md:px-8 whitespace-nowrap">
            {phrase}
          </span>
          <span className="h-2 w-2 rounded-full bg-highlight shrink-0" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className="bg-neutral-950 py-6 md:py-8 overflow-hidden" aria-hidden="true">
      <div
        className={`flex motion-safe:animate-marquee ${direction === 'right' ? '[animation-direction:reverse]' : ''}`}
      >
        {track}
        {track}
      </div>
    </section>
  );
}

export default ScrollingText;
