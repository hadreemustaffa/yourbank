import React, { useEffect } from "react";

// icons import
import XIcon from "../images/icons/x.svg?react";

// components import
import { ButtonSecondary } from "./Button";
import Icon from "./Icon";
import useOutsideClick from "../hooks/useOutsideClick";

interface ModalProps {
  id: string;
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  handleClose: () => void;
}

export default function Modal({
  title,
  isOpen,
  children,
  handleClose,
}: ModalProps) {
  const ref = useOutsideClick<HTMLDivElement>(handleClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.removeAttribute("style");
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-background/90 p-4"
    >
      <div
        ref={ref}
        className="flex w-full max-w-lg flex-col gap-6 rounded-md border border-accent/10 bg-card p-4"
      >
        <div className="flex flex-row items-center justify-between gap-2">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>

          <ButtonSecondary type="button" onClick={handleClose}>
            <Icon SvgIcon={XIcon} isBorderless />
          </ButtonSecondary>
        </div>

        {children}
      </div>
    </div>
  );
}
