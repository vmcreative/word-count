# Top 25 Words Counter

This program takes a URL as input and outputs the top 25 words on that URL along with the number of times each word appears on the page. It supports both HTTP and HTTPS requests and provides an option to ignore common English stop words.

## How to Run

1. Install Node.js if not already installed: [Node.js](https://nodejs.org/)
2. Clone or download this repository.
3. Navigate to the directory containing the source code.
4. Open a terminal window.
5. Run the following command to install dependencies:

    ```
    npm install
    ```

6. To execute the program, use the following command:

    ```
    node index.js [URL] [--ignore]
    ```

    Replace `[URL]` with the URL of the webpage you want to analyze. Optionally, you can include the `--ignore` flag to ignore common English stop words.

## Assumptions

- The program only counts words that appear in the content of the webpage and ignores content within `<script>` and `<style>` tags as well as any HTML tag names.
- The program assumes that the input URL is accessible and returns valid HTML content.
- The common English stop words used for ignoring are limited and may not cover all possible stop words.

## Notes

- The program efficiently fetches HTML content from the provided URL using Node.js `http` and `https` modules.
- It utilizes the `node-html-parser` package to parse HTML and extract text content, excluding script and style tags.
- The implementation uses a simple word counting approach, converting all words to lowercase for case-insensitive counting.
- The code is modularized with separate functions for fetching HTML, extracting text, counting words, and getting the top 25 words.
- Thorough comments are provided throughout the code to explain the functionality and logic.

## Future Improvements

- Improve handling of edge cases such as invalid URLs or non-text content.
- Implement more sophisticated text processing techniques for better word extraction.
- Enhance stop words handling by allowing customization or using more comprehensive stop words lists.
- Add error handling for cases like network errors or invalid responses from the server.
- Implement unit tests to ensure robustness and reliability of the code.

