if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

const startBtn = document.getElementById('start-btn');
const statusDiv = document.getElementById('status');
const transcriptTextarea = document.getElementById('transcript');
const editTranscriptBtn = document.getElementById('edit-transcript');
const actionsDiv = document.getElementById('actions');
const copyActionsBtn = document.getElementById('copy-actions');
const createCalendarEventBtn = document.getElementById('create-calendar-event');
const createTodoBtn = document.getElementById('create-todo');
const shareEmailBtn = document.getElementById('share-email');
const summaryDiv = document.getElementById('summary');
const generateSummaryBtn = document.getElementById('generate-summary');

let recognition;
let isRecording = false;
let transcript = '';

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusDiv.textContent = 'Status: Recording...';
        isRecording = true;
        startBtn.textContent = 'Stop Recording';
    };

    recognition.onend = () => {
        statusDiv.textContent = 'Status: Idle';
        isRecording = false;
        startBtn.textContent = 'Start Recording';
    };

    recognition.onresult = (event) => {
        transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        transcriptTextarea.value = transcript;
        extractActions(transcript); // Extract actions from transcript
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
        statusDiv.textContent = 'Status: Error - ' + event.error;
    };
} else {
    alert('Your browser does not support speech recognition.');
}

// Start/Stop Recording
startBtn.addEventListener('click', () => {
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

// Edit Transcript
editTranscriptBtn.addEventListener('click', () => {
    transcriptTextarea.readOnly = !transcriptTextarea.readOnly;
    editTranscriptBtn.textContent = transcriptTextarea.readOnly ? 'Edit Transcript' : 'Save Transcript';
});

// Extract Actions from Transcript
function extractActions(transcript) {
    actionsDiv.innerHTML = ''; // Clear previous actions

    // Extract Tasks (e.g., sentences with "do", "send", "complete")
    const tasks = transcript.match(/(\b\w+\b\s+){1,9}(do|send|complete|prepare|schedule|remind|submit|set)\b[\w\s]*/gi);
    if (tasks) {
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.textContent = `✅ Task: ${task}`;
            actionsDiv.appendChild(taskElement);
        });
    }

    // Extract Dates (improved regex pattern)
    const dates = transcript.match(/\b(\d{1,2}:\d{2}\s*(AM|PM)|\d{1,2}\s*(AM|PM)|next\s+\w+|every\s+\w+|at\s+\d{1,2}:\d{2}\s*(AM|PM)?|by\s+\w+|\d{1,2}\s+\w+\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4})\b/gi);
    if (dates) {
        dates.forEach(date => {
            const dateElement = document.createElement('div');
            dateElement.textContent = `📅 Date: ${date}`;
            actionsDiv.appendChild(dateElement);
        });
    }

    // Extract Key Points (e.g., sentences with "important", "key", "agreed")
    const keyPoints = transcript.match(/(\b\w+\b\s+){1,7}(important|key|agreed|meeting|report|call|team)\b[\w\s]*/gi);
    if (keyPoints) {
        keyPoints.forEach(point => {
            const pointElement = document.createElement('div');
            pointElement.textContent = `🔑 Key Point: ${point}`;
            actionsDiv.appendChild(pointElement);
        });
    }
}


// Copy Actions to Clipboard
copyActionsBtn.addEventListener('click', () => {
    const actionsText = Array.from(actionsDiv.children)
        .map(el => el.textContent)
        .join('\n');
    navigator.clipboard.writeText(actionsText)
        .then(() => alert('Actions copied to clipboard!'))
        .catch(() => alert('Failed to copy actions.'));
});

// Create Calendar Event


// Helper function to format a Date object for Google Calendar
// Helper function to parse natural language dates
function parseDate(dateString) {
    if (dateString.toLowerCase().includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    } else if (dateString.toLowerCase().includes('next')) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 7); // Adjust for "next Monday"
        return nextDay;
    } else {
        // Handle absolute dates like "October 15 at 3:00 p.m."
        const date = new Date(dateString);
        if (isNaN(date)) {
            console.error('Invalid date:', dateString);
            return null;
        }
        return date;
    }
}

