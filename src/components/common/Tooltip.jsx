import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top, // Use viewport coordinates
        left: rect.left + rect.width / 2, // centered horizontally
      });
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  if (!content) return children;

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {show && createPortal(
        <div
          className="fixed z-[9999] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-100 dark:bg-gray-700 pointer-events-none whitespace-nowrap"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        >
          {content}
          <div
            className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"
            style={{
              bottom: '-4px',
              left: '50%',
              marginLeft: '-4px',
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
