import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  productName,
}: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
    if (zoom <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium text-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Product Name */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm md:text-base font-medium">
        {productName}
      </div>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        <img
          src={imageUrl}
          alt={productName}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
            transformOrigin: "center center",
          }}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      {zoom > 1 && (
        <div className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs md:text-sm">
          Drag to move
        </div>
      )}

      {zoom === 1 && (
        <div className="absolute bottom-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs md:text-sm">
          Click zoom to enlarge
        </div>
      )}
    </div>
  );
}
