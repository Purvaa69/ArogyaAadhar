import React, { useState, useEffect } from 'react';

export default function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return <div className="toast">{message}</div>;
}
