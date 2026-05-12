import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/login/", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("Login successful");
      navigate("/chat");
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-red-950 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center w-100 bg-zinc-800 border border-zinc-800 rounded-2xl shadow-2xl">
        <h1>Ai Copilot</h1>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col justify-center items-center">
            <input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-red-500 rounded p-1 m-3"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              value={password}
              className="bg-white border border-red-500 rounded p-1 m-3"
            />
          </div>
          <div className="flex justify-center">
            <button className="bg-blue-700 p-1 rounded">submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
