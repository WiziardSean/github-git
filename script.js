document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('faq-search');
  const clearBtn = document.getElementById('clear-search');
  const categoryPills = document.querySelectorAll('.pill');
  const faqGroups = document.querySelectorAll('.faq-group');
  const faqCards = document.querySelectorAll('.faq-card');
  const noResults = document.getElementById('no-results');

  let activeCategory = 'all';

  // 1. Live Filter Function
  function filterFAQs() {
    const query = searchInput.value.toLowerCase().trim();
    let totalVisible = 0;

    // Toggle Clear Button
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    faqGroups.forEach((group) => {
      const groupCategory = group.getAttribute('data-category');
      const isCategoryMatch = activeCategory === 'all' || activeCategory === groupCategory;

      let groupVisibleCards = 0;
      const cards = group.querySelectorAll('.faq-card');

      cards.forEach((card) => {
        const questionText = card.querySelector('.faq-question').textContent.toLowerCase();
        const answerText = card.querySelector('.faq-answer').textContent.toLowerCase();

        const isQueryMatch = questionText.includes(query) || answerText.includes(query);

        if (isCategoryMatch && isQueryMatch) {
          card.classList.remove('hidden');
          groupVisibleCards++;
          totalVisible++;

          // Auto-expand card if user is actively searching
          if (query.length > 1) {
            card.setAttribute('open', 'true');
          }
        } else {
          card.classList.add('hidden');
        }
      });

      // Show/Hide group header based on card visibility
      if (groupVisibleCards > 0) {
        group.classList.remove('hidden');
      } else {
        group.classList.add('hidden');
      }
    });

    // Toggle No Results State
    if (totalVisible === 0) {
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
    }
  }

  // 2. Event Listeners for Search Input
  searchInput.addEventListener('input', filterFAQs);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterFAQs();
    searchInput.focus();
  });

  // 3. Event Listeners for Category Pills
  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      categoryPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.getAttribute('data-category');
      filterFAQs();
    });
  });

  // 4. Smooth Accordion Behavior (Only one item open per group at a time)
  faqCards.forEach((card) => {
    card.addEventListener('toggle', (e) => {
      if (card.open && searchInput.value.trim() === '') {
        const parentGroup = card.closest('.faq-group');
        parentGroup.querySelectorAll('.faq-card').forEach((otherCard) => {
          if (otherCard !== card && otherCard.open) {
            otherCard.removeAttribute('open');
          }
        });
      }
    });
  });
});