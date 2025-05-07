const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra'); // fs-extra for ensureDirSync

const app = express();
const port = 3000;

// --- Multer Configuration for file uploads ---
// We'll store uploaded JSON files temporarily before processing
const upload = multer({ dest: 'uploads/' }); 
fs.ensureDirSync('uploads'); // Ensure uploads directory exists
fs.ensureDirSync(path.join(__dirname, 'quizzes')); // Ensure quizzes directory exists

// --- Middleware ---
app.use(express.static(path.join(__dirname))); // Serve static files from the root (for HTML, CSS)
app.use('/quizzes', express.static(path.join(__dirname, 'quizzes'))); // Serve individual quiz folders

// --- Helper Function ---
function sanitizeQuizNameForFolderName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/__+/g, '_');
}

// --- API Routes ---

// Endpoint to create a new quiz
app.post('/create-quiz', upload.single('jsonFile'), async (req, res) => {
    let quizName = req.body.quizName; // Use 'let' as it might be modified
    const jsonFile = req.file;

    if (!quizName) {
        return res.status(400).send('Quiz name is required.');
    }
    if (!jsonFile) {
        return res.status(400).send('JSON file is required.');
    }

    let originalQuizName = quizName; // Keep original for messages if modified
    let folderName = sanitizeQuizNameForFolderName(quizName);
    let quizFolderPath = path.join(__dirname, 'quizzes', folderName);
    let attempt = 0;
    const maxAttempts = 10; // Prevent infinite loop in unlikely scenario

    // Check for existing quiz and append random number if collision
    while (await fs.pathExists(quizFolderPath) && attempt < maxAttempts) {
        attempt++;
        const randomNumber = Math.floor(Math.random() * 1000); // 0-999
        quizName = `${originalQuizName}_${randomNumber}`; // Modify the quizName for display and title
        folderName = sanitizeQuizNameForFolderName(quizName); // Re-sanitize the new quizName
        quizFolderPath = path.join(__dirname, 'quizzes', folderName);
    }

    if (await fs.pathExists(quizFolderPath) && attempt >= maxAttempts) {
        // Extremely unlikely, but good to handle
        await fs.remove(jsonFile.path).catch(err => console.error("Failed to remove temp file:", err));
        return res.status(500).send('Could not create a unique quiz name after several attempts. Please try a different name.');
    }

    try {
        await fs.ensureDir(quizFolderPath); // Create quiz subfolder

        // Read the uploaded JSON file content
        const jsonFileContent = await fs.readFile(jsonFile.path, 'utf-8');
        try {
            JSON.parse(jsonFileContent); // Validate JSON
        } catch (e) {
            await fs.remove(jsonFile.path); // Clean up uploaded file
            return res.status(400).send(`Invalid JSON file content: ${e.message}`);
        }

        // Save questions.json
        await fs.writeFile(path.join(quizFolderPath, 'questions.json'), jsonFileContent);

        // Read and process quiz_template.html
        // Use the potentially modified quizName for the title and H1
        let quizHtmlContent = await fs.readFile(path.join(__dirname, 'quiz_template.html'), 'utf-8');
        quizHtmlContent = quizHtmlContent.replace(/<title>.*?<\/title>/, `<title>${quizName}</title>`);
        quizHtmlContent = quizHtmlContent.replace(/<h1>.*?<\/h1>/, `<h1>🚀 ${quizName} 🚀</h1>`);
        
        // Save index.html for the quiz
        await fs.writeFile(path.join(quizFolderPath, 'index.html'), quizHtmlContent);

        await fs.remove(jsonFile.path); // Clean up original uploaded file from 'uploads/'

        // Use the final quizName (which might have a number appended) in the success message
        let successMessage = `Your quiz "<strong>${quizName}</strong>" is ready.`;
        if (quizName !== originalQuizName) {
            successMessage = `A quiz with the name "${originalQuizName}" already existed. Your quiz has been saved as "<strong>${quizName}</strong>".`;
        }

        // Send a success response or redirect
        const successHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quiz Created!</title>
                <link rel="stylesheet" href="/style.css"> 
                <style>
                    body { display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
                    .success-container { background-color: var(--container-bg); padding: 40px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
                    .success-container h1 { color: #2ecc71; margin-bottom: 20px; }
                    .success-container p { margin-bottom: 30px; font-size: 1.1em; }
                    .success-container a { margin: 0 10px; padding: 12px 20px; text-decoration: none; border-radius: 5px; color: white; font-weight: bold; }
                    .view-quiz-btn { background-color: #2ecc71; }
                    .view-quiz-btn:hover { background-color: #27ae60; }
                    .other-actions-btn { background-color: #3498db; }
                    .other-actions-btn:hover { background-color: #2980b9; }
                </style>
            </head>
            <body>
                <div class="success-container">
                    <h1>🎉 Quiz Created Successfully! 🎉</h1>
                    <p>${successMessage}</p>
                    <a href="/quizzes/${folderName}/" target="_blank" class="view-quiz-btn">View Quiz</a>
                    <a href="/upload.html" class="other-actions-btn">Create Another Quiz</a>
                    <a href="/browse.html" class="other-actions-btn">Browse Quizzes</a>
                </div>
            </body>
            </html>
        `;
        res.send(successHtml);

    } catch (error) {
        console.error('Error creating quiz:', error);
        if (jsonFile && jsonFile.path) {
            await fs.remove(jsonFile.path).catch(err => console.error("Failed to remove temp file:", err)); // Clean up temp file on error
        }
        res.status(500).send('Error creating quiz. ' + error.message);
    }
});

// Endpoint to download a quiz's questions.json
app.get('/download-quiz-json/:quizFolderName', async (req, res) => {
    const quizFolderName = req.params.quizFolderName;
    // Basic sanitization for folder name to prevent directory traversal
    if (quizFolderName.includes('..') || quizFolderName.includes('/')) {
        return res.status(400).send('Invalid quiz folder name.');
    }
    const filePath = path.join(__dirname, 'quizzes', quizFolderName, 'questions.json');

    try {
        // Check if file exists
        if (await fs.pathExists(filePath)) {
            res.download(filePath, 'questions.json', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    // Check if headers were already sent
                    if (!res.headersSent) {
                        res.status(500).send('Could not download the file.');
                    }
                }
            });
        } else {
            res.status(404).send('Questions file not found for this quiz.');
        }
    } catch (error) {
        console.error('Error accessing file for download:', error);
        if (!res.headersSent) {
            res.status(500).send('Error accessing the file.');
        }
    }
});

// Endpoint to list available quizzes
app.get('/list-quizzes', async (req, res) => {
    const quizzesDir = path.join(__dirname, 'quizzes');
    try {
        const entries = await fs.readdir(quizzesDir, { withFileTypes: true });
        const quizFolders = await Promise.all(entries // Make this an async map
            .filter(dirent => dirent.isDirectory())
            .map(async dirent => { // dirent.name is the folderName
                let displayName = dirent.name.replace(/_/g, ' '); // Default display name
                
                // Attempt to read the original quiz name from the title tag of its index.html
                // This is a simple way to get a more user-friendly display name if it was modified
                try {
                    const quizIndexPath = path.join(quizzesDir, dirent.name, 'index.html');
                    if (await fs.pathExists(quizIndexPath)) {
                        const htmlContent = await fs.readFile(quizIndexPath, 'utf-8');
                        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                        if (titleMatch && titleMatch[1]) {
                            displayName = titleMatch[1];
                        }
                    }
                } catch (e) {
                    // console.warn(`Could not read title for quiz ${dirent.name}: ${e.message}`);
                    // Keep default displayName if error
                }

                return {
                    folderName: dirent.name, 
                    displayName: displayName,
                    viewQuizUrl: `/quizzes/${dirent.name}/`, 
                    downloadJsonUrl: `/download-quiz-json/${dirent.name}`
                };
            }));
        res.json(quizFolders);
    } catch (error) {
        console.error('Error listing quizzes:', error);
        if (error.code === 'ENOENT') { // Quizzes directory doesn't exist
            return res.json([]);
        }
        res.status(500).send('Error listing quizzes.');
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Quiz app server listening at http://localhost:${port}`);
});
