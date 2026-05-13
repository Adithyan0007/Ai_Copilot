import { useRef } from "react";
function FileUpload() {
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);

    const token = localStorage.getItem("token");
    console.log("hello");
    console.log(file);
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
        Adds
      </button>
    </div>
  );
}
export default FileUpload;
