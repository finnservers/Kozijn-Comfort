import { Badge } from './ui/badge';
import { WindowVisual } from './WindowVisual';

interface KozijnOptionProps {
  id: number;
  name: string;
  description: string;
  panels: number;
  isPopular?: boolean;
  configuration: string;
  type: string;
  isSelected: boolean;
  onClick: () => void;
}

export function KozijnOption({
  name,
  description,
  panels,
  isPopular,
  configuration,
  type,
  isSelected,
  onClick
}: KozijnOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all hover:border-gray-400 hover:shadow-sm text-left ${
        isSelected ? 'border-[#B59871] bg-[#B59871]/5 shadow-sm' : 'border-gray-200'
      }`}
    >
      <div className="flex-1 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base font-normal">{name}</span>
          {isPopular && (
            <Badge className="bg-[#B59871] hover:bg-[#B59871]/90">
              Populair
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <div className="ml-4 pointer-events-none">
        <WindowVisual configuration={configuration} panels={panels} type={type} />
      </div>
    </button>
  );
}