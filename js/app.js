const body = document.body;
const phiMain = document.querySelector('phi-main');

const toggleNav = (side) => {
  const isMobile = window.innerWidth < 1000;

  if (isMobile) {
    // Mobile Logic (Exclusive Toggles)
    if (side === 'left') {
      body.classList.toggle('mobile-left-open');
      body.classList.remove('mobile-right-open');
    } else {
      body.classList.toggle('mobile-right-open');
      body.classList.remove('mobile-left-open');
    }
  } else {
    // Desktop Logic (Independent Toggles)
    if (side === 'left') body.classList.toggle('left-closed');
    if (side === 'right') body.classList.toggle('right-open');
  }
};

// Listen for custom events from phi-header
body.addEventListener('toggle-left-nav', () => toggleNav('left'));
body.addEventListener('toggle-right-nav', () => toggleNav('right'));

// Close mobile navs when clicking content
if (phiMain) {
  phiMain.addEventListener('click', () => {
    if (window.innerWidth < 1000) {
      body.classList.remove('mobile-left-open', 'mobile-right-open');
    }
  });
}
