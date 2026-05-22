// ─── Your Books ───────────────────────────────────────────────
const books = [
    {
        id: 1,
        title: "THAT ONE DAY",
        cover: "that-one-day.png",
        flipbookUrl: "https://heyzine.com/flip-book/05d20dcb10.html",
        buyUrl: "https://www.amazon.com/dp/B0H1GRGXNZ"
    },
    {
        id: 2,
        title: "সেই এক দিন",
        cover: "sei-ek-din.png",
        flipbookUrl: "https://heyzine.com/flip-book/2377ff2840.html",
        buyUrl: "https://www.amazon.co.uk/dp/B0H1GRGXNZ"
    },
    {
        id: 3,
        title: "WHY WE STAY WHY WE LEAVE",
       
        cover: "WHY WE STAY WHY WE LEAVE.png",
        flipbookUrl: "https://heyzine.com/flip-book/3039b6c5cc.html",
        buyUrl: "https://www.amazon.com/dp/B0H1D2MPC7"
    },  
    {
        id: 4,
        title: "THE ALCHEMIST",
        author: "Paulo Coelho",
        cover: "images.webp",
        flipbookUrl: "",
        buyUrl: "https://www.amazon.in/Alchemist-Paulo-Coelho/dp/8172234988?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A1WYWER0W24N8S"
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
            ${book.author ? `<p class="book-author">${book.author}</p>` : ''}
            ${book.flipbookUrl ? `<button class="btn-read" onclick="readBook(${i})">Read Now</button>` : ''}
            <button class="btn-buy"  onclick="buyBook('${book.buyUrl || ''}', '${encodeURIComponent(book.title)}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });
}

// ─── Actions ──────────────────────────────────────────────────
function readBook(index) {
    const book = books[index];
    if (book && book.flipbookUrl) {
        const url = `reader.html?flip=${encodeURIComponent(book.flipbookUrl)}&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author || '')}`;
        window.location.href = url;
    }
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