// Create Calendar Event
createCalendarEventBtn.addEventListener('click', () => {
    const dates = transcript.match(/\b(\d{1,2}:\d{2}\s*(AM|PM)|next\s+\w+|every\s+\w+|at\s+\d{1,2}:\d{2}\s*(AM|PM)?|by\s+\w+|\d{1,2}\s+\w+\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4})\b/gi);
    console.log('Extracted Dates:', dates); // Debugging: Log extracted dates

    if (dates && dates.length > 0) {
        const eventDate = dates[0]; // Use the first extracted date
        console.log('Event Date:', eventDate); // Debugging: Log the event date

        const eventTitle = prompt('Enter event title:', 'Meeting');
        if (eventTitle) {
            // Parse the extracted date
            const parsedDate = parseDate(eventDate);
            if (parsedDate) {
                const startTime = parsedDate.toISOString().replace(/-|:|\.\d+/g, '');
                const endTime = new Date(parsedDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''); // 1-hour duration
                const eventLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}`;
                console.log('Google Calendar Link:', eventLink); // Debugging: Log the Google Calendar link
                window.open(eventLink, '_blank');
            } else {
                alert('Invalid date format. Please try again.');
            }
        }
    } else {
        alert('No date found in the transcript.');
    }
});

// Create To-Do Item
createTodoBtn.addEventListener('click', () => {
    const tasks = transcript.match(/(remind me to|call|send|complete|prepare)\b[\w\s]+/gi);
    if (tasks) {
        const task = tasks[0]; // Use the first extracted task
        const todoLink = `https://todoist.com/add?content=${encodeURIComponent(task)}`;
        window.open(todoLink, '_blank');
    } else {
        alert('No task found in the transcript.');
    }
});

// Share via Email
shareEmailBtn.addEventListener('click', () => {
    const emailSubject = 'Meeting Notes';
    const emailBody = encodeURIComponent(transcript);
    const emailLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = emailLink;
});

// Generate Meeting Summary
// generateSummaryBtn.addEventListener('click', async () => {
//     const apiKey = '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'; // Replace with your OpenAI API key
//     if (!apiKey) {
//         alert('OpenAI API key is missing. Please add your API key.');
//         return;
//     }

//     if (!transcript) {
//         alert('No transcript found. Please provide a transcript.');
//         return;
//     }

//     try {
//         const response = await fetch('https://api.openai.com/v1/completions', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`
//             },
//             body: JSON.stringify({
//                 model: 'text-davinci-003',
//                 prompt: `Summarize the following meeting transcript in one paragraph:\n\n${transcript}`,
//                 max_tokens: 100
//             })
//         });

//         const data = await response.json();
//         if (response.ok && data.choices && data.choices.length > 0 && data.choices[0].text) {
//             summaryDiv.textContent = data.choices[0].text.trim();
//         } else {
//             summaryDiv.textContent = 'Failed to generate summary. Please try again.';
//         }
//     } catch (error) {
//         console.error('Error generating summary:', error);
//         summaryDiv.textContent = 'Error generating summary. Please check your API key and network connection.';
//     }
// });

generateSummaryBtn.addEventListener('click', async () => {
    const apiKey = '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'; // Replace with your OpenAI API key
    if (!apiKey) {
        alert('OpenAI API key is missing. Please add your API key.');
        return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: `Summarize the following meeting transcript in one paragraph:\n\n${transcript}`,
                max_tokens: 100
            })
        });

        // Log the response for debugging
        console.log('API Response:', response);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Data:', data); // Log the API data

        if (data.choices && data.choices[0]) {
            summaryDiv.textContent = data.choices[0].text.trim();
        } else {
            // Fallback summary method
            const sentences = transcript.split('. '); // Split transcript into sentences
            const summary = sentences.slice(0, 3).join('. ') + '.'; // Use the first 3 sentences as a summary
            summaryDiv.textContent = summary;
        }
    } catch (error) {
        console.error('Error generating summary:', error);
        // Fallback summary method
        const sentences = transcript.split('. '); // Split transcript into sentences
        const summary = sentences.slice(0, 3).join('. ') + '.'; // Use the first 3 sentences as a summary
        summaryDiv.textContent = summary;
    }
});
