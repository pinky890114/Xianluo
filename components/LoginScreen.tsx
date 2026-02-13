import React, { useState } from 'react';
import { Cat } from 'lucide-react';
export const LoginScreen: React.FC<{ onLogin: (pw: string) => void; isLoading: boolean; }> = ({ onLogin, isLoading }) => {
const [pw, setPw] = useState('');
return (
<div className="flex flex-col items-center py-20 animate-in fade-in duration-500">
<div className="bg-white p-8 rounded-3xl border shadow-sm max-w-sm w-full text-center">
<div className="w-12 h-12 bg-stone-100 text-black rounded-xl flex items-center justify-center mx-auto mb-4"><Cat size={24}/></div>
<h3 className="text-xl font-bold mb-6">暹羅開門</h3>
<input type="password" value={pw} onChange={e => setPw(e.target.value)} className="w-full border-2 rounded-xl px-4 py-2 mb-4 text-center outline-none focus:border-[#5D4037]" placeholder="請輸入密碼" />
<button onClick={() => onLogin(pw)} disabled={isLoading} className="w-full bg-[#A1887F] text-white py-3 rounded-xl font-bold hover:bg-[#8D6E63] transition-colors">{isLoading ? '驗證中...' : '登入'}</button>
</div>
</div>
);
};