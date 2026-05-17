import { useState } from "react";
import axios from "axios";
import FileUpload from "../components/fileUpload";
import UploadedDocs from "./uploadedDocs";
import { useNavigate } from "react-router-dom";
import.meta.env;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshDocs, setRefreshDocs] = useState(false);
  async function handleSendMessage() {
    if (!query.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: query,
    };

    const token = localStorage.getItem("token");
    if (!token) return;

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      setLoading(true);

      const data = await axios.post(
        `${apiUrl}/chat`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data?.data?.answer || data?.data?.message || "No answer received.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 text-white flex flex-col">
      <div className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">AI Copilot</h1>
            <p className="text-sm text-zinc-400">
              Ask questions from your uploaded documents
            </p>
          </div>
          <div className="flex  justify-between items-center">
            <div className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              Online
            </div>
            <button
              onClick={() => {
                (localStorage.removeItem("token"), navigate("/login"));
              }}
              className="px-3 py-1 mx-5 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <UploadedDocs refreshDocs={refreshDocs} />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">🤖</span>
                  </div>

                  <h2 className="text-3xl font-bold mb-2">
                    Start chatting with your AI Copilot
                  </h2>

                  <p className="text-zinc-400 max-w-md">
                    Upload a document and ask questions. Your assistant will
                    answer based on your document content.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-6 shadow-lg ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-zinc-800 text-zinc-100 border border-white/10 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3 text-sm text-zinc-300">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end bg-zinc-900 border border-white/10 rounded-2xl p-3 shadow-2xl">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything from your document..."
                  className="flex-1 bg-transparent text-white placeholder:text-zinc-500 outline-none resize-none px-2 py-2"
                  rows={2}
                />

                <div className="flex gap-2">
                  <FileUpload setRefreshDocs={setRefreshDocs} />

                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !query.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-medium transition"
                  >
                    Send
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-500 text-center mt-3">
                AI can make mistakes. Verify important answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
