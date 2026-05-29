import { useState } from 'react';
import { Play, Trophy, RotateCcw, Monitor, User, Hand, HandMetal, Scissors } from 'lucide-react';

const CHOICES = [
  { id: 'rock', name: 'Rock', icon: HandMetal, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', hover: 'hover:border-rose-500 hover:bg-rose-500/20' },
  { id: 'paper', name: 'Paper', icon: Hand, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hover: 'hover:border-blue-500 hover:bg-blue-500/20' },
  { id: 'scissors', name: 'Scissors', icon: Scissors, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30', hover: 'hover:border-violet-500 hover:bg-violet-500/20' },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleChoice = (choiceId) => {
    if (isAnimating) return;
    
    setPlayerChoice(choiceId);
    setIsAnimating(true);
    setComputerChoice(null);
    setResult(null);
    
    let counter = 0;
    const interval = setInterval(() => {
      const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
      setComputerChoice(randomChoice);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalComputerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
        setComputerChoice(finalComputerChoice);
        const matchResult = determineWinner(choiceId, finalComputerChoice);
        setResult(matchResult);
        
        if (matchResult === 'win') setPlayerScore(p => p + 1);
        if (matchResult === 'lose') setComputerScore(c => c + 1);
        
        setIsAnimating(false);
      }
    }, 100);
  };

  const getChoiceConfig = (id) => CHOICES.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-8 flex justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-4 m-0">
          <Trophy className="w-10 h-10 text-yellow-400" />
          Neon Clash
        </h1>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 z-10">
        
        {/* LEFT SIDE - PLAYER */}
        <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          
          {/* Player Header */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <User className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-wide text-blue-100 m-0">YOU</h2>
            <div className="text-5xl font-black text-blue-400 mt-2 font-mono">{playerScore}</div>
          </div>

          {/* Player Actions */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 min-h-[250px]">
            {!isPlaying ? (
              <button 
                onClick={startGame}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] flex items-center gap-3 cursor-pointer border-none text-white"
              >
                <Play className="w-6 h-6 fill-current" />
                START GAME
              </button>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-xs">
                {CHOICES.map(choice => {
                  const Icon = choice.icon;
                  const isSelected = playerChoice === choice.id;
                  const isNotSelected = playerChoice && playerChoice !== choice.id;
                  
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      disabled={isAnimating || result !== null}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 bg-transparent text-white
                        ${isSelected ? `${choice.bg} ${choice.border} scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]` : ''}
                        ${isNotSelected ? 'opacity-40 grayscale scale-95' : ''}
                        ${!playerChoice && !isAnimating ? `bg-white/5 border-white/10 ${choice.hover}` : ''}
                        ${(isAnimating || result !== null) ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/10 ${choice.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-bold text-gray-200">{choice.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - COMPUTER */}
        <div className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
          
          {/* Computer Header */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Monitor className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-wide text-purple-100 m-0">SYSTEM</h2>
            <div className="text-5xl font-black text-purple-400 mt-2 font-mono">{computerScore}</div>
          </div>

          {/* Computer Actions / State */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 min-h-[250px]">
            {!isPlaying ? (
              <div className="text-gray-500 font-mono text-lg animate-pulse">
                WAITING FOR PLAYER...
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xs">
                {computerChoice ? (
                  <div className={`
                    flex flex-col items-center justify-center gap-4 p-8 rounded-2xl transition-all duration-500
                    ${isAnimating ? 'scale-90 opacity-70 border-transparent bg-transparent' : 'scale-110 shadow-[0_0_30px_rgba(255,255,255,0.05)] border-2 bg-white/5 ' + getChoiceConfig(computerChoice)?.border}
                  `}>
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      ${getChoiceConfig(computerChoice)?.bg} 
                    `}>
                      {(() => {
                        const Icon = getChoiceConfig(computerChoice)?.icon;
                        return Icon ? <Icon className={`w-10 h-10 ${getChoiceConfig(computerChoice)?.color}`} /> : null;
                      })()}
                    </div>
                    {!isAnimating && (
                      <span className={`text-2xl font-bold uppercase m-0 ${getChoiceConfig(computerChoice)?.color}`}>
                        {getChoiceConfig(computerChoice)?.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-dashed border-gray-700 opacity-50 animate-pulse">
                    <span className="text-gray-600 font-bold text-4xl m-0">?</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Result Overlay / Display */}
      {result && !isAnimating && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={() => {
            setPlayerChoice(null);
            setComputerChoice(null);
            setResult(null);
          }}></div>
          <div className={`
            relative z-10 flex flex-col items-center gap-6 p-10 rounded-3xl border shadow-2xl transform animate-in zoom-in duration-300 pointer-events-auto
            ${result === 'win' ? 'bg-emerald-950/90 border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.4)]' : ''}
            ${result === 'lose' ? 'bg-rose-950/90 border-rose-500/50 shadow-[0_0_80px_rgba(225,29,72,0.4)]' : ''}
            ${result === 'draw' ? 'bg-gray-800/90 border-gray-500/50 shadow-[0_0_80px_rgba(107,114,128,0.4)]' : ''}
          `}>
            <h2 className={`text-6xl md:text-7xl font-black uppercase tracking-widest m-0 ${
              result === 'win' ? 'text-emerald-400' : 
              result === 'lose' ? 'text-rose-400' : 'text-gray-300'
            }`}>
              {result === 'win' ? 'Victory!' : result === 'lose' ? 'Defeat!' : 'Draw!'}
            </h2>
            <button 
              onClick={() => {
                setPlayerChoice(null);
                setComputerChoice(null);
                setResult(null);
              }}
              className="mt-6 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold text-lg text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Play Next Round
            </button>
          </div>
        </div>
      )}

      {/* Footer / Reset */}
      {isPlaying && (
        <div className="pb-8 pt-4 flex justify-center z-10">
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-none cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Match
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
