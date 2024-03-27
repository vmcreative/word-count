const http = require('http');
const https = require('https');
const { parse } = require('node-html-parser');

// Function to fetch HTML content from a given URL
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Function to extract text content from HTML excluding script and style tags
function extractText(html) {
    const root = parse(html);
    const scriptTags = root.querySelectorAll('script');
    const styleTags = root.querySelectorAll('style');

    // Remove script and style tags
    scriptTags.forEach((tag) => tag.remove());
    styleTags.forEach((tag) => tag.remove());

    // Extract text content
    return root.text;
}

// Function to count words in text
function countWords(text, ignoreStopWords = false) {
    const wordCount = {};
    const words = text.toLowerCase().split(/\s+/);

    // Common English stop words
    const stopWords = new Set([
        'a', 'an', 'and', 'the', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from', 'by',
        'on', 'off', 'for', 'in', 'out', 'over', 'to', 'into', 'with', 'as'
    ]);

    words.forEach((word) => {
        if (ignoreStopWords && stopWords.has(word)) {
            return;
        }
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return wordCount;
}

// Function to get the top 25 words with their counts
function getTopWords(wordCount) {
    const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
    return sortedWords.slice(0, 25);
}

// Main function to process the URL and output top 25 words
async function main(url, ignoreStopWords) {
    try {
        const html = await fetchHTML(url);
        const textContent = extractText(html);
        const wordCount = countWords(textContent, ignoreStopWords);
        const topWords = getTopWords(wordCount);

        console.log("Top 25 words on the page with their counts:");
        topWords.forEach(([word, count]) => {
            console.log(`${word}: ${count}`);
        });
    } catch (error) {
        console.error('Error fetching or processing URL:', error.message);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const url = args[0];
const ignoreFlagIndex = args.indexOf('--ignore');
const ignoreStopWords = ignoreFlagIndex !== -1;

if (!url) {
    console.error('Please provide a valid URL as an argument.');
} else {
    main(url, ignoreStopWords);
}
