# Quran Words Tafsir API

This project provides a simple RESTful API to consult and search the tafsir (explanation) of the words of the Holy Quran.

## Features

*   Provides a paginated list of all words and their tafsir.
*   Allows full-text search in words and their tafsir.
*   Filters words by surah number.
*   Uses a PostgreSQL database for efficient data storage.

## Technologies Used

*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [PostgreSQL](https://www.postgresql.org/)
*   [node-postgres (pg)](https://node-postgres.com/)

## Prerequisites

Before you begin, ensure you have the following tools installed on your machine:
*   [Node.js](https://nodejs.org/) (version 14 or higher)
*   [npm](https://www.npmjs.com/) (usually included with Node.js)
*   [PostgreSQL](https://www.postgresql.org/download/)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-user/TafsirWordsAPI.git
    cd TafsirWordsAPI/quran-tafsir-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure the PostgreSQL database:**
    *   Create a new database. For example, `tafsir_db`.

4.  **Configure environment variables:**
    *   Create a `.env` file in the root of the `quran-tafsir-api` folder.
    *   Copy the content below into your `.env` file and replace the values with your own database configuration information.

    ```env
    # .env.example
    DB_USER=your_postgres_user
    DB_HOST=localhost
    DB_DATABASE=tafsir_db
    DB_PASSWORD=your_password
    DB_PORT=5432
    
    PORT=3000
    ```

## Data Import

After configuring your database, you need to import the data from the `tafsir.json` file.
This project uses TypeScript, so you will need `ts-node` to run the import script. `ts-node` is included in the development dependencies, you can run it with `npx`.
make sure to update this row in importData.ts to match the name of the json file you would transform to postgree data :

```bash
const rawData = fs.readFileSync('FileName.json', 'utf-8');
```

or simply create a variable and update it to match the changes.

Run the import script:
```bash
npx ts-node importData.ts
```
This script will create the `words` table and populate it with the necessary data.

## Starting the server

Once the installation and data import are complete, you can start the server using the script defined in `package.json`:

```bash
npm start
```
For development with automatic reloading (using `nodemon`), you can use:
```bash
npm run dev
```

The API will then be accessible at `http://localhost:3000` (or the port you specified in the `.env` file).

## API Endpoints

### `GET /api/words`

Retrieves a paginated list of all words.

*   **Query Parameters:**
    *   `page` (optional): Page number (default: `1`).
    *   `limit` (optional): Number of items per page (default: `50`).

*   **Sample Request:**
    ```
    http://localhost:3000/api/words?page=2&limit=20
    ```

*   **Sample Response:**
    ```json
    {
        "page": 2,
        "limit": 20,
        "total": 6342,
        "total_pages": 318,
        "data": [
            {
                "id": 21,
                "page_number": 4,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 21,
                "word": "اعْبُدُوا",
                "tafsir": "أطيعوا ربكم وانقادوا له وحده دون سواه"
            },
            ...
        ]
    }
    ```

### `GET /api/words/search`

Searches for a term in the words and their tafsir.

*   **Query Parameters:**
    *   `q` (required): The search term.

*   **Sample Request:**
    ```
    http://localhost:3000/api/words/search?q=ربكم
    ```

*   **Sample Response:**
    ```json
    {
        "total_found": 5,
        "data": [
            {
                "id": 21,
                "page_number": 4,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 21,
                "word": "اعْبُدُوا",
                "tafsir": "أطيعوا ربكم وانقادوا له وحده دون سواه"
            },
            ...
        ]
    }
    ```

### `GET /api/words/surah/:surah_number`

Retrieves all the words of a specific surah.

*   **URL Parameters:**
    *   `surah_number` (required): The surah number.

*   **Sample Request:**
    ```
    http://localhost:3000/api/words/surah/2
    ```

*   **Sample Response:**
    ```json
    {
        "surah_number": 2,
        "total_words": 1500,
        "data": [
            {
                "id": 8,
                "page_number": 2,
                "surah_number": 2,
                "surah_name": "البقرة",
                "ayah_number": 2,
                "word": "ذَٰلِكَ",
                "tafsir": "اسم إشارة، والمشار إليه هو القرآن"
            },
            ...
        ]
    }
    ```