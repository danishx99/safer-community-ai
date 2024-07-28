import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import logo from "../assets/logo.png";
import destination from "../assets/destination.png";
import dui from "../assets/racing.png";

export default function Chat({ onMessagesChange }) {
  const maxChars = 200;
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [triggerClick, setTriggerClick] = useState(false);
  const chatContainerRef = useRef(null);  

  useEffect(() => {
    if (triggerClick) {
      handleClick();
      setTriggerClick(false);
    }
  }, [triggerClick]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }

    // Call the parent callback function whenever messages change
    onMessagesChange(messages);
  }, [messages, onMessagesChange]);

  const handleClick = () => {
    console.log("CLICK");

    // Hide the div with id recPrompts
    document.getElementById("recPrompts").style.display = "none";

    const query = input;

    if (query === "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: "Please type a query" },
      ]);
      return;
    }

    setInput("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: query },
    ]);

    setIsLoading(true);

    axios
      .post("http://localhost:3000/query", { query })
      .then((response) => {
        setIsLoading(false);

        if (response.status === 200) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: "bot", text: response.data.response },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "bot",
              text: "Sorry, an error occurred. Please try again later.",
            },
          ]);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            text: "Sorry, something went wrong on our side. Please try again later.",
          },
        ]);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleTravelPrompt = () => {
    setInput("I am travelling to Sandton, what should I be careful for?");
    console.log("INPUT: ", input);
    setTriggerClick(true);
  };

  const handleDUIPrompt = () => {
    setInput("What are the most common areas of DUIs?");
    console.log("INPUT: ", input);
    setTriggerClick(true);
  };

  const processText = (text) => {
    const boldText = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    const formattedText = boldText.replace(/\n/g, "<br>");
    return { __html: formattedText };
  };

  return (
    <div className="flex flex-col h-full bg-[#7D9B76] p-4 w-[100%]">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md"
      >
        <div id="recPrompts">
          <div className="flex justify-center">
            <img src={logo} width="85" height="85" alt="Logo" />
          </div>
          <div className="flex flex-col">
            <div className="mx-auto max-w-5xl gap-6 lg:gap-12 py-4 flex flex-col items-center">
              <div
                className="gap-1 border border-gray-500 rounded-lg p-1 flex flex-col justify-center items-center w-[417px] h-[80px] hover:bg-[#e3fadb] cursor-pointer"
                onClick={handleTravelPrompt}
              >
                <img src={destination} width="30" height="30" alt="Logo" />
                <p className="text-gray-700 text-sm">
                  I am travelling to Sandton, what should I be careful for?
                </p>
              </div>
              <div
                className="flex flex-col justify-center items-center gap-1 border border-gray-500 rounded-lg p-1 w-[417px] h-[80px] hover:bg-[#e3fadb] cursor-pointer"
                onClick={handleDUIPrompt}
              >
                <img src={dui} width="40" height="40" alt="Logo" />
                <p className="text-gray-700 text-sm">
                  What are the most common areas of DUIs?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((message, index) =>
            message.type === "bot" ? (
              <div key={index}>
                <div className="flex flex-row items-center">
                  <img src={logo} width="30" height="30" alt="Logo" />
                  <div className="text-sm font-semibold text-black">
                    Safety AI Chatbot
                  </div>
                </div>

                <div
                  className="inline-block p-2 mt-1 text-sm text-black bg-[#F6F6E9] rounded-xl border border-gray-500"
                  dangerouslySetInnerHTML={processText(message.text)}
                ></div>
              </div>
            ) : (
              <div key={index} className="flex flex-col items-end">
                <div className="text-sm font-semibold text-black text-right">
                  You
                </div>
                <div className="inline-block p-2 mt-1 text-sm text-white bg-[#1F5014] rounded-xl">
                  {message.text}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex items-center mt-4 space-x-2">
        <Input
          type="text"
          value={input}
          placeholder="Type a message..."
          className="w-full p-4 text-sm bg-white border rounded-full shadow-md text-black"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className={`p-2 text-white rounded-full w-14 ${
            isLoading
              ? "bg-[#1F5014] cursor-not-allowed hover:bg-none"
              : "bg-[#1F5014] hover:border-white hover:bg-[#163f0d]"
          }`}
          onClick={() => setTriggerClick(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="btnloader"></div>
          ) : (
            <SendIcon className="w-6 h-6" />
          )}
        </Button>
      </div>
      <div className="text-xs text-white mt-2">
        {maxChars - input.length} characters remaining
      </div>
    </div>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
