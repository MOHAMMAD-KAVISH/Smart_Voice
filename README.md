# VoiceKav - Smart Voice Assistant for Professionals

![VoiceKav Logo](icon-512x512.png)



VoiceKav is a **smart voice assistant** designed to help professionals capture action items and key points during meetings. It records voice conversations, transcribes them into text, and extracts actionable information like tasks, dates, and key discussion points. The app also integrates with Google Calendar and email for seamless task management.

---

## **Key Features**

- **Voice Recording and Transcription**:  
  Record voice conversations and transcribe them into text in real-time. Supports English and handles different accents.

- **Action Extraction**:  
  Automatically extracts tasks, meeting details (date, time), and key discussion points from the transcribed text.

- **Action Generation**:  
  - Create Google Calendar events from extracted meeting details.  
  - Generate to-do items with deadlines.  
  - Share key points via email or messaging apps.

- **User-Friendly Interface**:  
  Simple, functional, and mobile-friendly interface with real-time transcription display and editing capabilities.

---

## **Demo**

Watch the [5-minute video demonstration](https://youtu.be/your-video-link) to see VoiceKav in action!

---

## **Technical Architecture**

VoiceKav is built using the following technologies:

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Firebase (for real-time data storage)  
- **APIs**:  
  - Google Speech-to-Text API (for transcription)  
  - OpenAI GPT-3.5/4 (for action extraction)  
  - Google Calendar API (for event creation)  

---

## **Installation**

Follow these steps to set up VoiceKav locally:

### **Prerequisites**
- Node.js (v14 or higher)
- Firebase account (for backend setup)
- Google Cloud account (for Speech-to-Text API)
- OpenAI API key (for action extraction)

### **Usage**
- Open the app and click Start Recording to begin recording a conversation.

- View the transcribed text in real-time.

- Review the extracted actions (tasks, dates, key points).

- Use the buttons to create calendar events, to-do items, or share key points via email.

### **Challenges and Solutions**
- Challenge: Accurate transcription with different accents.
-- Solution: Used Google Speech-to-Text API with accent support.

- Challenge: Extracting dates and times from natural language.
-- Solution: Implemented custom regex patterns and date parsing logic.

- Challenge: Real-time performance on mobile devices.
-- Solution: Optimized the app for mobile with responsive design and lightweight libraries.


### **Contact**
For questions or feedback, feel free to reach out:

Name: Mohammad Kavish

Email: mohammadkavish979@gmail.com

GitHub: https://github.com/MOHAMMAD-KAVISH

Linkedin: https://www.linkedin.com/in/mohammad-kavish/

