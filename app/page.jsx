"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import AddMessageModal from "@/app/_components/AddMessageModal";
import DeleteMessage from "@/app/_components/DeleteMessage";
import ViewMessage from "@/app/_components/ViewMessage";
import CopyMessage from "@/app/_components/CopyMessage";
import AddFileModal from "@/app/_components/AddFileModal";
import AddFileLayer from "@/app/_components/AddFileLayer";
import DownloadFile from "@/app/_components/DownloadFile";
import ShareModal from "@/app/_components/ShareModal";

const formatDate = (timestamp) => {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const MessagesPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showAddFileLayer, setShowAddFileLayer] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const response = await fetch("/api/messages", {
      headers: {
        "X-Session-ID": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setLoading(false);
    if (data?.data) {
      setMessages(data.data);
    } else {
      if (data.code === "403") {
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const [vh, setVh] = useState("100vh");
  useEffect(() => {
    const handleBodyDragEnter = () => setShowAddFileLayer(true);
    window.addEventListener("dragenter", handleBodyDragEnter);

    let minHeight = window.innerHeight - 80;
    minHeight < 100 ? (minHeight = 100) : null;
    setVh(minHeight + "px");
    window.addEventListener("resize", () => {
      setVh(minHeight + "px");
    });
    return () => {
      window.removeEventListener("resize", () => {
        setVh(minHeight + "px");
      });
    };
  }, []);

  return (
    <>
      {showAddFileLayer && (
        <AddFileLayer
          hideLayer={() => setShowAddFileLayer(false)}
          fetchMessages={fetchMessages}
        />
      )}
      <div className="container mx-auto px-4 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 my-2">
          <div className="flex justify-center col-span-12">
            <AddMessageModal fetchMessages={fetchMessages} />
            <AddFileModal fetchMessages={fetchMessages} />
            <Button
              color="primary"
              className="w-[110px] ml-2"
              onClick={fetchMessages}
            >
              <span className="icon-loop2"></span> Refresh
            </Button>
          </div>
          {loading ? (
            <div
              className="col-span-12 flex justify-center align-middle"
              style={{ minHeight: vh }}
            >
              <Spinner label="Loading..." size="lg" />
            </div>
          ) : (
            <>
              {messages?.length === 0 ? (
                <div className="col-span-12 text-center text-gray-400">
                  Click Message or File button to push a message
                </div>
              ) : null}
              {messages.map((message, index) => {
                const timestamp = new Date(message.update_time);
                const readableDate = formatDate(timestamp);
                return (
                  <Card key={index} className="col-span-12" isHoverable={true}>
                    {message.type === "text" ? (
                      <>
                        <CardHeader>
                          <div className="font-bold text-lg">Text</div>
                          <div className="flex-grow"></div>
                          <ViewMessage messageContent={message.content} />
                          <CopyMessage messageContent={message.content} />
                          <DeleteMessage
                            messageId={message.message_id}
                            fetchMessages={fetchMessages}
                          />
                        </CardHeader>
                        <Divider />
                        <CardBody>
                          <div className="line-clamp-3">{message.content}</div>
                        </CardBody>
                      </>
                    ) : (
                      <>
                        <CardHeader>
                          <div className="font-bold text-lg">File</div>
                          <div className="flex-grow"></div>
                          <ShareModal url={message.url} />
                          <DownloadFile url={message.url} />
                          <DeleteMessage
                            messageId={message.message_id}
                            fetchMessages={fetchMessages}
                          />
                        </CardHeader>
                        <Divider />
                        <CardBody>{message.filename}</CardBody>
                      </>
                    )}
                    <CardFooter>
                      <div className="text-gray-400">{readableDate}</div>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
