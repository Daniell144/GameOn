import React, { useState } from 'react';
import { GameInfo } from '../types';
import { X, Minimize2, Maximize2 } from 'lucide-react';

interface GameCardProps {
  game: GameInfo;
  labels?: {
    rank: string;
    role: string;
    noInfo: string;
  };
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  labels = { rank: 'ראנק', role: 'תפקיד', noInfo: 'אין מידע נוסף' } 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowDetails(true)}
        className="group flex items-center gap-3 bg-white hover:bg-[#316AC5] hover:text-white border border-transparent hover:border-[#316AC5] p-2 cursor-pointer select-none transition-none"
      >
        <div className="text-3xl drop-shadow-md">{game.icon}</div>
        <div className="flex flex-col">
            <span className="font-normal text-sm group-hover:text-white text-black">{game.name}</span>
            {game.rank && <span className="text-xs text-gray-500 group-hover:text-gray-200">{game.rank}</span>}
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[1px]">
          <div className="bg-[#ECE9D8] p-1 rounded-t-lg rounded-b-none shadow-2xl w-full max-w-sm border border-[#0054E3]">
            {/* XP Title Bar */}
            <div className="bg-gradient-to-r from-[#0058EE] to-[#3A93FF] px-2 py-1 flex justify-between items-center rounded-t shadow-sm">
                <span className="text-white font-bold text-sm drop-shadow-md flex items-center gap-2">
                    {game.icon} {game.name} - Properties
                </span>
                <div className="flex gap-1">
                    <button className="w-5 h-5 bg-[#D6D3CE] border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center active:border-gray-500 active:border-r-white active:border-b-white">
                        <Minimize2 size={12} className="text-black" />
                    </button>
                    <button className="w-5 h-5 bg-[#D6D3CE] border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center active:border-gray-500 active:border-r-white active:border-b-white">
                        <Maximize2 size={12} className="text-black" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
                        className="w-5 h-5 bg-[#E53E30] border border-[#ff8d86] border-r-[#961b12] border-b-[#961b12] flex items-center justify-center text-white"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Window Content */}
            <div className="bg-[#ECE9D8] p-4 border-l border-r border-b border-[#0054E3]">
                <div className="bg-white border-2 border-inset border-gray-400 p-4 h-full">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="text-5xl">{game.icon}</div>
                        <div>
                            <h3 className="font-bold text-black">{game.name}</h3>
                            <p className="text-xs text-gray-500">Game File</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-300 my-2"></div>

                    <div className="space-y-2 text-sm">
                        {game.rank && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">{labels.rank}:</span>
                                <span className="font-bold text-black">{game.rank}</span>
                            </div>
                        )}
                        {game.role && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">{labels.role}:</span>
                                <span className="font-bold text-black">{game.role}</span>
                            </div>
                        )}
                        {game.description && (
                            <div className="mt-2 p-2 bg-[#FFFFE1] border border-gray-300 text-black">
                                {game.description}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setShowDetails(false)} className="px-6 py-1 bg-[#ECE9D8] border-2 border-white border-r-gray-600 border-b-gray-600 hover:border-black active:border-gray-600 active:border-t-black active:border-l-black text-black text-sm">
                            OK
                        </button>
                        <button onClick={() => setShowDetails(false)} className="px-6 py-1 bg-[#ECE9D8] border-2 border-white border-r-gray-600 border-b-gray-600 hover:border-black active:border-gray-600 active:border-t-black active:border-l-black text-black text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};