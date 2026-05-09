// ─── Your Books ───────────────────────────────────────────────
const books = [
    {
        id: 1,
        title: "THAT ONE DAY",
        cover: "ChatGPT Image May 6, 2026, 10_49_19 PM.png",
        flipbookUrl: "https://heyzine.com/flip-book/05d20dcb10.html",
        buyUrl: ""
    },
    {
        id: 2,
        title: "সেই এক দিন",
        cover: "ChatGPT Image May 6, 2026, 10_48_49 PM.png",
        flipbookUrl: "https://heyzine.com/flip-book/2377ff2840.html",
        buyUrl: ""
    }
];

// ─── DOM ──────────────────────────────────────────────────────
const grid       = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const emptyState  = document.getElementById('emptyState');

// ─── Render ───────────────────────────────────────────────────
function render() {
    grid.innerHTML = '';
    const term = searchInput.value.toLowerCase().trim();
    const list = term ? books.filter(b => b.title.toLowerCase().includes(term)) : books;

    if (list.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    list.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.animationDelay = `${i * 0.08}s`;

        const coverSrc = book.cover || '';

        card.innerHTML = `
            <div class="book-cover">
                <img src="${coverSrc}" alt="${book.title}" loading="lazy"
                     onerror="this.style.display='none'">
            </div>
            <h2 class="book-title">${book.title}</h2>
            <button class="btn-read" onclick="readBook('${book.flipbookUrl}')">Read Now</button>
            <button class="btn-buy"  onclick="buyBook('${book.buyUrl || ''}', '${encodeURIComponent(book.title)}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });
}

// ─── Actions ──────────────────────────────────────────────────
function readBook(url) {
    if (url) window.open(url, '_blank');
}
function buyBook(url, title) {
    if (url) {
        window.open(url, '_blank');
    } else {
        window.open(`https://www.google.com/search?q=buy+${title}+book`, '_blank');
    }
}

// ─── Search ───────────────────────────────────────────────────
searchInput.addEventListener('input', render);

// ─── Init ─────────────────────────────────────────────────────
render();
