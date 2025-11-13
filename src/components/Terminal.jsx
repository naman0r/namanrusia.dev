"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaTerminal,
  FaTimes,
  FaMinus,
  FaExpand,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaGamepad,
  FaLaptopCode,
  FaCoffee,
  FaStar,
  FaSpotify,
} from "react-icons/fa";

// Temporary project data store (Ideally fetch or import)
const projectsData = [
  {
    title: "MindfulMomentum",
    description:
      "A Smart, Productivity, habits, and journalism app. Built with user security and scalability in mind. Works with a Chrome Extension , which has a focus mode and task sync feature. Deployed with Vercel (frontend) and Railway (backend).",
    date: "March 2025",
  },
  {
    title: "AMA Automator - Internal Tooling",
    description:
      "Developed a full stack web app for TAMID at Northeastern to help with automating the Ask-me-anything process- which is held on slack. Impelemented Auth, used Slack Webhooks to create a slack agent.",
    date: "March 2025",
  },
  {
    title: "MindMapr: AI powered Study Tool",
    description:
      "A Full Stack AI powered study tool that generates easy to understand visualizations from student's study notes. Authentication implemented, MongoDB database.",
    date: "Jan-March 2025",
  },
  {
    title: "BackBuddy App",
    description:
      "App-integrated Arduino Product that helps users improve and track their posture. Fits on any chair. Works with Pressure Values which inflate and deflate to correct posture. App connects with hardware with an HC-5 BLE Module. ",
    date: "Spring 2025",
  },
  {
    title: "Car2Drvr",
    description:
      "A full stack App that allows users to find tailored reccomendations for cars to buy based on their needs and provides a price range that informs the user and prevents overpaying",
    date: "January 2025",
  },
  {
    title: "NUtrition",
    description:
      "Full Stack app that scrapes nutritional information from the University Dining Hall wesbite, and users are allowed to keep detailed logs and track their meals and diet over time, and realize trends",
    date: "Spring 2025",
  },
  {
    title: "TaNews",
    description:
      "Full Stack news app with posting, reading, liking, Admin and User separation, etc.",
    date: "Spring 2025",
  },
  {
    title: "Personal Website",
    description:
      "Interractive, easy to use personal website to showcase my work. Built with React.js",
    date: "December 2024",
  },
  {
    title: "DoNow!: Chrome Extension",
    description:
      "A Smart and Simple-to-use To-do list app, conveniently in the form of a Google Chrome Extension. Go give it a try!",
    date: "November 2024",
  },
];

// Function to generate a fake commit hash
const generateCommitHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 7);
};

// Get ASCII art banner (extracted for reusability)
const getASCIIArt = (type) => {
  switch (type) {
    case "name":
      return [
        {
          type: "ascii",
          content: [
            "  _   _                               _____           _       ",
            " | \\ | |                             |  __ \\         (_)      ",
            " |  \\| | __ _ _ __ ___   __ _ _ __   | |__) |   _ ___ _  __ _ ",
            " | . ` |/ _` | '_ ` _ \\ / _` | '_ \\  |  _  / | | / __| |/ _` |",
            " | |\\  | (_| | | | | | | (_| | | | | | | \\ \\ |_| \\__ \\ | (_| |",
            " |_| \\_|\\__,_|_| |_| |_|\\__,_|_| |_| |_|  \\_\\__,_|___/_|\\__,_|",
            "                                                              ",
          ],
        },
      ];
    case "coffee":
      return [
        {
          type: "ascii",
          content: [
            "      ( (    ",
            "       ) )   ",
            "    .______.  ",
            "    |      |] ",
            "    \\      /  ",
            "     `----'   ",
          ],
        },
      ];
    case "computer":
      return [
        {
          type: "ascii",
          content: [
            "     .---.         ",
            "     |   |         ",
            "     |   |         ",
            "     |   |         ",
            "     |   |.--.     ",
            "     |   |   :     ",
            "     |   |   |     ",
            "     |   |   |     ",
            "     |   |   |     ",
            "     |   |   |     ",
            "     |   |   |     ",
            " ____|   |   |     ",
            "|    |   |   |     ",
            "|    |   |   |     ",
            "|____|   |___|     ",
            "     '---'         ",
          ],
        },
      ];
    default:
      return [{ type: "error", content: "ASCII art not found" }];
  }
};

