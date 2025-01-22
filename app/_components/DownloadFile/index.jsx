"use client";

import { Button } from "@nextui-org/react";

const DownloadFile = ({ url }) => {
  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="ml-2"
        onClick={() => {
          location.href = url;
        }}
      >
        <span className="icon-download3"></span>
        <span className="hidden md:inline">Download</span>
      </Button>
    </>
  );
};

export default DownloadFile;
