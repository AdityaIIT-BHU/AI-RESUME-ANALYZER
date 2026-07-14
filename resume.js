const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('resumeInput');
const loadingStatus = document.getElementById('loadingStatus');
const resultsSection = document.getElementById('resultsSection');

const atsScoreEl = document.getElementById('atsScore');
const skillsListEl = document.getElementById('skillsList');
const keywordsListEl = document.getElementById('keywordsList');
const suggestionsListEl = document.getElementById('suggestionsList');
const grammarListEl = document.getElementById('grammarList');

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a PDF file first!");
        return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    uploadBtn.disabled = true;
    loadingStatus.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        populateResults(data);
        
        resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze the resume. Make sure your Node.js backend is running!");
    } finally {
        uploadBtn.disabled = false;
        loadingStatus.classList.add('hidden');
    }
});

function populateResults(data) {
    atsScoreEl.textContent = data.atsScore || 0;

    skillsListEl.innerHTML = '';
    keywordsListEl.innerHTML = '';
    suggestionsListEl.innerHTML = '';
    grammarListEl.innerHTML = '';

    if (data.skills) {
        data.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsListEl.appendChild(li);
        });
    }

    if (data.missingKeywords) {
        data.missingKeywords.forEach(keyword => {
            const li = document.createElement('li');
            li.textContent = keyword;
            keywordsListEl.appendChild(li);
        });
    }

    if (data.suggestions) {
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsListEl.appendChild(li);
        });
    }

    if (data.grammarMistakes) {
        data.grammarMistakes.forEach(mistake => {
            const li = document.createElement('li');
            li.textContent = mistake;
            grammarListEl.appendChild(li);
        });
    }
}