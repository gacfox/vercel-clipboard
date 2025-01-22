"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

const ShareModal = ({ url }) => {
  const [qrcode, setQrcode] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    QRCode.toDataURL(url).then((res) => {
      setQrcode(res);
    });
  }, []);

  return (
    <>
      <Button size="sm" color="default" className="ml-2" onClick={onOpen}>
        <span className="icon-share2"></span>
        <span className="hidden md:inline">Share</span>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Scan QRCode to download</ModalHeader>
              <ModalBody>
                <div className="flex justify-center align-middle">
                  <img className="max-w-64 max-h-64" src={qrcode} />
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;
