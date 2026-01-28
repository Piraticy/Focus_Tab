import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [time, setTime] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem("daily-bg") || "{}");

  if (saved.date === today && saved.url) {
    document.documentElement.style.setProperty(
      "--bg-url",
      `url('${saved.url}')`
    );
    setBgLoaded(true);
    return;
  }

  const fetchPhoto = async () => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?orientation=landscape&query=nature`,
        {
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
          },
        }
      );

      const data = await res.json();
      const imageUrl = data.urls.full;

      localStorage.setItem(
        "daily-bg",
        JSON.stringify({ date: today, url: imageUrl })
      );

      document.documentElement.style.setProperty(
        "--bg-url",
        `url('${imageUrl}')`
      );

      setBgLoaded(true);
    } catch (err) {
      console.error("Unsplash error", err);
    }
  };

  fetchPhoto();
}, []);



  return (
    <div
      className={`app ${bgLoaded ? "bg-visible" : ""}`}
    >
      <div className="overlay" />

      <main className="center">
        <h1 className="time">{time}</h1>
        <h2 className="greeting">Good evening</h2>

        <div className="name" contentEditable spellCheck="false" />

        <p className="question">What is your main focus for today?</p>
        <input className="focus" type="text" placeholder="Enter your focus..." />
      </main>
    </div>
  );
}
