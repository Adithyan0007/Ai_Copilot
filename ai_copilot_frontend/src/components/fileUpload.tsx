import { useRef } from "react";
import axios from "axios";
function FileUpload() {
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // const title = window.prompt("Please enter your file title");
    const file = e.target.files?.[0];

    if (!file) return;
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("content", file);
    const title = file?.name;
    console.log(title);

    const token = localStorage.getItem("token");
    try {
      const data = await axios.post(
        "http://localhost:3000/document",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      console.log(err);
    } finally {
      e.target.value = "";
    }
  }
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        onChange={handleFileUpload}
      />
      <button
        className="bg-blue-600 hover:bg-green-300 p-4 rounded-xl font-medium"
        onClick={() => fileRef.current?.click()}
      >
        +
      </button>
    </div>
  );
}
export default FileUpload;
