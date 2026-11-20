// Закрытие бургер-меню при клике на ссылку
const menuLinks = document.querySelectorAll('nav a');
const menuToggle = document.getElementById('menu-toggle');

// Кнопка наверх
const toTop = document.getElementById('toTop');

// Карточки отзывов
const readMoreBtns = document.querySelectorAll('.read-more-button');
const sortButtons = document.querySelectorAll('.sort-btn');
const grid = document.querySelector('.reviews-grid');

// Фильтрация проектов
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projects article');
let activeFilters = new Set(['all']);

// Футер
const year = document.getElementById('year');


// ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ПУНКТ МЕНЮ
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.checked = false; // Снимаем галочку
    });
});

// КНОПКА НАВЕРХ
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        toTop.classList.remove('hidden');
        toTop.classList.add('flex');
    } else {
        toTop.classList.add('hidden');
        toTop.classList.remove('flex');
    }
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// КНОПКА ЧИТАТЬ ДАЛЬШЕ
readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('article');
        const text = card.querySelector('.review-text');
        
        text.classList.toggle('line-clamp-3');
        btn.textContent = text.classList.contains('line-clamp-3')
        ? 'Читать дальше'
        : 'Свернуть';
    });
});

// СОРТИРОВКА КАРТОЧЕК ОТЗЫВОВ
function sortCards(sortType, direction) {
    const cards = Array.from(grid.children);
    cards.sort((a, b) => {
        if (sortType === 'date') {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return direction === 'desc' ? dateB - dateA : dateA - dateB;
        }
        if (sortType === 'rating') {
            const ratingA = Number(a.dataset.rating);
            const ratingB = Number(b.dataset.rating);
            return direction === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        }
    });
    // Добавляем карточки в грид
    cards.forEach(card => grid.appendChild(card));
}

sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Для активной кнопки
        sortButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const sortType = btn.dataset.sort;
        let direction = btn.dataset.direction;
        
        // Меняем направление
        direction = direction === 'desc' ? 'asc' : 'desc';
        btn.dataset.direction = direction;
        
        // Меняем текст
        if (sortType === 'date') {
            btn.innerHTML = direction === 'desc' ? `&darr;Сначала новые` : `&uarr;Сначала старые`;
        } else {
            btn.innerHTML = direction === 'desc' ? `&darr;Сначала положительные` : `&uarr;Сначала негативные`;
        }
        // Сортируем карточки
        sortCards(sortType, direction);
    });
});

// При загрузке сортировка по дате новые сверху
sortCards('date', 'desc');
document.querySelector('.sort-btn[data-sort="date"]').classList.add('active');


// ФИЛЬТРАЦИЯ ПРОЕКТОВ
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Если кликнули на "Все" — сбрасываем остальные
        if (filter === 'all') {
            activeFilters.clear();
            activeFilters.add('all')
        } else {
            // Если кликнули на тег, убираем "Все"
            activeFilters.delete('all');

            // Переключаем активность тега
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter)
            } else {
                activeFilters.add(filter)
            }

            // Если ничего не выбрано — включаем "Все"
            if (activeFilters.size === 0) {
                activeFilters.add('all')
            }
        }

        // Обновляем стили кнопок
        filterBtns.forEach(b => {
            if (activeFilters.has(b.dataset.filter)) {
                b.classList.add('active', 'bg-teal-50', 'text-teal-700', 'border-teal-200', 'font-bold');
                b.classList.remove('bg-white/60', 'text-slate-700', 'border-white', 'font-medium');
            } else {
                b.classList.remove('active', 'bg-teal-50', 'text-teal-700', 'border-teal-200', 'font-bold');
                b.classList.add('bg-white/60', 'text-slate-700', 'border-white', 'font-medium');
            }
        });

        // Фильтруем карточки
        projectCards.forEach(card => {
            const cardTags = card.dataset.tags.split(' ');

            if (activeFilters.has('all')) {
                card.style.display = '';
            } else {
                // Проверяем, есть ли хотя бы один выбранный тег у карточки
                const hasMatch = Array.from(activeFilters).some(filter => cardTags.includes(filter));
                card.style.display = hasMatch ? '' : 'none';
            }
        });
    });
});

// СКОПИРОВАТЬ АДРЕС В КОНТАКТАХ
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    const tooltip = btn.querySelector('.tooltip');

    navigator.clipboard.writeText(text).then(() => {
      tooltip.textContent = 'Скопировано! ✓';
      setTimeout(() => {
        tooltip.textContent = 'Скопировать адрес';
      }, 2000);
    });
  });
});


// ФУТЕР
year.textContent = new Date().getFullYear();

// Прокрутка в начало
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
