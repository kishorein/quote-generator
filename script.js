const quote = document.getElementById('container');
const quoteText = document.getElementById('text');
const authorText = document.getElementById('author');
const twitterbtn = document.getElementById('twitter-btn');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById("loader");


function showLoadingSpinner() {
    loader.hidden = false;
    quote.hidden = true;
}

function removeLoadingSpinner() { 
    if(!loader.hidden) {
        quote.hidden = false;
        loader.hidden = true;
    }
}

async function getQuote() {
    showLoadingSpinner();
    const apiUrl = 'https://type.fit/api/quotes';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const quote = data[Math.floor(Math.random() * data.length)];
            if (data.quoteAuthor === '') {
                authorText.textContent = 'Unknown author';
            } else {
                authorText.textContent = quote.author;
            }

            if(quote.length > 120) {
                quoteText.classList.add('long-quote');
            } else {
                quoteText.classList.remove('long-quote');
            }
            quoteText.innerText = quote.text;
            removeLoadingSpinner();
        }
        catch(error) {
            console.log(error);
            getQuote();  
        }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} Author: ${author}`;
    window.open(twitterUrl,'_blank');
}

newQuoteBtn.addEventListener('click',getQuote);
twitterbtn.addEventListener('click',tweetQuote);
getQuote();

