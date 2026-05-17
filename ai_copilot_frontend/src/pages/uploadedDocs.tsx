import axios from "axios";
import { useState, useEffect } from "react";
import.meta.env;

interface DocApi {
  id: number;
  title: string;
}
interface UploadedDocsProps {
  refreshDocs: boolean;
}

function UploadedDocs({ refreshDocs }: UploadedDocsProps) {
  const [docList, setDocList] = useState<DocApi[]>([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  async function fetchDocs() {
    console.log(apiUrl);

    try {
      const token = localStorage.getItem("token");

      const data = await axios.get(`${apiUrl}/document`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocList(data?.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, [refreshDocs]);

  return (
    <aside className="w-72 border-r border-white/10 bg-zinc-950/70 p-4 hidden md:block">
      <h2 className="text-sm font-semibold text-zinc-300 mb-4">
        Uploaded Documents
      </h2>

      {docList.length > 0 ? (
        <div className="space-y-2">
          {docList.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition cursor-pointer truncate"
            >
              📄 {doc.title}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No documents uploaded yet.</p>
      )}
    </aside>
  );
}

export default UploadedDocs;
