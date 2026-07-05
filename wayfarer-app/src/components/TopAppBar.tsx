import { Compass, MapPin, Radio } from "lucide-react";

interface TopAppBarProps {
  currentLocation: string;
  onOpenSelector: () => void;
}

export default function TopAppBar({ currentLocation, onOpenSelector }: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 border-b border-gray-100 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-7xl mx-auto">
        {/* Logo and Brand Title */}
        <div 
          onClick={onOpenSelector}
          className="flex items-center gap-2.5 text-brand-primary cursor-pointer hover:opacity-85 transition-opacity"
        >
          <Compass className="w-6 h-6 animate-spin-slow text-brand-primary-container" />
          <h1 className="font-display text-xl font-extrabold tracking-tight text-gray-900">
            Wayfarer
          </h1>
        </div>

        {/* Dynamic Location Quick Status */}
        <div 
          onClick={onOpenSelector}
          className="hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-full px-4 py-1.5 cursor-pointer transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary-container"></span>
          </span>
          <span className="text-xs font-mono font-medium text-gray-600">
            Current Vibe: <span className="font-semibold text-gray-900">{currentLocation}</span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-brand-primary-container" />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSelector}
            className="flex sm:hidden items-center gap-1.5 text-xs font-medium text-brand-primary-container bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Change City</span>
          </button>
          
          <button 
            aria-label="System Status"
            className="hover:bg-gray-100 transition-colors active:scale-95 duration-150 p-2.5 rounded-full text-gray-600"
          >
            <Radio className="w-5 h-5 text-gray-700 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
