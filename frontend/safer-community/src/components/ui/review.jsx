import React from "react";
import { Card } from "flowbite-react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { Input } from "./input";
import { Button } from "./button";
import axios from "axios";

const PopupCard = ({ messages, onClose }) => {
  const [value, setValue] = React.useState(4);
  const [input, setInput] = React.useState("");

  // Handle keydown event
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = async () => {
    const time = new Date().toISOString();
    const reviewData = {
      time,
      rating: value,
      input,
      messages,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/submit-review",
        reviewData
      );

      //hide the review card after 2 seconds
      setTimeout(() => {
        document.getElementById("review").style.display = "none";
      }, 2000);
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div
      id="review"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <Card href="#" className="max-w-sm p-4 cursor-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold bg-white"
        >
          X
        </button>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Rate our chatbot!
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Please take a moment to rate our chatbot. Your feedback is important
          to us.
        </p>
        <Box
          sx={{
            "& > legend": { mt: 2 },
          }}
        >
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </Box>
        <Input
          type="text"
          value={input}
          placeholder="Type a message..."
          className="w-full p-4 text-sm bg-white border rounded-full shadow-md text-black"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="p-2 text-white rounded-full w-full bg-[#528149] hover:bg-[#1F5014] hover:border-white"
          onClick={handleClick}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default PopupCard;
