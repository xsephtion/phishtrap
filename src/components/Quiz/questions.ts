export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  correctChoiceIndex: number;
};

export function generatePhishingQuiz(count: number = 10): Question[] {
  const allQuestions: Question[] = [
    {
      id: "q1",
      prompt:
        "Which of the following is a common indicator of a phishing email?",
      choices: [
        "Grammatical errors and strange phrasing",
        "Professional layout and logo usage",
        "Short message with no links",
        "Email from your coworker",
      ],
      correctChoiceIndex: 0,
    },
    {
      id: "q2",
      prompt: "A legitimate company email is unlikely to:",
      choices: [
        "Include your name and account number",
        "Request your login credentials via email",
        "Have a company domain in the sender's address",
        "Include a help/support link",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q3",
      prompt: "Before clicking a link in an email, you should:",
      choices: [
        "Click it quickly before it expires",
        "Hover over it to verify the actual URL",
        "Forward it to IT without checking",
        "Assume it's safe if it looks professional",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q4",
      prompt: "Phishing emails often try to scare you by:",
      choices: [
        "Offering free software",
        "Sending inspirational quotes",
        "Claiming your account will be locked",
        "Sending you receipts",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q5",
      prompt: "Which URL is most likely legitimate?",
      choices: [
        "https://paypal.secure-login.com",
        "https://login.paypa1.com",
        "https://paypal.com/account",
        "https://paypal.verify-now.ru",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q6",
      prompt: "What should you do if you suspect a phishing email?",
      choices: [
        "Delete it immediately",
        "Reply and ask if it's real",
        "Click the link to check the website",
        "Report it to your IT/security team",
      ],
      correctChoiceIndex: 3,
    },
    {
      id: "q7",
      prompt: "Which of these is a red flag in a login page?",
      choices: [
        "It uses HTTPS",
        "It looks identical to the official page",
        "The URL is slightly misspelled",
        "It has a login form",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q8",
      prompt: "An email with an urgent request to send money is likely:",
      choices: [
        "Important and should be acted on",
        "Phishing or a business email compromise (BEC)",
        "From your manager",
        "Safe if the signature looks correct",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q9",
      prompt: "What is 'spear phishing'?",
      choices: [
        "Random phishing emails sent to thousands of people",
        "Phishing targeting a specific individual or company",
        "A type of software",
        "A physical USB attack",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q10",
      prompt: "What is a common phishing tactic involving attachments?",
      choices: [
        "Sending high-resolution images",
        "Sending resumes with malware",
        "Sending a PDF of terms and conditions",
        "Sending MP3 files",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q11",
      prompt: "Which of the following is safest?",
      choices: [
        "Clicking email links to reset your password",
        "Searching for the site and navigating manually",
        "Using password reset links from SMS",
        "Clicking links in urgent warning emails",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q12",
      prompt: "You receive an email from 'support@amaz0n.com'. What do you do?",
      choices: [
        "Click the link to check your account",
        "Reply and ask for more info",
        "Ignore it completely",
        "Verify the domain and report if suspicious",
      ],
      correctChoiceIndex: 3,
    },
    {
      id: "q13",
      prompt: "Which is the BEST way to verify a suspicious email?",
      choices: [
        "Call the sender using known contact info",
        "Reply asking if it's legit",
        "Click the link to see if it works",
        "Forward it to coworkers to warn them",
      ],
      correctChoiceIndex: 0,
    },
    {
      id: "q14",
      prompt: "A phishing site may still have:",
      choices: [
        "A padlock/HTTPS symbol",
        "No spelling errors",
        "Real images from the brand",
        "All of the above",
      ],
      correctChoiceIndex: 3,
    },
    {
      id: "q15",
      prompt: "Phishing via SMS is called:",
      choices: ["Fishing", "Spoofing", "Smishing", "Sniffing"],
      correctChoiceIndex: 2,
    },
    {
      id: "q16",
      prompt: "Why should you avoid opening unexpected attachments?",
      choices: [
        "They may be boring",
        "They might be too large",
        "They can contain malware or ransomware",
        "They might require new software",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q17",
      prompt: "What is one way to recognize a spoofed sender address?",
      choices: [
        "It ends in .com",
        "It contains extra characters or misspellings",
        "It includes your name",
        "It has a company logo",
      ],
      correctChoiceIndex: 1,
    },
    {
      id: "q18",
      prompt:
        "If a website asks for personal info it shouldn't need, it could be:",
      choices: [
        "A security update",
        "A loyalty program",
        "A phishing site",
        "A normal request",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q19",
      prompt: "An email from your CEO asks for gift cards. What's your move?",
      choices: [
        "Send them quickly",
        "Ignore it",
        "Check the tone and verify through another channel",
        "Forward it to HR",
      ],
      correctChoiceIndex: 2,
    },
    {
      id: "q20",
      prompt: "Which behavior reduces phishing risk?",
      choices: [
        "Using the same password everywhere",
        "Using multi-factor authentication (MFA)",
        "Saving passwords in plain text",
        "Using public Wi-Fi without a VPN",
      ],
      correctChoiceIndex: 1,
    },
  ];

  // Shuffle and return a slice (up to 20)
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allQuestions.length));
}
