import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../Loading/Loading";
import api from "../Api/Api.init";

const Answer = () => {
  const location = useLocation();

  // console.log(date);
  const data = location?.state?.data;

  // console.log("data from answer page:", data);
  const [prompt, setPrompt] = useState("");
  const [newGeneratedText, setNewGeneratedText] = useState(() => {
    // Initialize newGeneratedText from localStorage or data if available
    const storedText = localStorage.getItem("newGeneratedText");
    // console.log(storedText);
    return storedText ? JSON.parse(storedText) : [...data];
  });
  useEffect(() => {
    // Store newGeneratedText in localStorage whenever it changes
    localStorage.setItem("newGeneratedText", JSON.stringify(newGeneratedText));
  }, [newGeneratedText]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextAreaKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // "Shift" + "Enter" was pressed, trigger the action
      e.preventDefault(); // Prevent the default behavior (line break)
      fetchGeneratedText();
    }
  };
  const url = import.meta.env.VITE_APP_API;

  const fetchGeneratedText = async () => {
    setIsLoading(true);
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

        setNewGeneratedText((prevData) => [...prevData, ...textData]);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Set loading to false when the request is complete
    setPrompt("");
  };
  const clearChat = () => {
    setNewGeneratedText([]); // Clear the chat by setting newGeneratedText to an empty array
  };
  // console.log("newgenereatedtext", newGeneratedText);

  return (
    <div className="bg-black h-[100vh] ">
      <div className=" py-8">
        <div className="max-w-[600px] mx-auto">
          {newGeneratedText?.map((text, index) => (
            <div key={index}>
              <div className="flex items-center my-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://i.ibb.co/qYMMbXv/Picture.jpg"
                  alt="profile-img"
                />
                <p className="text-gray-400 text-base ms-4">{text.question}</p>
              </div>

              {index <= data.length ? (
                isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex items-center">
                    <img
                      className="w-12 h-12 rounded-full"
                      src="https://i.ibb.co/Ld1wFsm/openai-chatgpt-logo-icon-free-png.webp"
                      alt="chatbot-img"
                    />
                    <p className="text-gray-400 text-base ms-4 my-4">
                      {text.answer}
                    </p>
                  </div>
                )
              ) : (
                <div className="flex items-center">
                  <img
                    className="w-12 h-12 rounded-full"
                    src="https://i.ibb.co/Ld1wFsm/openai-chatgpt-logo-icon-free-png.webp"
                    alt="chatbot-img"
                  />
                  <p className="text-gray-400 text-base ms-4 my-4">
                    {text.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div className="flex flex-col mx-auto mt-8 py-16">
            <textarea
              rows="4"
              cols="20"
              className="flex w-full h-16 mx-auto outline-none  px-2 py-2 placeholder:py-1 placeholder:items-center border-none rounded-md bg-[#40414F] text-white shadow-md shadow-gray-600 resize-none "
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleTextAreaKeyPress}
              placeholder="Enter a prompt..."
            ></textarea>

            <button
              disabled={isLoading}
              onClick={fetchGeneratedText}
              className="bg-gray-600 w-32 mx-auto mt-6 p-2 rounded-md text-white"
            >
              {isLoading ? "Generating..." : "Generate Text"}
            </button>
            <button
              onClick={() => clearChat()}
              className="bg-gray-600 w-32 mx-auto mt-6 p-2 rounded-md text-white"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
