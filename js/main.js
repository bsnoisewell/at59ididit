const contactButton = document.querySelector('.contact-toggle');
const contactPanel = document.querySelector('#contact-panel');

const readerWordmark = document.querySelector('body.reader-page .wordmark');

if (readerWordmark && window.parent !== window) {
  readerWordmark.addEventListener('click', (event) => {
    event.preventDefault();
    window.parent.postMessage({ type: 'at59-close-story-overlay', returnToTop: true }, window.location.origin);
  });
}

if (contactButton && contactPanel) {
  const setContactOpen = (isOpen) => {
    contactPanel.hidden = !isOpen;
    contactButton.setAttribute('aria-expanded', String(isOpen));
  };

  contactButton.addEventListener('click', () => {
    setContactOpen(contactPanel.hidden);
  });

  document.addEventListener('pointerdown', (event) => {
    if (!contactPanel.hidden && !contactButton.contains(event.target) && !contactPanel.contains(event.target)) {
      setContactOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !contactPanel.hidden) {
      setContactOpen(false);
      contactButton.focus({ preventScroll: true });
    }
  });
}

const aboutContinue = document.querySelector('.about-continue');
const aboutModal = document.querySelector('#about-full-story');
const aboutModalDialog = document.querySelector('.about-modal-dialog');
const aboutModalClose = document.querySelector('.about-modal-close');

if (aboutContinue && aboutModal && aboutModalDialog && aboutModalClose) {
  let closeTimer;
  let savedScrollY = 0;

  const openFullStory = () => {
    window.clearTimeout(closeTimer);
    savedScrollY = window.scrollY;
    aboutModal.hidden = false;
    aboutModalDialog.scrollTop = 0;
    aboutContinue.setAttribute('aria-expanded', 'true');
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('about-modal-open');
    window.requestAnimationFrame(() => {
      aboutModal.classList.add('is-open');
      aboutModalClose.focus();
    });
  };

  const closeFullStory = () => {
    aboutModal.classList.remove('is-open');
    aboutContinue.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('about-modal-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
    aboutContinue.focus({ preventScroll: true });
    closeTimer = window.setTimeout(() => {
      aboutModal.hidden = true;
    }, 220);
  };

  aboutContinue.addEventListener('click', openFullStory);
  aboutModalClose.addEventListener('click', closeFullStory);

  aboutModal.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
      closeFullStory();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (aboutModal.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeFullStory();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = Array.from(
        aboutModal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        aboutModalDialog.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}

const insideViewAll = document.querySelector('.inside-view-all');
const insideAllStories = document.querySelector('#inside-all-stories');
const insideAllStoriesDialog = document.querySelector('.inside-all-stories-dialog');
const insideAllStoriesClose = document.querySelector('.inside-all-stories-close');

if (insideViewAll && insideAllStories && insideAllStoriesDialog && insideAllStoriesClose) {
  let closeTimer;
  let savedScrollY = 0;

  const openAllStories = () => {
    window.clearTimeout(closeTimer);
    savedScrollY = window.scrollY;
    insideAllStories.hidden = false;
    insideAllStoriesDialog.scrollTop = 0;
    insideViewAll.setAttribute('aria-expanded', 'true');
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('inside-all-stories-open');
    window.requestAnimationFrame(() => {
      insideAllStories.classList.add('is-open');
      insideAllStoriesClose.focus();
    });
  };

  const closeAllStories = () => {
    insideAllStories.classList.remove('is-open');
    insideViewAll.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('inside-all-stories-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
    insideViewAll.focus({ preventScroll: true });
    closeTimer = window.setTimeout(() => {
      insideAllStories.hidden = true;
    }, 180);
  };

  insideViewAll.addEventListener('click', openAllStories);
  insideAllStoriesClose.addEventListener('click', closeAllStories);

  document.addEventListener('keydown', (event) => {
    if (insideAllStories.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeAllStories();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = Array.from(insideAllStories.querySelectorAll('button, a[href]'));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
}
