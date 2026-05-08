// ─── Books Data ─────────────────────────────────────────────
const books = [
    {
        id: 1,
        title: "THAT ONE DAY",
        author: "Personal Collection",
        cover: "ChatGPT Image May 6, 2026, 10_49_19 PM.png",
        status: "reading",
        rating: 4,
        flipbookUrl: "https://heyzine.com/flip-book/05d20dcb10.html"
    }
];

// ─── DOM Refs ─────────────────────────────────────────────
const bookGrid    = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const emptyState  = document.getElementById('emptyState');
const sectionLabel = document.getElementById('sectionLabel');
const heroStats   = document.getElementById('heroStats');

// ─── Helpers ──────────────────────────────────────────────
function starsHTML(rating) {
    return Array.from({ length: 5 }, (_, i) =>
        `<span class="star ${i < rating ? '' : 'empty'}">★</span>`
    ).join('');
}

function statusLabel(status) {
    return status === 'reading'  ? '📖 Reading'  :
           status === 'finished' ? '✅ Finished' : '💫 Wishlist';
}

// ─── Stats ────────────────────────────────────────────────
function renderStats() {
    const total    = books.length;
    const reading  = books.filter(b => b.status === 'reading').length;
    const finished = books.filter(b => b.status === 'finished').length;

    heroStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-num">${total}</div>
            <div class="stat-lbl">Total Books</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${reading}</div>
            <div class="stat-lbl">Reading</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${finished}</div>
            <div class="stat-lbl">Finished</div>
        </div>
    `;
}

// ─── Render Books ─────────────────────────────────────────
function renderBooks() {
    bookGrid.innerHTML = '';
    const term = searchInput.value.toLowerCase().trim();

    const filtered = books.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)
    );

    sectionLabel.textContent = term
        ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchInput.value}"`
        : `All Books — ${books.length} title${books.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    filtered.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.animationDelay = `${i * 0.07}s`;

        const cover = book.cover
            ? book.cover
            : `https://via.placeholder.com/300x450/1d1b26/5a5670?text=${encodeURIComponent(book.title)}`;

        card.innerHTML = `
            <div class="book-cover-wrap">
                <img src="${cover}" alt="${book.title}" loading="lazy">
                <span class="book-status-tag tag-${book.status}">${statusLabel(book.status)}</span>
            </div>
            <div class="card-info">
                <div class="book-stars">${starsHTML(book.rating || 0)}</div>
                <h3 class="card-title">${book.title}</h3>
                <p class="card-author">${book.author}</p>
                <div class="card-actions">
                    <button class="btn-read"
                        onclick="event.stopPropagation();openReader('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}','${book.flipbookUrl || ''}')">
                        Read
                    </button>
                    <button class="btn-buy"
                        onclick="event.stopPropagation();openCheckout('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}')">
                        Buy
                    </button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

// ─── Navigation ───────────────────────────────────────────
function openReader(title, author, flipbookUrl) {
    const flip = flipbookUrl ? `&flip=${encodeURIComponent(flipbookUrl)}` : '';
    window.location.href = `reader.html?title=${title}&author=${author}${flip}`;
}
function openCheckout(title, author) {
    window.location.href = `checkout.html?title=${title}&author=${author}`;
}

// ─── Search ───────────────────────────────────────────────
searchInput.addEventListener('input', renderBooks);

// ─── Init ─────────────────────────────────────────────────
renderStats();
renderBooks();
