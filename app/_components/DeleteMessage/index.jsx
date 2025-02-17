"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";

const DeleteMessage = ({ messageId, fetchMessages }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteMessage = async () => {
    setLoading(true);
    const response = await fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        "X-Session-ID": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setLoading(false);
    if (data?.code === "200") {
      fetchMessages();
    } else {
      if (data.code === "403") {
        router.push("/login");
      }
    }
  };

  return (
    <>
      <Button
        color="danger"
        size="sm"
        className="ml-2"
        isLoading={loading}
        onPress={deleteMessage}
      >
        <span className="icon-bin"></span>
        <span className="hidden md:inline">Delete</span>
      </Button>
    </>
  );
};

export default DeleteMessage;
