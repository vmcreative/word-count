// Import required modules for HTTP/HTTPS requests and HTML parsing
const http = require('http');
const https = require('https');
const { parse } = require('node-html-parser');

// Importing the stop words
const stopWords = require('./stopwords');

// Function to fetch HTML content from a given URL asynchronously
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
  const headTag = root.querySelector('head');
  const scriptTags = root.querySelectorAll('script');
  const styleTags = root.querySelectorAll('style');

  // Remove script, style, and head tags to extract only the body text
  headTag.remove();
  scriptTags.forEach((tag) => tag.remove());
  styleTags.forEach((tag) => tag.remove());

  // Extract text content from the remaining elements
  return root.text;
}

// Function to count words in the body text, optionally ignoring common English stop words
function countWords(text, ignoreStopWords = false) {
  const wordCount = {};
  const words = text.toLowerCase().split(/\s+/);

  // Count occurrences of each word, ignoring stop words if specified
  words.forEach((word) => {
    if (ignoreStopWords && stopWords.has(word)) {
      return;
    }
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return wordCount;
}

// Function to get the top words with their counts
function getTopWords(wordCount, limit = 25) {
  const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
  return sortedWords.slice(0, limit);
}

// Main function to process the URL and output top words based on command-line arguments
async function main(url, ignoreStopWords, limit) {
  try {
    // Fetch HTML content from the provided URL
    const html = await fetchHTML(url);

    // Extract text content from HTML excluding script and style tags
    const textContent = extractText(html);

    // Count words in the text content, optionally ignoring stop words
    const wordCount = countWords(textContent, ignoreStopWords);

    // Get the top words with their counts based on the specified limit
    const topWords = getTopWords(wordCount, limit);

    // Output the top words with their counts
    console.log(`Top ${limit} words on the page with their counts:`);
    topWords.forEach(([word, count]) => {
      console.log(`${word}: ${count}`);
    });
  } catch (error) {
    // Handle errors if any occur during the process
    console.error('Error fetching or processing URL:', error.message);
  }
}

// Parse command line arguments to retrieve URL, flag for ignoring stop words, and limit for top words
const args = process.argv.slice(2);
const url = args[0];
const ignoreFlagIndex = args.indexOf('--ignore');
const ignoreStopWords = ignoreFlagIndex !== -1;

// Get the value of the --limit flag or default to 25
const limitFlagIndex = args.indexOf('--limit');
const limit = limitFlagIndex !== -1 ? parseInt(args[limitFlagIndex + 1]) : 25;

// Check if a valid URL is provided, and execute the main function with provided arguments
if (!url) {
  console.error('Please provide a valid URL as an argument.');
} else {
  main(url, ignoreStopWords, limit);
}
