const cards = [...document.querySelectorAll('.bar-card')];
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#bar-search');

function displayCards(test) {
  let visible = 0;
  cards.forEach((card) => {
    const matches = test(card);
    card.style.display = matches ? '' : 'none';
    if (matches) visible += 1;
  });
  if (emptyState) emptyState.hidden = visible !== 0;
}

function filterBars() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  displayCards((card) => card.textContent.toLowerCase().includes(query) || card.dataset.tags.toLowerCase().includes(query));
}

function filterBy(tag) {
  if (searchInput) searchInput.value = tag;
  displayCards((card) => card.dataset.tags.includes(tag));
}

function showAll() {
  if (searchInput) searchInput.value = '';
  displayCards(() => true);
}

searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') filterBars();
});
