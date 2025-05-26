"use client";

import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize,
  RefreshCw,
  Download,
  Move
} from "lucide-react";

interface MermaidProps {
  chart: string;
  title?: string;
}

export default function Mermaid({ chart, title }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Function to render mermaid diagram
  const renderMermaid = async () => {
    if (typeof window === "undefined" || !ref.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamically import mermaid only on client-side
      const mermaid = (await import("mermaid")).default;
      
      // Configure mermaid
      mermaid.initialize({
        startOnLoad: false, // Important: we'll render manually
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "inherit",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
        },
        er: {
          useMaxWidth: false,
        },
      });

      // Clear previous content
      ref.current.innerHTML = "";
      
      // Generate a unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      
      // Use mermaid's render method
      const { svg } = await mermaid.render(id, chart);
      
      // Set the generated SVG
      if (ref.current) {
        ref.current.innerHTML = svg;
        setSvgContent(svg);
        
        // Reset position when rendering a new diagram
        setPosition({ x: 0, y: 0 });
      }
    } catch (err) {
      console.error("Mermaid rendering error:", err);
      setError(`Failed to render diagram: ${err instanceof Error ? err.message : "Unknown error"}`);
      
      if (ref.current) {
        ref.current.innerHTML = `<div class="p-4 text-red-500 font-medium">Error rendering diagram. Please check browser console for details.</div>`;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial render
  useEffect(() => {
    renderMermaid();
    
    // Set up event listener for custom refresh event
    const refreshHandler = () => {
      renderMermaid();
    };
    
    document.addEventListener("refresh-mermaid", refreshHandler);
    
    return () => {
      document.removeEventListener("refresh-mermaid", refreshHandler);
    };
  }, [chart]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = () => {
    renderMermaid();
  };

  const handleDownload = () => {
    if (!svgContent) return;
    
    // Create a Blob from the SVG content
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "diagram"}.svg`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle fullscreen change event
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, []);

  // Pan/drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow panning with middle mouse button or when holding Alt
    if (e.button === 1 || e.altKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPosition({
      x: position.x + dx,
      y: position.y + dy
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset position
  const handleResetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };
  
  // Add event listeners for mouse events
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as any);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [isDragging, dragStart, position]);

  return (
    <Card className="p-4 relative" ref={containerRef}>
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetPosition} title="Reset View">
            <Move className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh Diagram">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDownload}
            disabled={!svgContent}
            title="Download SVG"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <div 
        className="overflow-auto relative"
        style={{ 
          height: isFullscreen ? 'calc(100vh - 150px)' : '500px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <div 
          style={{ 
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`, 
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            padding: '1rem',
            display: 'inline-block',
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          <div ref={ref} className="mermaid"></div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <span>Tip: Hold Alt + drag to pan the diagram. Use zoom buttons to resize.</span>
      </div>
    </Card>
  );
}