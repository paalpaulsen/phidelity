const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const body = document.body;
const main = document.getElementById('main-content');

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

btnLeft.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleNav('left');
});

btnRight.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleNav('right');
});

// Close mobile navs when clicking content
main.addEventListener('click', () => {
  if (window.innerWidth < 1000) {
    body.classList.remove('mobile-left-open', 'mobile-right-open');
  }
});
