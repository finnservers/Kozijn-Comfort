interface WindowVisualProps {
  configuration: string;
  panels: number;
  type: string;
}

export function WindowVisual({ configuration }: WindowVisualProps) {
  const renderWindow = () => {
    // Window types (kozijnen)
    switch (configuration) {
      case 'single':
        return (
          <svg width="100" height="120" viewBox="0 0 100 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="90" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="60" x2="95" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="15" cy="30" r="3" fill="#666" />
          </svg>
        );
      
      case 'double':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="60" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="60" x2="55" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="60" y1="60" x2="110" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="15" cy="30" r="3" fill="#666" />
            <circle cx="70" cy="30" r="3" fill="#666" />
          </svg>
        );
      
      case 'left-fixed':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="60" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="60" x2="55" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="15" cy="30" r="3" fill="#666" />
          </svg>
        );
      
      case 'left-fixed-3':
        return (
          <svg width="140" height="120" viewBox="0 0 140 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="50" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="95" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="60" x2="45" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="12" cy="25" r="3" fill="#666" />
          </svg>
        );
      
      case 'middle-fixed-3':
        return (
          <svg width="140" height="120" viewBox="0 0 140 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="50" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="95" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="50" y1="60" x2="90" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="57" cy="25" r="3" fill="#666" />
          </svg>
        );
      
      case 'right-fixed':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="60" y="5" width="50" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="60" y1="60" x2="110" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="70" cy="30" r="3" fill="#666" />
          </svg>
        );
      
      case 'both-fixed-3':
        return (
          <svg width="140" height="120" viewBox="0 0 140 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="50" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="95" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="60" x2="45" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="95" y1="60" x2="135" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="12" cy="25" r="3" fill="#666" />
            <circle cx="102" cy="25" r="3" fill="#666" />
          </svg>
        );
      
      // Sliding doors (schuifpuien)
      case 'sliding-2':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="52" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <rect x="63" y="5" width="52" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <circle cx="20" cy="60" r="2" fill="#666" />
            <circle cx="78" cy="60" r="2" fill="#666" />
          </svg>
        );
      
      case 'sliding-4':
        return (
          <svg width="150" height="120" viewBox="0 0 150 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="33" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <rect x="42" y="5" width="33" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <rect x="79" y="5" width="33" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <rect x="116" y="5" width="29" height="110" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <circle cx="15" cy="60" r="2" fill="#666" />
            <circle cx="52" cy="60" r="2" fill="#666" />
          </svg>
        );
      
      // Garden doors (tuindeuren)
      case 'double-garden':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="52" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="63" y="5" width="52" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="57" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="63" y1="115" x2="115" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="50" cy="60" r="3" fill="#666" />
            <circle cx="70" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'double-garden-side':
        return (
          <svg width="150" height="120" viewBox="0 0 150 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="25" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="35" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="80" y="5" width="40" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="125" y="5" width="20" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="35" y1="5" x2="75" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="80" y1="115" x2="120" y2="5" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="68" cy="60" r="3" fill="#666" />
            <circle cx="87" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'double-garden-top':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="110" height="25" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="35" width="52" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="63" y="35" width="52" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="35" x2="57" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="63" y1="115" x2="115" y2="35" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="50" cy="75" r="3" fill="#666" />
            <circle cx="70" cy="75" r="3" fill="#666" />
          </svg>
        );
      
      case 'double-garden-top-side':
        return (
          <svg width="150" height="120" viewBox="0 0 150 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="140" height="25" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="35" width="25" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="35" y="35" width="40" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="80" y="35" width="40" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="125" y="35" width="20" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="35" y1="35" x2="75" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="80" y1="115" x2="120" y2="35" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="68" cy="75" r="3" fill="#666" />
            <circle cx="87" cy="75" r="3" fill="#666" />
          </svg>
        );
      
      // Back doors (achterdeuren)
      case 'back-door-simple':
        return (
          <svg width="100" height="120" viewBox="0 0 100 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="90" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="95" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="80" width="70" height="25" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="80" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'back-door-top':
        return (
          <svg width="100" height="120" viewBox="0 0 100 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="90" height="25" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="35" width="90" height="80" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="35" x2="95" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="85" width="70" height="20" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="80" cy="70" r="3" fill="#666" />
          </svg>
        );
      
      case 'back-door-left':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="35" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="45" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="45" y1="5" x2="125" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="55" y="80" width="60" height="25" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="110" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'back-door-right':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="5" width="35" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="85" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="80" width="60" height="25" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="70" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'back-door-left-rail':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="35" height="55" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="65" width="35" height="50" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <rect x="45" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="45" y1="5" x2="125" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="55" y="80" width="60" height="25" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="110" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'back-door-right-rail':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="5" width="35" height="55" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="65" width="35" height="50" fill="#d1d5db" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="85" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="15" y="80" width="60" height="25" fill="white" stroke="#666" strokeWidth="1" />
            <circle cx="70" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      // Front doors (voordeuren)
      case 'front-door-simple':
        return (
          <svg width="100" height="120" viewBox="0 0 100 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="90" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="95" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="20" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'front-door-top':
        return (
          <svg width="100" height="120" viewBox="0 0 100 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="90" height="30" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="40" width="90" height="75" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="40" x2="95" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="20" cy="75" r="3" fill="#666" />
          </svg>
        );
      
      case 'front-door-left':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="35" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="45" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="45" y1="5" x2="125" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="60" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'front-door-right':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="80" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="5" width="35" height="110" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="5" x2="85" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="20" cy="60" r="3" fill="#666" />
          </svg>
        );
      
      case 'front-door-top-left':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="35" height="30" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="40" width="35" height="75" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="45" y="5" width="80" height="30" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="45" y="40" width="80" height="75" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="45" y1="40" x2="125" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="60" cy="75" r="3" fill="#666" />
          </svg>
        );
      
      case 'front-door-top-right':
        return (
          <svg width="130" height="120" viewBox="0 0 130 120" className="border-2 border-gray-300 bg-gray-100 rounded">
            <rect x="5" y="5" width="80" height="30" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="5" y="40" width="80" height="75" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="5" width="35" height="30" fill="white" stroke="#666" strokeWidth="2" />
            <rect x="90" y="40" width="35" height="75" fill="white" stroke="#666" strokeWidth="2" />
            <line x1="5" y1="40" x2="85" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="20" cy="75" r="3" fill="#666" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center pointer-events-none">
      {renderWindow()}
    </div>
  );
}