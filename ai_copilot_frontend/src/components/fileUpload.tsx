import { useRef, useState } from "react";
import axios from "axios";
interface FileUploadProps {
  setRefreshDocs: React.Dispatch<React.SetStateAction<boolean>>;
}

function FileUpload({ setRefreshDocs }: FileUploadProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_SIZE) {
      alert("File size must be below 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("content", file);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/document", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("PDF uploaded successfully ✅");
      setRefreshDocs((prev: boolean) => !prev);
    } catch (err) {
      console.log(err);
      alert("PDF upload failed ❌");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        ref={fileRef}
        onChange={handleFileUpload}
      />

      <button
        disabled={loading}
        className="bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700 disabled:cursor-not-allowed border border-white/10 px-4 py-3 rounded-xl font-medium transition"
        onClick={() => fileRef.current?.click()}
      >
        {loading ? "Uploading..." : "+"}
      </button>
    </div>
  );
}

export default FileUpload;
