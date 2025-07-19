"use client";

import React, { useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface ModalProps {
  setModal: () => void;
  children?: React.ReactNode;
}

const Modal = ({ setModal, children }: ModalProps) => {
  const preventOffModal = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={setModal}
      className="fixed inset-0 z-50 flex justify-center items-center w-full min-h-screen bg-black/90 overflow-y-auto"
      style={{ alignItems: "flex-start" }}
    >
      <div
        onClick={preventOffModal}
        className="bg-[#23272f] w-[900px] max-w-[98vw] rounded-2xl shadow-2xl flex flex-col text-white my-12 relative"
      >
        {/* Close Button */}
        <button
          onClick={setModal}
          className="absolute top-4 right-4 z-10 text-white cursor-pointer hover:text-gray-300 transition"
          aria-label="Close"
        >
          <IoMdCloseCircle size={36} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
