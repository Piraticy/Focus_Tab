import { useEffect, useState } from "react";
import "./App.css";
import { UNSPLASH_KEY } from "./config";


function App() {
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [bgImage, setBgImage] = useState(
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
);
const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
];


  useEffect(() => {
  const loadBackground = async () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("bg-date");

    if (savedDate === today) {
      setBgImage(localStorage.getItem("bg-image"));
      return;
    }

    try {
      const res = await fetch(
        "https://api.unsplash.com/photos/random?query=nature&orientation=landscape",
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`,
          },
        }
      );

      const data = await res.json();

      const imageUrl = data.urls.full;

      localStorage.setItem("bg-date", today);
      localStorage.setItem("bg-image", imageUrl);

      setBgImage(imageUrl);
    } catch (err) {
      console.error("Unsplash error:", err);
    }
  };

  loadBackground();
}, []);
useEffect(() => {
  const updateTimeAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();                                                             
    const formattedTime = `${hours.toString().padStart(2, "0", "0")}:${minutes
      .toString()
      .padStart(2, "0", "0")}:${seconds.toString().padStart(2, "0", "0")}`;
    setTime(formattedTime);

    let greet = "";
    if (hours < 12) {
      greet = "Good Morning";
    } else if (hours < 18) {
      greet = "Good Afternoon";
    } else {
      greet = "Good Evening";
    }
    setGreeting(greet);
  };

  updateTimeAndGreeting();
  const intervalId = setInterval(updateTimeAndGreeting, 60000);

  return () => clearInterval(intervalId);
}, []);

return (
  <div className="bg-wrapper">
    <div
      className="background bg-active"
      style={{ backgroundImage: `url(${bgImage})` }}
    />

    <div className="overlay"></div>

    <div className="container">
      <h1 className="time">{time}</h1>
      <h2 className="greeting">{greeting}</h2>
    </div>
  </div>
);

}

export default App;
