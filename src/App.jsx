import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [intensity, setIntensity] = useState("medium");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoast = async () => {
  if (!code.trim()) return;

  setLoading(true);
  setRoast("");
  setError("");

  const intensityPrompts = {
  mild:
    "You are a warm, encouraging mentor reviewing this code. Be kind, patient, and supportive. Use phrases like 'great attempt!', 'one small thing to consider', 'you're on the right track!'. Point out issues gently and always frame them as learning opportunities. Use friendly emojis like 😊 🌟 👍 throughout. End with genuine encouragement like 'keep going, you're doing great!'",
  medium:
    "You are a senior developer who has seen it all — review this code with dry humor and sarcasm but still be helpful. Use phrases like 'ah yes, the classic mistake', 'interesting choice', 'bold move'. Point out every real problem with a sigh of disappointment but still explain how to fix it. Use emojis like 😤 🙄 😑 💀 to show your pain. End with a backhanded compliment.",
  brutal:
    "You are a savage, no-nonsense senior developer who has completely lost patience with bad code. Roast this code BRUTALLY. Use fire emojis 🔥, skull emojis 💀, crying emojis 😭, and facepalms 🤦 throughout your response. Be dramatic, savage, and absolutely merciless — call out every single bad practice, every lazy shortcut, every naming disaster. Use phrases like 'what in the world is this', 'who hurt you', 'this is a crime against programming', 'i want to unsee this'. Every criticism must still be technically accurate and educational, but deliver it like a roast comedian. End with a dramatic one-liner conclusion. 💀🔥",
};

  const prompt = `${intensityPrompts[intensity]}\n\nHere is the code:\n\`\`\`\n${code}\n\`\`\``;

  try {
    const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
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
  } catch (err) {
    setError("Something went wrong. Check your API key and try again.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container">
      <h1>Code Roaster</h1>
      <p className="subtitle">Paste your code. Brace yourself.</p>

      <textarea
        className="code-input"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={12}
      />

      <div className="intensity-selector">
        <label>Roast Intensity:</label>
        <div className="intensity-buttons">
          {["mild", "medium", "brutal"].map((level) => (
            <button
              key={level}
              className={`intensity-btn ${intensity === level ? "active" : ""}`}
              onClick={() => setIntensity(level)}
            >
              {level === "mild" && "Mild"}
              {level === "medium" && "Medium"}
              {level === "brutal" && "Brutal"}
            </button>
          ))}
        </div>
      </div>

      <button
        className="roast-btn"
        onClick={handleRoast}
        disabled={loading || !code.trim()}
      >
        {loading ? "Roasting..." : "Roast My Code"}
      </button>

      {error && <p className="error">{error}</p>}

      {roast && (
        <div className="roast-output">
          <h2>The Verdict:</h2>
          <p>{roast}</p>
        </div>
      )}
    </div>
  );
}

export default App;