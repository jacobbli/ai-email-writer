import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.6);
  const [chatHistory, setChatHistory] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    const newChatHistory = [...chatHistory, `Human: ${prompt}`];
    setChatHistory(newChatHistory);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: newChatHistory.reduce(
            (acc, currentValue) => acc + "\n" + currentValue,
            ""
          ),
          temperature: temperature,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        `Chatbot: ${data.result}`,
      ]);
      setPrompt("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const chatHistoryList = chatHistory.map((message) => (
    <li key={message.toString()}>{message}</li>
  ));

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <ul>{chatHistoryList}</ul>
        <h3>Enter your prompt</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <input
            type="range"
            name="temperature"
            min="0"
            max="1"
            step="0.01"
            defaultValue="temperature"
            onChange={(e) => setTemperature(e.target.value)}
          />
          <div>{temperature}</div>
          <input type="submit" value="Submit prompt" />
        </form>
      </main>
    </div>
  );
}
