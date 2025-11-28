import { useAuth } from "@clerk/clerk-react";
import { DownloadIcon, Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        return toast.error("Please select only one object.");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post("/ai/remove-image-object", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated-image.png"; // yahan tum apna naam set kar sakte ho
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Download failed!", error);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          accept="image/*"
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only single object name"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
bg-gradient-to-r from-[#4A7AFF] to-[#9234EA] text-white px-4 py-2 mt-6
text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove object
        </button>
      </form>
      {/* Right Col */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
border-gray-200 min-h-96"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className="text-sm flex flex-col items-center gap-5
text-gray-400"
            >
              <Scissors className="w-9 h-9" />
              <p className="text-center">
                Upload an image and click "Remove Object" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group mt-3 h-full">
            <img src={content} alt="" className="w-full h-full" />
            <div className="absolute bottom-0 top-0 right-0 left-0 p-3 flex justify-end group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <DownloadIcon
                className="cursor-pointer sm:hidden sm:group-hover:block text-gray-600"
                onClick={() => downloadImage(content)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
