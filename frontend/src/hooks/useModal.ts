import { useState, useCallback } from 'react';

interface UseModalOptions {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useModal = ({
  initialOpen = false,
  onOpen,
  onClose,
}: UseModalOptions = {}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    handleOpen,
    handleClose,
    toggle,
  };
}; 