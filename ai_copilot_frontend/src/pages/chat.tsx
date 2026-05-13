import { useState } from "react";
import axios from "axios";
import FileUpload from "../components/fileUpload";
interface Message {
  role: "user" | "assistant";
  content: string;
}
function Chat() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  async function handleSendMessage() {
    if (!query.trim()) return;
    const UserMessage: Message = {
      role: "user",
      content: query,
    };
    const token = localStorage.getItem("token");
    if (!token) return;
    setMessages((prev) => [...prev, UserMessage]);
    setQuery("");
    try {
      setLoading(true);
      const data = await axios.post(
        "http://localhost:3000/chat",
        {
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const assistantMessage: Message = {
        role: "assistant",
        content: data?.data?.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.log(err);

      const errorMessage: Message = {
        role: "assistant",
        content: "something went wrong",
      };
      setMessages((prev) => [...prev, UserMessage]);
    } finally {
      setLoading(false);
    }
  }
  function addDocument() {}
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}

      <div className="border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold text-blue-500">AI Copilot</h1>
      </div>
      {messages.length > 0 ? (
        <div className="flex flex-col justify-center items-center">
          {messages.map((val, index) =>
            val.role == "user" ? (
              <div key={index} className="bg-blue-300 w-150 rounded p-2 m-2">
                {val.content}
              </div>
            ) : (
              <div
                key={index}
                className="bg-red-400 w-150 mt-2 rounded p-2 m-2"
              >
                {val.content}
              </div>
            ),
          )}
        </div>
      ) : null}

      <div className="border-t border-red-800 p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="bg-blue-600 rounded-xl p-2 mb-4">Thinking...</span>
          </div>
        ) : null}
        <div className="max-w-4xl mx-auto flex gap-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-zinc-900 border border-red-700 rounded-xl p-4 outline-none resize-none focus:border-blue-500"
            rows={3}
          />
          <div className="flex flex-col gap-5">
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-green-300 p-4 rounded-xl font-medium"
            >
              Send
            </button>{" "}
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
