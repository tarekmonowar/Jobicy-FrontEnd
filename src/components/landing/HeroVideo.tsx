'use client';

// Full-width autoplay hero video — poster fallback + dark overlay for readability.

const VIDEO_SRC =
  'https://pub-f4ea9af7099d4da88120f0165b8c6102.r2.dev/bgvideo%20(1).mp4';

/**
 * Edge-to-edge muted loop video for the landing page. No controls; poster shows
 * while the file buffers on slow connections.
 */
export function HeroVideo() {
  return (
    <section className="relative w-full overflow-hidden" aria-label="Platform preview video">
      <div className="relative h-[52vh] min-h-[300px] w-full sm:h-[62vh] sm:min-h-[400px] lg:h-[80vh] lg:min-h-[600px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/bg.jpg"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />
      </div>
    </section>
  );
}
