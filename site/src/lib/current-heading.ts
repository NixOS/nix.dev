/** Shared logic for headings tracking
 *
 * Used by the header and the table of contents.
 * So both show the same active heading at equal scroll pos
 */
export const watchCurrentHeading = (
  headings: HTMLElement[],
  onUpdate: (index: number) => void,
) => {
  let queued = false;

  const update = () => {
    queued = false;
    // A few pixels of slack absorb rounding after a jump to a heading.
    const padding = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const line = (Number.isNaN(padding) ? 0 : padding) + 8;
    let index = -1;
    for (const [i, heading] of headings.entries()) {
      if (heading.getBoundingClientRect().top > line) break;
      index = i;
    }

    const end =
      innerHeight + scrollY >= document.documentElement.scrollHeight - 1;
    const target = headings.findIndex(
      (heading) => heading.id === decodeURIComponent(location.hash.slice(1)),
    );
    if (end && target > index) index = target;

    onUpdate(index);
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("hashchange", schedule);
  update();
};
