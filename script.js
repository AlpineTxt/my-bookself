// ─── Books Data ───
const books = [
    {
        id: 4,
        title: "THAT ONE DAY",
        author: "Personal Collection",
        cover: "ChatGPT Image May 6, 2026, 10_49_19 PM.png",
        status: "reading",
        rating: 4,
        flipbookUrl: "https://heyzine.com/flip-book/05d20dcb10.html"
    }
];

// ─── DOM ───
const bookGrid   = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const emptyState  = document.getElementById('emptyState');

// ─── Stars HTML ───
function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
    }
    return s;
}

// ─── Render Books ───
function renderBooks() {
    bookGrid.innerHTML = '';
    const term = searchInput.value.toLowerCase();

    const filtered = books.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    filtered.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.animationDelay = `${i * 0.06}s`;

        const coverSrc = book.cover || 'https://via.placeholder.com/300x450/ede9e0/9d9ab5?text=No+Cover';
        const tagClass  = `tag-${book.status}`;
        const statusText =
            book.status === 'reading'  ? '📖 Reading'  :
            book.status === 'finished' ? '✅ Done'     : '💫 Wishlist';

        card.innerHTML = `
            <div class="book-cover-wrap">
                <img src="${coverSrc}" alt="${book.title}" loading="lazy">
                <span class="book-status-tag ${tagClass}">${statusText}</span>
            </div>
            <div class="card-info">
                <div class="book-stars">${starsHTML(book.rating || 0)}</div>
                <h3 class="card-title">${book.title}</h3>
                <p class="card-author">${book.author}</p>
                <div class="card-actions">
                    <button class="btn-read" onclick="event.stopPropagation();openReader('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}','${book.flipbookUrl || ''}')">Read</button>
                    <button class="btn-buy"  onclick="event.stopPropagation();openCheckout('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}')">Buy</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

// ─── Navigation ───
function openReader(title, author, flipbookUrl) {
    const flip = flipbookUrl ? `&flip=${encodeURIComponent(flipbookUrl)}` : '';
    window.location.href = `reader.html?title=${title}&author=${author}${flip}`;
}
function openCheckout(title, author) {
    window.location.href = `checkout.html?title=${title}&author=${author}`;
}

// ─── Search ───
searchInput.addEventListener('input', renderBooks);

// ─── Init ───
renderBooks();
