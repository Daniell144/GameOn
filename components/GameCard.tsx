import React, { useState } from 'react';
import { GameInfo } from '../types';
import { X } from 'lucide-react';

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
        className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 transition-colors p-3 rounded-xl cursor-pointer select-none shadow-sm"
      >
        <span className="text-2xl">{game.icon}</span>
        <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-900 dark:text-white">{game.name}</span>
            {game.rank && <span className="text-xs text-violet-600 dark:text-violet-400">{game.rank}</span>}
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-violet-500/50 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl shadow-violet-900/20">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
              className="absolute top-3 left-3 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                {game.name}
              </h3>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              {game.rank && (
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">{labels.rank}:</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">{game.rank}</span>
                </div>
              )}
              {game.role && (
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">{labels.role}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{game.role}</span>
                </div>
              )}
              {game.description && (
                <div className="pt-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-right">
                    "{game.description}"
                  </p>
                </div>
              )}
              {!game.description && !game.rank && !game.role && (
                 <p className="text-sm text-slate-500 text-center">{labels.noInfo}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};