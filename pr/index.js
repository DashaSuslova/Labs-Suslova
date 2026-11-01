const menuButton = document.querySelector('.header__toggle');
const menu = document.querySelector('#site-menu');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menu.hidden = isOpen;
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('.contact__form').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Thanks! Your form is ready to be connected to a service.');
});

const clientsTrack = document.querySelector('.clients__track');
const clientCards = [...document.querySelectorAll('.client-card')];
let clientsIndex = 0;

function updateClientsCarousel() {
  if (!clientsTrack || !clientCards.length) return;

  const visibleCount = window.matchMedia('(max-width: 480px)').matches
    ? 1
    : window.matchMedia('(max-width: 760px)').matches
      ? 2
      : 3;

  const maxIndex = Math.max(0, clientCards.length - visibleCount);
  clientsIndex = Math.min(clientsIndex, maxIndex);

  const cardWidth = clientCards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(clientsTrack).columnGap) || 0;

  clientsTrack.style.transform =
    `translateX(-${clientsIndex * (cardWidth + gap)}px)`;
}

document.querySelectorAll('.clients__arrow').forEach((button) => {
  button.addEventListener('click', () => {
    const visibleCount = window.matchMedia('(max-width: 480px)').matches
      ? 1
      : window.matchMedia('(max-width: 760px)').matches
        ? 2
        : 3;

    const maxIndex = Math.max(0, clientCards.length - visibleCount);

    if (button.dataset.direction === 'next') {
      clientsIndex = clientsIndex >= maxIndex ? 0 : clientsIndex + 1;
    } else {
      clientsIndex = clientsIndex <= 0 ? maxIndex : clientsIndex - 1;
    }

    updateClientsCarousel();
  });
});

window.addEventListener('resize', updateClientsCarousel);
updateClientsCarousel();
