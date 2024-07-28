import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import hero from "../assets/hero1.jpg";
import logo from "../assets/logo.png";
import crimeHotspot from "../assets/crimehotspotslogo.svg";
import robot from "../assets/robot.svg";
import Chat from "./Chat";
import Loader from "./Loader";
import PopupCard from "@/components/ui/review";
import axios from "axios";

export default function Component() {
  const [allMessages, setAllMessages] = useState([]);
  const [showReview, setShowReview] = useState(false);

  // Callback function to receive messages from the Chat component
  const handleMessagesChange = (newMessages) => {
    setAllMessages(newMessages);
  };

  // Use effect function to print allMessages to console
  useEffect(() => {
    console.log("NEW:", allMessages);
  }, [allMessages]);

  const handleReviewClick = () => {
    console.log("Review button clicked");
    setShowReview(true);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-screen bg-white">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center justify-center text-black hover:text-[#7D9B76]"
            prefetch="false"
          >
            <img src={logo} width="45" height="45" alt="Logo" />
            <span className="sr-only">SaferCommunity</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <h2 className="text-xl text-[#7D9B76] hover:text-[#7D9B76] font-medium hover:underline underline-offset-4">
              Safety AI Chatbot
            </h2>

            <Link
              to="/crimehotspots"
              className="text-xl text-black hover:text-[#7D9B76] font-medium hover:underline underline-offset-4"
              prefetch="false"
            >
              Crime Hotspots
            </Link>
          </nav>
        </div>
      </header>
      <main className="w-[80%] max-md:w-[100%] h-[calc(100dvh-56px)] mx-auto p-4">
        <Chat onMessagesChange={handleMessagesChange} />
      </main>
      <button
        className="cursor-pointer fixed bottom-4 right-4 bg-green-700 text-white py-2 px-4 rounded-full shadow-lg hover:bg-green-800"
        onClick={handleReviewClick}
      >
        Review
      </button>
      {showReview && <PopupCard messages={allMessages} />}
    </div>
  );
}
