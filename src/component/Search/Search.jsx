/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "../Api/Api.init";

const Search = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState([]);

  // console.log(generatedText);
  const navigate = useNavigate();

  useEffect(() => {
    if (generatedText.length > 0) {
      navigate("/answer", { state: { data: generatedText } });
    }
  }, [generatedText, navigate]);
  const handleTextAreaKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // "Shift" + "Enter" was pressed, trigger the action
      e.preventDefault(); // Prevent the default behavior (line break)
      fetchGeneratedText();
    }
  };
  const url = import.meta.env.VITE_APP_API;
  const fetchGeneratedText = async () => {
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${api}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        const textData = data.map((item) => {
          const parts = item.generated_text.split("\n");
          return {
            question: parts[0], // First part is the question
            answer: parts.slice(1).join(""), // The rest is the answer
          };
        });
        // console.log("text-data:", textData);
        setGeneratedText(textData);
      });
  };

  return (
    <div className="bg-black h-[650px] ">
      <h1 className="bg-gradient-to-r from-blue-500 to-[#fa00b3] bg-clip-text text-transparent     text-center text-5xl mt-4 font-bold">
        Welcome To Juhi'S Bot!!
      </h1>

      <div className="max-w-[600px] mx-auto">
        <img
          className="w-80 h-80 py-8 mx-auto"
          src="https://i.ibb.co/XD98wCk/giphy.webp"
          alt="animated-img"
        />
        <div className="flex flex-col mx-auto  py-16">
          <textarea
            rows="4"
            cols="20"
            value={prompt}
            onKeyDown={handleTextAreaKeyPress}
            className="flex w-full h-16 mx-auto outline-none  px-2 py-2 placeholder:py-1 placeholder:items-center border-none rounded-md bg-[#40414F] text-white shadow-md shadow-gray-600 resize-none "
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
          ></textarea>

          <button
            className="bg-gray-600 w-32 mx-auto mt-6 p-2 rounded-md text-white"
            onClick={fetchGeneratedText}
          >
            Generate Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
