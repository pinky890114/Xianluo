import React from 'react';
import { ThemeMode } from '../types';
import { Home } from 'lucide-react';
export const Header: React.FC<{ viewMode: ThemeMode; currentArtist: string; onLogout: () => void; onNavigateHome: () => void; }> = ({ viewMode, currentArtist, onLogout, onNavigateHome }) => (

<header className="flex justify-between items-center mb-8">
<div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onNavigateHome}>
<Home size={20} className="text-[#5D4037]" />
<h1 className="text-xl font-bold text-[#5D4037]">暹羅的賠錢生意</h1>
</div>
{viewMode === 'admin' && currentArtist && (
<div className="flex items-center gap-3 text-sm">
<span className="font-bold">👨‍🎨 {currentArtist}</span>
<button onClick={onLogout} className="text-stone-400 underline">登出</button>
</div>
)}
</header>
);