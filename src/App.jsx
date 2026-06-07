import { useState } from "react";
import "./App.css";

const loadingMessages = [
  "Summoning the senior dev... 👴",
  "Preparing the roast... 🔥",
  "Finding every mistake... 💀",
  "This might hurt... 😭",
  "Calling in the code police... 🚨",
  "Consulting the ghost of clean code... 👻",
  "Reading this so you don't have to... 😤",
];

function App() {
  const [code, setCode] = useState("");
  const [intensity, setIntensity] = useState("medium");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const intensityPrompts = {
    mild: "You are a warm, encouraging mentor reviewing this code. Be kind, patient, and supportive. Use phrases like 'great attempt!', 'one small thing to consider', 'you're on the right track!'. Point out issues gently and always frame them as learning opportunities. Use friendly emojis like 😊 🌟 👍 throughout. End with genuine encouragement like 'keep going, you're doing great!'",
    medium:
      "You are a senior developer who has seen it all — review this code with dry humor and sarcasm but still be helpful. Use phrases like 'ah yes, the classic mistake', 'interesting choice', 'bold move'. Point out every real problem with a sigh of disappointment but still explain how to fix it. Use emojis like 😤 🙄 😑 💀 to show your pain. End with a backhanded compliment.",
    brutal:
      "You are a savage, no-nonsense senior developer who has completely lost patience with bad code. Roast this code BRUTALLY. Use fire emojis 🔥, skull emojis 💀, crying emojis 😭, and facepalms 🤦 throughout your response. Be dramatic, savage, and absolutely merciless — call out every single bad practice, every lazy shortcut, every naming disaster. Use phrases like 'what in the world is this', 'who hurt you', 'this is a crime against programming', 'i want to unsee this'. Every criticism must still be technically accurate and educational, but deliver it like a roast comedian. End with a dramatic one-liner conclusion. 💀🔥",
  };

  const handleRoast = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setRoast("");
    setError("");
    setCopied(false);
    setLoadingMsg(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );

    const prompt = `${intensityPrompts[intensity]}\n\nHere is the code:\n\`\`\`\n${code}\n\`\`\``;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const message = data.choices[0].message.content;
      setRoast(message);
      setCount((prev) => prev + 1);
    } catch (err) {
      setError("Something went wrong. Check your API key and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const intensityConfig = {
    mild: { label: "😊 Mild", color: "#4ade80" },
    medium: { label: "😤 Medium", color: "#facc15" },
    brutal: { label: "💀 Brutal", color: "#ff4500" },
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          <span className="fire">🔥</span> Code Roaster
        </h1>
        <p className="subtitle">Paste your code. Brace yourself.</p>
        {count > 0 && (
          <p className="counter">
            🔥 {count} roast{count !== 1 ? "s" : ""} delivered
          </p>
        )}
      </div>

      <div className="card">
        <label className="input-label">Your Code</label>
        <textarea
          className="code-input"
          placeholder="Paste your code here... any language, any crime."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          spellCheck={false}
        />
      </div>

      <div className="card">
        <label className="input-label">Roast Intensity</label>
        <div className="intensity-buttons">
          {Object.entries(intensityConfig).map(([level, config]) => (
            <button
              key={level}
              className={`intensity-btn ${intensity === level ? "active" : ""}`}
              style={
                intensity === level ? { borderColor: config.color, color: config.color } : {}
              }
              onClick={() => setIntensity(level)}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="roast-btn"
        onClick={handleRoast}
        disabled={loading || !code.trim()}
      >
        {loading ? loadingMsg : "Roast My Code 🔥"}
      </button>

      {error && <p className="error">⚠️ {error}</p>}

      {roast && (
        <div className="card roast-output">
          <div className="roast-header">
            <h2>The Verdict</h2>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "✅ Copied!" : "Copy Roast"}
            </button>
          </div>
          <div className="roast-text">{roast}</div>
        </div>
      )}

      <footer>
        built with React + Groq — roasting code since 2025
      </footer>
    </div>
  );
}

export default App;
