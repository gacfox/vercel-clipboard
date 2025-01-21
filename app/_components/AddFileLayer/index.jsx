"use client";

import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useState } from "react";

const AddFileLayer = ({ hideLayer, fetchMessages }) => {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitLoading(true);
    const file = e.dataTransfer.files[0];
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/files/upload",
      clientPayload: JSON.stringify({
        "X-Session-ID": localStorage.getItem("token"),
      }),
    });
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        type: "file",
        filename: blob.pathname.split("/").pop(),
        url: blob.url,
      }),
    });
    const data = await response.json();
    setSubmitLoading(false);
    if (data?.code === "403") {
      router.push("/login");
    } else {
      hideLayer();
      await fetchMessages();
    }
  };

  return (
    <div
      onDragLeave={hideLayer}
      onDragEnd={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="fixed w-full h-full bg-[rgba(0,0,0,0.3)] z-50 flex items-center justify-center"
    >
      <div className="w-64 h-16 border border-white rounded-md flex items-center justify-center text-white font-bold cursor-default pointer-events-none">
        {submitLoading ? "Uploading..." : "Drop to Upload"}
      </div>
    </div>
  );
};

export default AddFileLayer;
