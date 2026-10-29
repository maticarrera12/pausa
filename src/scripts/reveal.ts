const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

// A clip-path'd element has zero visible area, so an observer never sees it.
// Watch its parent instead and reveal the clipped child when the parent shows up.
const watched = new Map<Element, HTMLElement[]>();
targets.forEach((el) => {
  const host = el.dataset.reveal === 'clip' ? (el.parentElement ?? el) : el;
  watched.set(host, [...(watched.get(host) ?? []), el]);
});

if (!('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        watched.get(entry.target)?.forEach((el) => el.classList.add('is-visible'));
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  watched.forEach((_, host) => io.observe(host));
}