const Terminal = () => {
  // Initial output now includes the banner
  const initialOutput = [
    ...getASCIIArt("name"),
    { type: "output", content: "Welcome to my interactive terminal!" },
    {
      type: "output",
      content: "Type 'help' to see what commands are available.",
    },
  ];
  const [output, setOutput] = useState(initialOutput);
  const [command, setCommand] = useState("");
  const [guest, setGuest] = useState("guest");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [isHacking, setIsHacking] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Available commands for autocomplete
  const availableCommands = [
    "about",
    "projects",
    "skills",
    "education",
    "resume",
    "funfact",
    "clear",
    "help",
    "social",
    "contact",
    "date",
    "time",
    "echo",
    "change name",
    "ascii",
    "joke",
    "quote",
    "matrix",
    "game",
    "github",
    "spotify",
    "coffee",
    "banner",
    "ls",
    "hack",
    "flip",
    "git log",
    "commits",
    "exit",
  ];

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal clicked
  const focusInput = () => {
    if (inputRef.current && !isHacking && !isFlipped) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation through command history
  const handleKeyDown = (e) => {
    if (isHacking || isFlipped) return;

    // Up arrow key
    if (e.key === "ArrowUp" && commandHistory.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;
      setHistoryIndex(newIndex);
      setCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
    }
    // Down arrow key
    else if (e.key === "ArrowDown" && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setCommand(
        newIndex === -1
          ? ""
          : commandHistory[commandHistory.length - 1 - newIndex] || ""
      );
    }
    // Tab key for autocompletion
    else if (e.key === "Tab" && !gameActive) {
      e.preventDefault();
      handleTabCompletion();
    }
    // Escape key to hide suggestions
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Handle tab completion
  const handleTabCompletion = () => {
    if (command.trim() === "") return;

    const matchingCommands = availableCommands.filter((cmd) =>
      cmd.startsWith(command.toLowerCase())
    );

    if (matchingCommands.length === 1) {
      // If there's only one match, autocomplete it
      setCommand(matchingCommands[0]);
      setShowSuggestions(false);
    } else if (matchingCommands.length > 1) {
      // Show suggestions
      setSuggestions(matchingCommands);
      setShowSuggestions(true);
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  // Handle number guessing game
  const handleGameCommand = (input) => {
    if (!gameState) {
      // Initialize game
      const targetNumber = Math.floor(Math.random() * 100) + 1;
      setGameState({
        targetNumber,
        guesses: 0,
        won: false,
      });
      return [
        { type: "section", content: "🎮 Number Guessing Game" },
        {
          type: "output",
          content: "I'm thinking of a number between 1 and 100.",
        },
        {
          type: "output",
          content: "Type a number to guess, or 'exit game' to quit.",
        },
      ];
    }

    if (input.toLowerCase() === "exit game") {
      setGameActive(false);
      setGameState(null);
      return [{ type: "output", content: "Game over. Thanks for playing!" }];
    }

    const guess = parseInt(input, 10);
    if (isNaN(guess)) {
      return [
        {
          type: "error",
          content: "Please enter a valid number or 'exit game' to quit.",
        },
      ];
    }

    const newGameState = {
      ...gameState,
      guesses: gameState.guesses + 1,
    };

    if (guess === gameState.targetNumber) {
      newGameState.won = true;
      setGameActive(false);
      setGameState(null);
      return [
        {
          type: "success",
          content: `🎉 Congratulations! You guessed the number ${gameState.targetNumber} in ${newGameState.guesses} guesses!`,
        },
        { type: "output", content: "Game over. Type 'game' to play again." },
      ];
    } else if (guess < gameState.targetNumber) {
      setGameState(newGameState);
      return [
        { type: "output", content: "Too low! Try a higher number." },
        { type: "output", content: `Guesses so far: ${newGameState.guesses}` },
      ];
    } else {
      setGameState(newGameState);
      return [
        { type: "output", content: "Too high! Try a lower number." },
        { type: "output", content: `Guesses so far: ${newGameState.guesses}` },
      ];
    }
  };

  // Get jokes
  const getRandomJoke = () => {
    const jokes = [
      "Why don't programmers like nature? It has too many bugs.",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "A programmer's wife tells him to go to the store and 'get a gallon of milk, and if they have eggs, get a dozen.' He returns with 13 gallons of milk.",
      "What do you call 8 hobbits? A hobbyte.",
      "What's the object-oriented way to become wealthy? Inheritance.",
      "Why did the functions stop calling each other? They had too many arguments.",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

  // Get quotes
  const getRandomQuote = () => {
    const quotes = [
      {
        text: "The best way to predict the future is to invent it.",
        author: "Alan Kay",
      },
      {
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House",
      },
      {
        text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler",
      },
      {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
      },
      {
        text: "Experience is the name everyone gives to their mistakes.",
        author: "Oscar Wilde",
      },
      {
        text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
        author: "Dan Salomon",
      },
      // TV Show Quotes
      {
        text: "It's going to be legen... wait for it... dary! Legendary!",
        author: "Barney Stinson, HIMYM",
      },
      {
        text: "Whatever you do in this life, it's not legendary, unless your friends are there to see it.",
        author: "Ted Mosby, HIMYM",
      },
      { text: "Winners don't make excuses.", author: "Harvey Specter, Suits" },
      {
        text: "Sometimes good guys gotta do bad things to make the bad guys pay.",
        author: "Harvey Specter, Suits",
      },
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },

      { text: "Bazinga!", author: "Sheldon Cooper, The Big Bang Theory" },

      {
        text: "I am the one who knocks.",
        author: "Walter White, Breaking Bad",
      },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  // Run Hack Sequence
  const runHackSequence = (initialOutput, step = 0) => {
    const steps = [
      "Establishing connection to target mainframe...",
      "Bypassing firewall protocols... [Access Granted]",
      "Injecting polymorphic code...",
      "Decrypting secure data streams...",
      "Analyzing vulnerability vectors...",
      "Escalating privileges... [Root Access Achieved]",
      "Downloading confidential files... /data/secrets.zip",
      "Covering tracks... Deleting logs...",
      "Exfiltrating data...",
      "Disconnecting from server...",
    ];
    const duration = 500; // ms per step

    if (step < steps.length) {
      const progress = ((step + 1) / steps.length) * 100;
      const newOutput = [
        ...initialOutput,
        { type: "hack_output", content: steps[step] },
        { type: "progress", progress: progress },
      ];
      // Keep replacing the last two items (message + progress bar)
      setOutput((prevOutput) => [
        ...prevOutput.slice(0, -2), // Keep all but last two
        { type: "hack_output", content: steps[step] },
        { type: "progress", progress: progress },
      ]);

      setTimeout(() => runHackSequence(initialOutput, step + 1), duration);
    } else {
      setOutput((prevOutput) => [
        ...prevOutput.slice(0, -2), // Remove last message and progress bar
        { type: "success", content: "Target system compromised successfully!" },
        {
          type: "system",
          content: "Operation complete. Reverting to normal terminal mode.",
        },
      ]);
      setIsHacking(false);
    }
  };

  // Command handler
  const handleCommand = (e) => {
    e.preventDefault();

    if (!command.trim() || isHacking || isFlipped) return;

    // Add command to history
    setCommandHistory([...commandHistory, command]);
    setHistoryIndex(-1);

    // Check if we're in a game
    if (gameActive) {
      const gameOutput = handleGameCommand(command);
      setOutput([
        ...output,
        { type: "command", content: command },
        ...gameOutput,
      ]);
      setCommand("");
      return;
    }

    const newOutput = [...output, { type: "command", content: command }];
    setShowSuggestions(false);

    // Parse command (handle multi-word commands)
    const args = command.trim().split(" ");
    const mainCommand = args[0].toLowerCase();

    // Check for commands
    if (command.toLowerCase().startsWith("change name")) {
      // Extract everything after "change name "
      const newName = command.substring(12).trim(); // "change name ".length = 12
      if (newName) {
        setGuest(newName);
        newOutput.push({
          type: "success",
          content: `Name successfully changed to "${newName}"`,
        });
      } else {
        newOutput.push({
          type: "error",
          content: "Error: Please provide a name after 'change name'.",
        });
      }
    } else if (command.toLowerCase().startsWith("echo")) {
      const message = command.substring(5);
      if (message.trim()) {
        newOutput.push({ type: "output", content: message.trim() });
      } else {
        newOutput.push({
          type: "error",
          content: "Error: Echo requires a message.",
        });
      }
    } else {
      // Handle other commands
      switch (mainCommand) {
        case "about":
          newOutput.push(
            {
              type: "output",
              content:
                "Hi! I'm Naman, a software enthusiast who loves building creative Products.",
            },
            {
              type: "output",
              content:
                "I'm currently studying Computer Science and Business Administration at Northeastern University.",
            },
            {
              type: "output",
              content:
                "I have a passion for solving problems with code and creating useful applications.",
            }
          );
          break;
        case "projects":
          newOutput.push(
            {
              type: "output",
              content:
                "I love the process of bringing my Ideas to life. Check out the 'Projects' page for a detailed look at some of my Projects.",
            },
            {
              type: "link",
              content: "Click here to go to my projects page!",
              url: "./projects",
            }
          );
          break;
        case "skills":
          newOutput.push(
            { type: "section", content: "Programming Languages:" },
            {
              type: "list",
              content: ["JavaScript", "Python", "Java", "TypeScript"],
            },
            { type: "section", content: "Frontend:" },
            {
              type: "list",
              content: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
            },
            { type: "section", content: "Backend:" },
            {
              type: "list",
              content: ["Node.js", "Flask", "FastAPI", "MongoDB", "Supabase"],
            }
          );
          break;
        case "education":
          newOutput.push(
            { type: "section", content: "Education:" },
            {
              type: "output",
              content: "B.S in Computer Science and Business Administration",
            },
            { type: "output", content: "Minor in Mathematics (undeclared)" },
            { type: "output", content: "Northeastern University [Boston]" },
            { type: "output", content: "Deans List" },
            {
              type: "output",
              content: "Singapore American School High School Class of 2024",
            }
          );
          break;
        case "resume":
          newOutput.push(
            {
              type: "output",
              content: "My professional resume is available at:",
            },
            { type: "link", content: "View my resume", url: "/resume" }
          );
          break;
        case "funfact":
          const funFacts = [
            "I can crack my neck really loud",
            "I've visited 16+ countries around the world",
            "I can solve a Rubik's cube in under 30 seconds",
            "My favorite programming Framework is React",
            "I'm a night owl and do my best coding after midnight",
          ];
          newOutput.push({
            type: "output",
            content: funFacts[Math.floor(Math.random() * funFacts.length)],
          });
          break;
        case "social":
          newOutput.push(
            { type: "section", content: "Find me on:" },
            {
              type: "link",
              content: "GitHub",
              url: "https://github.com/naman0r",
              icon: "github",
            },
            {
              type: "link",
              content: "LinkedIn",
              url: "https://linkedin.com/in/namanrusia",
              icon: "linkedin",
            }
          );
          break;
        case "contact":
          newOutput.push(
            { type: "output", content: "Feel free to reach out to me at:" },
            {
              type: "link",
              content: "rusia.n@northeastern.edu",
              url: "mailto:rusia.n@northeastern.edu",
            },
            {
              type: "link",
              content: "LinkedIn.com/in/namanrusia",
              url: "https://linkedin.com/in/namanrusia",
              icon: "linkedin",
            }
          );
          break;
        case "date":
          newOutput.push({
            type: "output",
            content: new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });
          break;
        case "time":
          newOutput.push({
            type: "output",
            content: new Date().toLocaleTimeString("en-US"),
          });
          break;
        case "game":
          setGameActive(true);
          newOutput.push(
            { type: "section", content: "🎮 Number Guessing Game" },
            {
              type: "output",
              content: "I'm thinking of a number between 1 and 100.",
            },
            {
              type: "output",
              content: "Type a number to guess, or 'exit game' to quit.",
            }
          );
          // Initialize game
          const targetNumber = Math.floor(Math.random() * 100) + 1;
          setGameState({
            targetNumber,
            guesses: 0,
            won: false,
          });
          break;
        case "ascii":
          if (args.length > 1) {
            newOutput.push(...getASCIIArt(args[1]));
          } else {
            newOutput.push(...getASCIIArt("name"));
          }
          break;
        case "joke":
          newOutput.push(
            { type: "section", content: "Here's a programming joke:" },
            { type: "output", content: getRandomJoke() }
          );
          break;
        case "secret":
          newOutput.push(
            {
              type: "section",
              content: "How did you know this was here?",
            },
            { type: "output", content: "SSHHHHHHH!" }
          );
          break;
        case "quote":
          const quote = getRandomQuote();
          newOutput.push(
            { type: "section", content: "Inspirational Quote:" },
            { type: "output", content: `"${quote.text}"` },
            { type: "output", content: `- ${quote.author}` }
          );
          break;
        case "hack":
          setIsHacking(true);
          const initialHackOutput = [
            ...newOutput,
            {
              type: "system",
              content: "Initiating cyber intrusion sequence...",
            },
            { type: "progress", progress: 0 },
          ];
          setOutput(initialHackOutput);
          runHackSequence(initialHackOutput);
          setCommand("");
          return;
        case "flip":
          setIsFlipped(true);
          newOutput.push({
            type: "system",
            content: "Whoa! Everything's upside down!",
          });
          setTimeout(() => {
            setIsFlipped(false);
          }, 4000);
          break;
        case "git":
          if (args[1] === "log") {
            newOutput.push({
              type: "section",
              content: "Project Commit History:",
            });
            projectsData.forEach((project) => {
              newOutput.push({
                type: "commit",
                hash: generateCommitHash(project.title),
                author: guest,
                date: project.date,
                message: `feat: Add project - ${project.title}`,
                description:
                  project.description.substring(0, 80) +
                  (project.description.length > 80 ? "..." : ""),
              });
            });
          } else {
            newOutput.push({
              type: "error",
              content: `Unknown git command: ${args[1]}`,
            });
          }
          break;
        case "commits":
          newOutput.push(
            { type: "section", content: "My Recent GitHub Activity:" },
            {
              type: "image",
              url: "https://raw.githubusercontent.com/naman0r/naman0r/output/ocean.gif",
              alt: "GitHub Contribution Heatmap",
            }
          );
          break;
        case "github":
          newOutput.push(
            { type: "section", content: "GitHub Stats:" },
            { type: "output", content: "Username: naman0r" },
            { type: "output", content: "Repositories: 25+" },
            {
              type: "output",
              content:
                "Most used languages: JavaScript, Python, Java, TypeScript",
            },
            {
              type: "link",
              content: "View GitHub Profile",
              url: "https://github.com/naman0r",
              icon: "github",
            }
          );
          break;
        case "spotify":
          newOutput.push(
            { type: "section", content: "🎧 Currently Vibing To:" },
            { type: "output", content: "Instant Crush - Daft Punk" },
            { type: "output", content: "Album: Random Access Memories" },
            { type: "output", content: "Playlist: house?" },
            {
              type: "link",
              content: "View my Spotify Songs!",
              url: "https://open.spotify.com/user/h8pkjswq0k221qlr7oxqphw5i",
              icon: "spotify",
            }
          );
          break;
        case "coffee":
          newOutput.push(
            { type: "section", content: "☕ Coffee Break!" },
            ...getASCIIArt("coffee"),
            {
              type: "output",
              content: "Brewing a fresh cup of coffee for you...",
            },
            {
              type: "output",
              content: "Favorite brew: black. just black. yea",
            }
          );
          break;
        case "banner":
          newOutput.push(
            ...getASCIIArt("name"),
            { type: "output", content: "Welcome to my interactive terminal!" },
            {
              type: "output",
              content: "Type 'help' to see what commands are available.",
            }
          );
          break;
        case "ls":
          newOutput.push(
            { type: "section", content: "Directory Contents:" },
            {
              type: "table",
              content: [
                { command: "about.txt", description: "Personal information" },
                { command: "projects/", description: "My coding projects" },
                { command: "skills.json", description: "Technical skills" },
                { command: "resume.pdf", description: "My resume" },
                { command: "contact.md", description: "Contact information" },
                { command: "games/", description: "Terminal games" },
                { command: "config.js", description: "Terminal configuration" },
              ],
            }
          );
          break;
        case "help":
          newOutput.push(
            { type: "section", content: "Available Commands:" },
            {
              type: "table",
              content: [
                { command: "about", description: "Learn about me" },
                { command: "projects", description: "View my projects" },
                { command: "skills", description: "See my technical skills" },
                {
                  command: "education",
                  description: "View my educational background",
                },
                {
                  command: "resume",
                  description: "View my professional resume",
                },
                {
                  command: "funfact",
                  description: "Read a random fun fact about me",
                },
                {
                  command: "social",
                  description: "Get links to my social profiles",
                },
                {
                  command: "contact",
                  description: "Get my contact information",
                },
                { command: "date", description: "Display the current date" },
                { command: "time", description: "Display the current time" },
                { command: "echo [message]", description: "Display a message" },
                {
                  command: "change name [name]",
                  description: "Change your guest name",
                },
                { command: "ascii [type]", description: "Show ASCII art" },
                { command: "joke", description: "Tell a programming joke" },
                {
                  command: "quote",
                  description: "Show an inspirational quote",
                },
                { command: "game", description: "Play a number guessing game" },
                { command: "github", description: "View my GitHub stats" },
                {
                  command: "spotify",
                  description: "See what I'm listening to",
                },
                { command: "coffee", description: "Take a coffee break" },
                { command: "banner", description: "Show welcome banner" },
                { command: "ls", description: "List directory contents" },
                { command: "hack", description: "Run a fake hacking sequence" },
                {
                  command: "flip",
                  description: "Flip the terminal upside down",
                },
                {
                  command: "git log",
                  description: "Show project commit history",
                },
                {
                  command: "commits",
                  description: "Show GitHub activity heatmap",
                },
                { command: "clear", description: "Clear the terminal" },
                { command: "exit", description: "Close the terminal" },
              ],
            }
          );
          break;
        case "clear":
          setOutput([{ type: "system", content: "Terminal cleared" }]);
          setCommand("");
          return;
        case "exit":
          newOutput.push({ type: "system", content: "Closing terminal..." });
          setTimeout(() => {
            setMinimized(true);
          }, 1000);
          break;
        default:
          if (mainCommand.startsWith("sudo")) {
            newOutput.push({
              type: "error",
              content:
                "Nice try! You don't have sudo privileges on this system.",
            });
          } else if (mainCommand === "rm" && args.includes("-rf")) {
            newOutput.push({
              type: "error",
              content:
                "Whoa there! Let's not delete everything. This terminal is read-only.",
            });
          } else if (
            mainCommand === "42" ||
            command === "what is the meaning of life"
          ) {
            newOutput.push({
              type: "output",
              content: "42. Ah, I see you're a person of culture as well!",
            });
          } else if (
            command.toLowerCase().includes("hello") ||
            command.toLowerCase().includes("hi")
          ) {
            newOutput.push({
              type: "output",
              content: `Hello there, ${guest}! Type 'help' to see available commands.`,
            });
          } else {
            newOutput.push({
              type: "error",
              content: `Command not found: ${command}. Type 'help' to see available commands.`,
            });
          }
      }
    }

    setOutput(newOutput);
    setCommand("");
  };

  // Render specific output based on type
  const renderOutput = (item, index) => {
    switch (item.type) {
      case "command":
        return (
          <div key={index} className="flex mb-2">
            <span className="text-green-400 font-bold mr-2">
              {guest}@terminal:~$
            </span>
            <span className="text-gray-100">{item.content}</span>
          </div>
        );
      case "error":
        return (
          <div key={index} className="text-red-400 ml-4 mb-2">
            {item.content}
          </div>
        );
      case "success":
        return (
          <div key={index} className="text-green-400 ml-4 mb-2">
            {item.content}
          </div>
        );
      case "system":
        return (
          <div key={index} className="text-purple-400 mb-2">
            {item.content}
          </div>
        );
      case "link":
        return (
          <div key={index} className="ml-4 mb-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-yellow-400 hover:text-yellow-200 hover:underline transition-colors"
            >
              {item.icon === "github" && <FaGithub className="mr-2" />}
              {item.icon === "linkedin" && <FaLinkedin className="mr-2" />}
              {item.icon === "spotify" && <FaSpotify className="mr-2" />}
              {item.content}
            </a>
          </div>
        );
      case "section":
        return (
          <div key={index} className="text-cyan-400 font-bold my-1">
            {item.content}
          </div>
        );
      case "list":
        return (
          <ul key={index} className="list-disc ml-8 mb-2 text-gray-100">
            {item.content.map((listItem, listIndex) => (
              <li key={listIndex} className="mb-1">
                {listItem}
              </li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div key={index} className="ml-4 my-2">
            {item.content.map((row, rowIndex) => (
              <div key={rowIndex} className="flex mb-1">
                <span className="text-yellow-400 w-48 mr-4">{row.command}</span>
                <span className="text-gray-100">{row.description}</span>
              </div>
            ))}
          </div>
        );
      case "ascii":
        return (
          <div
            key={index}
            className="font-mono text-green-300 text-xs my-2 whitespace-pre overflow-x-auto"
          >
            {item.content.map((line, lineIndex) => (
              <div key={lineIndex}>{line}</div>
            ))}
          </div>
        );
      case "progress":
        return (
          <div
            key={index}
            className="w-full bg-gray-700 rounded-full h-2.5 my-2 ml-4"
          >
            <div
              className="bg-green-500 h-2.5 rounded-full transition-width duration-300 ease-linear"
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        );
      case "hack_output":
        return (
          <div
            key={index}
            className="text-green-400 ml-4 mb-1 font-mono text-sm"
          >
            {item.content}
          </div>
        );
      case "commit":
        return (
          <div key={index} className="mb-4 ml-4">
            <div className="text-yellow-400">
              commit <span className="text-red-400">{item.hash}</span> (HEAD{" "}
              {"->"}
              main)
            </div>
            <div className="text-gray-400">{`Author: Naman Rusia <${item.author}@portfolio.com>`}</div>
            <div className="text-gray-400">Date: {item.date}</div>
            <div className="mt-2 text-gray-100">{item.message}</div>
            <div className="mt-1 text-gray-300 italic">{item.description}</div>
          </div>
        );
      case "image":
        return (
          <div key={index} className="ml-4 my-2">
            <img
              src={item.url}
              alt={item.alt || "Terminal Image"}
              className="max-w-full rounded"
            />
          </div>
        );
      default:
        return (
          <div key={index} className="text-gray-100 ml-4 mb-1">
            {item.content}
          </div>
        );
    }
  };

  if (minimized) {
    return (
      <div
        className="fixed bottom-8 right-8 bg-gray-800 text-green-400 w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer shadow-lg hover:scale-110 transition-transform z-50"
        onClick={() => setMinimized(false)}
        title="Open Terminal"
      >
        <FaTerminal />
      </div>
    );
  }

  return (
    <div
      id="terminal"
      className={`bg-gray-900 rounded-lg shadow-2xl w-[85%] max-w-3xl mx-auto my-8 flex flex-col overflow-hidden border border-gray-700 transition-all duration-300 ${
        maximized ? "fixed inset-4 w-auto max-w-none h-auto z-50" : "h-[500px]"
      } ${isFlipped ? "transform rotate-180" : ""}`}
      ref={terminalRef}
      onClick={focusInput}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700 select-none">
        <div className="flex items-center text-gray-100 text-sm">
          <FaTerminal className="mr-3 text-green-400" />
          <span>{guest}@terminal: ~</span>
        </div>
        <div className="flex gap-2">
          <button
            className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] text-gray-800 hover:opacity-80 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            title="Minimize"
          >
            <FaMinus className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center text-[8px] text-gray-800 hover:opacity-80 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setMaximized(!maximized);
            }}
            title={maximized ? "Restore" : "Maximize"}
          >
            <FaExpand className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-[8px] text-gray-800 hover:opacity-80 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setMinimized(true);
            }}
            title="Close"
          >
            <FaTimes className="opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-auto p-4 text-gray-100 font-mono bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
        ref={outputRef}
      >
        {output.map((item, index) => renderOutput(item, index))}
      </div>

      <form
        onSubmit={handleCommand}
        className="flex items-center px-4 py-3 bg-gray-900 border-t border-gray-700"
      >
        <span className="text-green-400 font-bold mr-2 whitespace-nowrap">
          {guest}@terminal:~$
        </span>
        <input
          type="text"
          className="bg-transparent border-none text-gray-100 font-mono w-full focus:outline-none"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={isHacking || isFlipped}
          autoFocus
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-[50px] left-4 bg-gray-800 border border-gray-700 rounded max-h-[200px] overflow-y-auto z-10 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 text-gray-100 cursor-pointer hover:bg-gray-700"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Terminal;
