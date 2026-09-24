const storyTriggers = document.querySelectorAll('.story-overlay-trigger');
const storyDialog = document.querySelector('.story-overlay');
const storyFrame = storyDialog?.querySelector('iframe');
const storyClose = storyDialog?.querySelector('.story-overlay-close');

if (storyTriggers.length && storyDialog && storyFrame && storyClose && typeof storyDialog.showModal === 'function') {
  let savedScrollY = 0;
  let activeTrigger = null;
  let closeToTop = false;
  let clearFrameOnClose = false;
  const tocLabels = { ko: '목차', en: 'Table of Contents', fr: 'Sommaire', es: 'Índice', de: 'Inhaltsverzeichnis', ja: '目次' };
  const pageLanguage = document.documentElement.lang.toLowerCase().split('-')[0];
  const tocLabel = tocLabels[pageLanguage] || tocLabels.ko;

  storyTriggers.forEach((storyTrigger) => {
    storyTrigger.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      activeTrigger = storyTrigger;
      savedScrollY = window.scrollY;
      storyDialog.showModal();
      document.body.style.top = `-${savedScrollY}px`;
      document.body.classList.add('story-overlay-open');
      const chapterNumber = storyTrigger.querySelector('.inside-chapter-number, .toc-number')?.textContent.trim()
        || storyTrigger.href.match(/stories\/(\d{2})\.html/)?.[1];
      const chapterTitle = storyTrigger.querySelector('.inside-title > span:last-child, .toc-label, .inside-book1-chapter-title')?.textContent.trim();
      const bookNumber = storyTrigger.href.match(/experience-0([123])\//)?.[1] || '1';
      storyFrame.title = chapterNumber && chapterTitle
        ? `BOOK #0${bookNumber} · ${chapterNumber}. ${chapterTitle}`
        : `BOOK #0${bookNumber} · ${tocLabel}`;
      storyFrame.src = storyTrigger.href;
      storyClose.focus({ preventScroll: true });
    });
  });

  storyClose.addEventListener('click', () => storyDialog.close());

  storyDialog.addEventListener('click', (event) => {
    if (event.target !== storyDialog) return;
    const bounds = storyDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      storyDialog.close();
    }
  });

  storyFrame.addEventListener('load', () => {
    try {
      storyFrame.contentDocument.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && storyDialog.open) {
          event.preventDefault();
          storyDialog.close();
        }
      });
    } catch {
      // The native dialog still handles Escape when the iframe is inaccessible.
    }
  });

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.source !== storyFrame.contentWindow) return;
    if (event.data?.type !== 'at59-close-story-overlay' || !storyDialog.open) return;

    closeToTop = event.data.returnToTop === true;
    clearFrameOnClose = true;
    storyDialog.close();
  });

  storyDialog.addEventListener('close', () => {
    document.body.classList.remove('story-overlay-open');
    document.body.style.top = '';
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, closeToTop ? 0 : savedScrollY);
    document.documentElement.style.scrollBehavior = previousBehavior;
    if (clearFrameOnClose) {
      storyFrame.removeAttribute('src');
    } else {
      activeTrigger?.focus({ preventScroll: true });
    }
    closeToTop = false;
    clearFrameOnClose = false;
  });
}
