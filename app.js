document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const outputDiv = document.getElementById('output');
    const instructionsDiv = document.getElementById('instructions');
    const quizListDiv = document.getElementById('quiz-list');

    const QUIZZES_LS_KEY = 'userQuizzes';

    function getStoredQuizzes() {
        return JSON.parse(localStorage.getItem(QUIZZES_LS_KEY)) || [];
    }

    function storeQuiz(quizName) {
        const quizzes = getStoredQuizzes();
        if (!quizzes.includes(quizName)) {
            quizzes.push(quizName);
            localStorage.setItem(QUIZZES_LS_KEY, JSON.stringify(quizzes));
        }
    }

    function sanitizeQuizNameForFolderName(name) {
        return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/__+/g, '_');
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            outputDiv.innerHTML = '';
            instructionsDiv.innerHTML = '';

            const quizNameInput = document.getElementById('quizName');
            const jsonFileInput = document.getElementById('jsonFile');

            const quizName = quizNameInput.value.trim();
            const file = jsonFileInput.files[0];

            if (!quizName) {
                outputDiv.innerHTML = '<p style="color: #e74c3c;">Please enter a quiz name.</p>';
                return;
            }
            if (!file) {
                outputDiv.innerHTML = '<p style="color: #e74c3c;">Please select a JSON file.</p>';
                return;
            }
            if (file.type !== 'application/json') {
                outputDiv.innerHTML = '<p style="color: #e74c3c;">Please upload a valid .json file.</p>';
                return;
            }

            const folderName = sanitizeQuizNameForFolderName(quizName);

            try {
                const jsonFileContent = await file.text();
                // Validate JSON structure (basic check)
                try {
                    JSON.parse(jsonFileContent);
                } catch (e) {
                    outputDiv.innerHTML = `<p style="color: #e74c3c;">Invalid JSON file content: ${e.message}</p>`;
                    return;
                }

                // Fetch the quiz template
                const templateResponse = await fetch('quiz_template.html');
                if (!templateResponse.ok) {
                    throw new Error('Failed to load quiz_template.html. Make sure it is in the same directory as app.js.');
                }
                let quizHtmlContent = await templateResponse.text();

                // Modify title and H1 in the template
                quizHtmlContent = quizHtmlContent.replace(/<title>.*?<\/title>/, `<title>${quizName}</title>`);
                quizHtmlContent = quizHtmlContent.replace(/<h1>.*?<\/h1>/, `<h1>🚀 ${quizName} 🚀</h1>`);


                // Create download link for questions.json
                const qBlob = new Blob([jsonFileContent], { type: 'application/json' });
                const qUrl = URL.createObjectURL(qBlob);
                const qLink = document.createElement('a');
                qLink.href = qUrl;
                qLink.download = 'questions.json';
                qLink.textContent = 'Download questions.json';
                outputDiv.appendChild(qLink);

                // Create download link for index.html (the quiz page)
                const htmlBlob = new Blob([quizHtmlContent], { type: 'text/html' });
                const htmlUrl = URL.createObjectURL(htmlBlob);
                const htmlLink = document.createElement('a');
                htmlLink.href = htmlUrl;
                htmlLink.download = 'index.html';
                htmlLink.textContent = 'Download quiz page (index.html)';
                outputDiv.appendChild(htmlLink);

                instructionsDiv.innerHTML = `
                    <p><strong>Setup Instructions:</strong></p>
                    <ol style="text-align: left; padding-left: 20px;">
                        <li>Create a main folder named <code>quizzes</code> in the same directory as this application (<code>c:\\Users\\matej\\Desktop\\quiz\\quizzes\\</code>), if it doesn't exist.</li>
                        <li>Inside the <code>quizzes</code> folder, create a new subfolder named <code><strong>${folderName}</strong></code>.</li>
                        <li>Download both files provided above (<code>questions.json</code> and <code>index.html</code>).</li>
                        <li>Place both downloaded files directly into the <code>quizzes/${folderName}/</code> folder.</li>
                        <li>Once done, you can access your quiz at a path like: <code>.../quiz/quizzes/${folderName}/index.html</code> or through the "Browse Quizzes" page.</li>
                    </ol>
                `;
                
                storeQuiz(quizName); // Store original name for browsing
                quizNameInput.value = ''; // Clear input
                jsonFileInput.value = ''; // Clear file input

            } catch (error) {
                outputDiv.innerHTML = `<p style="color: #e74c3c;">Error: ${error.message}</p>`;
                console.error(error);
            }
        });
    }

    if (quizListDiv) {
        const quizzes = getStoredQuizzes();
        if (quizzes.length === 0) {
            quizListDiv.innerHTML = '<p>No quizzes created yet. Go to "Create New Quiz" to make one!</p>';
        } else {
            const ul = document.createElement('ul');
            quizzes.forEach(quizName => {
                const folderName = sanitizeQuizNameForFolderName(quizName);
                const li = document.createElement('li');
                const a = document.createElement('a');
                // Assumes quizzes are in a 'quizzes' subdirectory relative to the main index.html
                // For local file system, this path needs to be correct.
                // If serving, it's relative to the server root or current page.
                a.href = `quizzes/${folderName}/index.html`; 
                a.textContent = quizName;
                a.target = "_blank"; // Open in new tab
                li.appendChild(a);
                ul.appendChild(li);
            });
            quizListDiv.innerHTML = ''; // Clear "Loading..."
            quizListDiv.appendChild(ul);
            quizListDiv.innerHTML += `<p style="font-size:0.9em; margin-top:15px;">Note: These links will only work if you have correctly created the folder structure and placed the files as per the instructions during quiz generation.</p>`;
        }
    }
});
