# Quiz Maker Application

## Description

This is a simple web application that allows users to create and take quizzes. Users can upload a JSON file containing quiz questions, and the application will generate a unique, shareable quiz page. It also provides an interface to browse existing quizzes.

The application is built using Node.js with Express.js for the backend and plain HTML, CSS, and JavaScript for the frontend.

## Features

*   **Create Quizzes**: Upload a JSON file with questions to generate a new quiz.
*   **Browse Quizzes**: View a list of all created quizzes.
*   **Take Quizzes**: Interactive quiz interface based on the provided HTML template.
*   **Download Questions**: Download the `questions.json` file for any existing quiz.
*   **Automatic Naming**: Handles quiz name collisions by appending a random number if a quiz with the same name exists.
*   **Clean URLs**: Serves quiz pages without `index.html` in the URL.
*   **Server-Side File Management**: Quiz files and folders are created and managed on the server.

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your system.

## Running the Application

1.  **Start the server**:
    ```bash
    node server.js
    ```
2.  Once the server is running, you will see a message like:
    ```
    Quiz app server listening at http://localhost:3000
    ```
3.  **Access the application** by opening your web browser and navigating to:
    *   **Main Page**: `http://localhost:3000/index.html` (or just `http://localhost:3000/`)

## File Structure (Key Files)

*   `server.js`: The main backend Express application logic.
*   `index.html`: The main landing page of the application.
*   `upload.html`: Page for creating new quizzes by uploading a JSON file.
*   `browse.html`: Page for listing and accessing existing quizzes.
*   `quiz_template.html`: The HTML template used for generating individual quiz pages.
*   `style.css`: CSS styles for the main application pages (`index.html`, `upload.html`, `browse.html`).
*   `quizzes/`: Directory where individual quiz folders (each containing an `index.html` and `questions.json`) are stored.
*   `uploads/`: Temporary directory for JSON file uploads during quiz creation.

## How to Create a Quiz

1.  Navigate to the "Create New Quiz" page (`http://localhost:3000/upload.html`).
2.  Enter a name for your quiz.
3.  Prepare your quiz questions in a JSON file. The format should be as follows:
    ```json
    [
      {
        "id": "q1",
        "question": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correctAnswerIndex": 2
      },
      {
        "id": "q2",
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Saturn"],
        "correctAnswerIndex": 1
      }
      // ... more questions
    ]
    ```
    An example prompt for AI to generate this JSON is also provided on the "Create Quiz" page.
4.  Upload your JSON file using the file input.
5.  Click "Generate Quiz Files".
6.  You will be redirected to a success page with a link to your newly created quiz. The quiz files will be saved on the server in the `quizzes/your_quiz_name/` directory.
