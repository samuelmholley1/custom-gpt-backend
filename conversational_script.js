
const conversationalScript = {
  greeting: {
    message: "Welcome to Reclaim by Design. I'm an AI assistant that can help you book a free strategy session with Samuel. Would you like to get started?",
    options: [
      { text: "Yes, Let's Do It", next: "interest" },
      { text: "No, Thanks", next: "goodbye" }
    ]
  },
  interest: {
    message: "Great. To make sure we make the most of your time, are you interested in consulting for yourself as an individual, or for your team?",
    options: [
      { text: "Just for Me", next: "calendly" },
      { text: "For My Team", next: "calendly" }
    ]
  },
  calendly: {
    message: "Perfect. Please use the following link to find a time that works for you. After you book, you'll be directed to a brief assessment to prepare for our call.",
    action: "https://calendly.com/your-link" // Replace with the actual Calendly link
  },
  goodbye: {
    message: "No problem at all. If you change your mind, just click on me again. Have a great day!",
    action: "close"
  }
};

// This is a CommonJS module, so we use module.exports.
// If you were using ES modules, you would use 'export default conversationalScript;'.
module.exports = conversationalScript;
