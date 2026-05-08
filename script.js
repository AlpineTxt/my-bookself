// ─── Default Books ───
const defaultBooks = [
    {
        id: 1, title: "The Alchemist", author: "Paulo Coelho",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        status: "finished", rating: 5
    },
    {
        id: 3, title: "Project Hail Mary", author: "Andy Weir",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
        status: "want", rating: 0
    },
    {
        id: 4, title: "THAT ONE DAY", author: "Personal Collection",
        cover: "ChatGPT Image May 6, 2026, 10_49_19 PM.png",
        status: "reading", rating: 4,
        flipbookUrl: "https://heyzine.com/flip-book/05d20dcb10.html"
    }
];

// ─── State ───
let books = JSON.parse(localStorage.getItem('myBookshelf_v2')) || defaultBooks;
// Migrate old data
if (!localStorage.getItem('myBookshelf_v2') && localStorage.getItem('myBookshelf')) {
    const old = JSON.parse(localStorage.getItem('myBookshelf'));
    books = old.map(b => ({ ...b, rating: b.rating || 0 }));
}
let currentFilter = 'all';
let selectedRating = 0;

// ─── DOM ───
const bookGrid = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const modalOverlay = document.getElementById('modalOverlay');
const addBookForm = document.getElementById('addBookForm');
const filterBar = document.getElementById('filterBar');

// ─── Stats ───
function updateStats() {
    document.getElementById('statTotal').textContent = books.length;
    document.getElementById('statReading').textContent = books.filter(b => b.status === 'reading').length;
    document.getElementById('statFinished').textContent = books.filter(b => b.status === 'finished').length;
    document.getElementById('statWant').textContent = books.filter(b => b.status === 'want').length;
}

// ─── Stars HTML ───
function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
    }
    return s;
}

// ─── Render ───
function renderBooks() {
    bookGrid.innerHTML = '';
    const term = searchInput.value.toLowerCase();
    const filtered = books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
        const matchesFilter = currentFilter === 'all' || b.status === currentFilter;
        return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    filtered.forEach((book, i) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.animationDelay = `${i * 0.06}s`;

        const coverSrc = book.cover || 'https://via.placeholder.com/300x450/1a1a2e/c9a84c?text=No+Cover';
        const tagClass = `tag-${book.status}`;
        const statusText = book.status === 'reading' ? '📖 Reading' : book.status === 'finished' ? '✅ Done' : '💫 Wishlist';

        card.innerHTML = `
            <div class="book-cover-wrap">
                <img src="${coverSrc}" alt="${book.title}" loading="lazy">
                <span class="book-status-tag ${tagClass}">${statusText}</span>
                <button class="btn-del" onclick="event.stopPropagation();deleteBook(${book.id})" title="Remove">✕</button>
            </div>
            <div class="card-info">
                <div class="book-stars">${starsHTML(book.rating || 0)}</div>
                <h3 class="card-title">${book.title}</h3>
                <p class="card-author">${book.author}</p>
                <div class="card-actions">
                    <button class="btn-read" onclick="event.stopPropagation();openReader('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}','${book.flipbookUrl || ''}')">Read</button>
                    <button class="btn-buy" onclick="event.stopPropagation();openCheckout('${encodeURIComponent(book.title)}','${encodeURIComponent(book.author)}')">Buy</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

function saveBooks() {
    localStorage.setItem('myBookshelf_v2', JSON.stringify(books));
    updateStats();
    renderBooks();
}

function deleteBook(id) {
    if (confirm('Remove this book from your shelf?')) {
        books = books.filter(b => b.id !== id);
        saveBooks();
    }
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

// ─── Filter Tabs ───
filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderBooks();
});

// ─── Modal ───
function openModal() { modalOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    addBookForm.reset();
    selectedRating = 0;
    document.querySelectorAll('#starInput .star').forEach(s => s.classList.remove('lit'));
}

document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('fabBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

// ─── Star Rating Input ───
document.querySelectorAll('#starInput .star').forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.val);
        document.getElementById('bookRating').value = selectedRating;
        document.querySelectorAll('#starInput .star').forEach((s, i) => {
            s.classList.toggle('lit', i < selectedRating);
        });
    });
    star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.val);
        document.querySelectorAll('#starInput .star').forEach((s, i) => {
            s.classList.toggle('lit', i < val);
        });
    });
});
document.getElementById('starInput').addEventListener('mouseleave', () => {
    document.querySelectorAll('#starInput .star').forEach((s, i) => {
        s.classList.toggle('lit', i < selectedRating);
    });
});

// ─── Add Book Form ───
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const cover = document.getElementById('bookCover').value.trim();
    const status = document.querySelector('input[name="bookStatus"]:checked').value;
    const rating = parseInt(document.getElementById('bookRating').value) || 0;

    const newBook = {
        id: Date.now(),
        title, author,
        cover: cover || '',
        status, rating
    };
    books.unshift(newBook);
    saveBooks();
    closeModal();
});

// ─── Keyboard ───
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

// ─── Init ───
updateStats();
renderBooks();
