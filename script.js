const quote = document.getElementById('container');
const quoteText = document.getElementById('text');
const authorText = document.getElementById('author');
const twitterbtn = document.getElementById('twitter-btn');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById("loader");

function showLoadingSpinner() {
    loader.hidden = false;
    quote.hidden = true;
    newQuoteBtn.disabled = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quote.hidden = false;
        loader.hidden = true;
    }
    newQuoteBtn.disabled = false;
}

function showFallbackMessage(msg = "Couldn't fetch a quote") {
    removeLoadingSpinner();
    quoteText.innerText = `${msg}`;
    authorText.innerText = navigator.onLine ? "Please try again." : "You’re offline.";
    newQuoteBtn.innerText = "Retry";
}

async function getQuote() {

    if (getQuote.isRunning) return;

    getQuote.isRunning = true;
    showLoadingSpinner();

    // Fetch quote
    const apiUrl = 'https://dummyjson.com/quotes/random';
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 30000);

    try {
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutTimer);

        if (!response.ok) {
            showFallbackMessage(`OOPS! Server seems to be busy`);
            return;
        }

        const data = await response.json();
        authorText.textContent = (data.author?.trim()) || 'Unknown';
        
        if (data.quote && data.quote.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }

        quoteText.innerText = data.quote || '—';

        removeLoadingSpinner();
        newQuoteBtn.innerText = "New Quote";

    } catch (ex) {
        if (ex.name === "AbortError") {
            showFallbackMessage("Request timed out (30s)");
        } else {
            showFallbackMessage("Network error, please retry");
        }
    } finally {
        clearTimeout(timeoutTimer);
        getQuote.isRunning = false;
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)} - ${encodeURIComponent(author)}`;
    window.open(twitterUrl, '_blank');
}

newQuoteBtn.addEventListener('click', getQuote);
twitterbtn.addEventListener('click', tweetQuote);

getQuote();
