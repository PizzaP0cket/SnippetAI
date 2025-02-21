
let container = null;
let counter = 0;

// Create Html elements when text selected
// TO DO: Optamise function
function showBubble(selectedText) {
    counter++;

    container = document.createElement('div');
    container.className = 'highlight-bubble';
    document.body.appendChild(container);

    let textArea = document.createElement('textarea');
    textArea.value = selectedText;
    textArea.className = 'highlighted-text';
    textArea.id = `selectedText-${counter}`;
    container.appendChild(textArea);

    let genButton = document.createElement('button');
    genButton.innerText = 'Generate Response';
    genButton.className = 'gen-button';
    genButton.addEventListener('click', generateResponse);
    container.appendChild(genButton);

    let range = window.getSelection().getRangeAt(0);
    let rect = range.getBoundingClientRect();

    container.style.left = `${rect.left + window.scrollX}px`;
    container.style.top = `${rect.bottom + window.scrollY + 5}px`;
    container.style.display = 'block';
}

// TO DO: Reset the response when generate button is pressed sequentially
async function generateResponse() {
    let textArea = container.querySelector('textarea');
    if (!textArea) return;

    let responseTextHTML = document.createElement('span');
    responseTextHTML.innerText = 'Loading...';
    container.appendChild(responseTextHTML);

    let response = await fetchGeminiResponse(textArea.value);
    responseTextHTML.innerText = response;
}

// POST request to proxy server
async function fetchGeminiResponse(prompt) {
    const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Keep response brief- ${prompt}` })
    });
    return (await response.json()).response;
}

function hideBubble() {
    // Hide container if the container exists
    if (container) container.style.display = 'none';
}

document.addEventListener('mouseup', (e) => {
    let selectedText = window.getSelection().toString().trim();
    if (e.target.closest('.highlight-bubble')) return; // If clicked container
    if (selectedText) showBubble(selectedText); // If text selected show bubble
    else hideBubble(); // If clicked outside container
});