"use client";

import { Button } from "@heroui/react";

const DownloadFile = ({ url }) => {
  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="ml-2"
        onPress={() => {
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
