
import React, { useState, useMemo, useEffect } from 'react';
import { Commission, CommissionStatus, ThemeMode } from './types';
import { useCommissionStore } from './hooks/useCommissionStore';
import { useProductStore } from './hooks/useProductStore';
import { useShopStore } from './hooks/useShopStore';
import { AddCommissionModal } from './components/AddCommissionModal';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { LoginScreen } from './components/LoginScreen';
import { CommissionControls } from './components/CommissionControls';
import { CommissionList } from './components/CommissionList';
import { CommissionForm } from './components/CommissionForm';
import { NocyShop } from './components/NocyShop';
import { ProductManagerModal } from './components/ProductManagerModal';
import { EditCommissionModal } from './components/EditCommissionModal';
import { GalleryManagerModal } from './components/GalleryManagerModal';
import { Lock, Unlock, ShoppingBag, Search, ArrowRight, Gift } from 'lucide-react';
import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);

const HomePage: React.FC<{ 
  onNavigateToTracker: () => void; 
  onNavigateToShop: () => void; 
  onNavigateToGeneralOrder: () => void;
}> = ({ onNavigateToTracker, onNavigateToShop, onNavigateToGeneralOrder }) => {
const menuItems = [
{ icon: <ShoppingBag size={24} className="text-[#5D4037]" />, title: 'Nocy餅舖', description: '查看小餅的領養須知，帶小餅回家', action: onNavigateToShop },
{ icon: <Gift size={24} className="text-[#8D6E63]" />, title: '隨便買買', description: '雖然餅舖現在沒營業，但還是可以花錢錢', action: onNavigateToGeneralOrder },
{ icon: <Search size={24} className="text-sky-700" />, title: '訂單進度查詢', description: '輸入您的暱稱或 ID，即時追蹤訂單狀態。', action: onNavigateToTracker },
{ icon: <DiscordIcon className="text-[#5865F2]" />, title: 'Discord', description: '欲獲一手消息，請入DC分曉。', action: () => window.open('https://discord.gg/fF282dN8QU', '_blank') },
];
return (
<div className="flex flex-col items-center justify-center text-center py-10 sm:py-20 animate-in fade-in zoom-in-95 duration-500">
<div className="mb-12">
<div className="inline-block bg-[#EFEBE9] text-[#5D4037] rounded-full px-4 py-1 text-sm font-bold mb-4 tracking-wider">WELCOME TO</div>
<h2 className="text-4xl sm:text-5xl font-bold text-[#5D4037] mb-4 tracking-tight">暹羅的賠錢生意</h2>
<p className="text-stone-500 max-w-lg font-medium text-lg">我本來只是個小餅販子</p>
</div>
<div className="w-full max-w-2xl space-y-5">
{menuItems.map((item, index) => (
<button key={index} onClick={item.action} className={`w-full bg-white border-2 border-stone-100 rounded-3xl p-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 flex items-center gap-6`}>
<div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${index === 0 ? 'bg-[#FAF8F5]' : index === 1 ? 'bg-[#EFEBE9]' : index === 2 ? 'bg-sky-50' : 'bg-indigo-50'}`}>{item.icon}</div>
<div className="flex-grow"><h3 className="text-xl font-bold text-stone-700">{item.title}</h3><p className="text-stone-500 text-sm mt-1">{item.description}</p></div>
<ArrowRight size={20} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0 -translate-x-2 group-hover:translate-x-0" />
</button>
))}
</div>
</div>
);
};

const App: React.FC = () => {
const { commissions, addCommission, updateCommissionStatus, updateCommission, deleteCommission } = useCommissionStore();
const { productOptions, updateProductOptions } = useProductStore();
const { showcaseItems, addShowcaseItem, removeShowcaseItem } = useShopStore();

const [appView, setAppView] = useState<'home' | 'tracker' | 'commission_form' | 'nocy_shop'>('home');
const [viewMode, setViewMode] = useState<ThemeMode>('client');
const [adminType, setAdminType] = useState<'nocy' | 'general' | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'All'>('All');
const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
const [isGalleryManagerOpen, setIsGalleryManagerOpen] = useState(false);
const [currentArtist, setCurrentArtist] = useState<string>('');
const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
const [isLoggingIn, setIsLoggingIn] = useState(false);
const [formConfig, setFormConfig] = useState<{title: string, subtitle?: string}>({ title: '委託申請單' });

// Remove loading screen on mount
useEffect(() => {
  const loading = document.getElementById('app-loading');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 500);
  }
}, []);

// Ensure anonymous auth for clients to allow image uploads
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            signInAnonymously(auth).catch((error) => {
                console.error("Anonymous auth failed", error);
            });
        }
    });
    return () => unsubscribe();
}, []);

const handleLogin = async (pw: string) => {
    let type: 'nocy' | 'general' | null = null;
    if (pw === '小餅暹羅') type = 'nocy';
    else if (pw === '斂財暹羅') type = 'general';
    else if (pw === '0000') type = 'nocy'; // 舊密碼相容

    if (type) {
      setIsLoggingIn(true);
      // Already signed in anonymously via useEffect, just setting local admin state
      setAdminType(type);
      setCurrentArtist('暹羅');
      setIsLoggingIn(false);
    } else {
      alert("密碼錯誤");
    }
};

const handleLogout = () => {
  setCurrentArtist('');
  setAdminType(null);
  // Do not sign out from firebase, keep anonymous session for client view
};
const handleNavigateToHome = () => { setAppView('home'); setViewMode('client'); setSearchTerm(''); setStatusFilter('All'); };
const toggleViewMode = () => viewMode === 'client' ? (setAppView('tracker'), setViewMode('admin')) : setViewMode('client');

const handleNavigateToShop = () => {
    setAppView('nocy_shop');
};

const handleNavigateToGeneralOrder = () => {
    setFormConfig({ title: '隨便買買', subtitle: '雖然餅舖現在沒營業，但還是可以花錢錢' });
    setAppView('commission_form');
};

const filteredCommissions = useMemo(() => {
  return commissions.filter(c => {
    // 關鍵搜尋
    const matchesSearch = (searchTerm === '' || c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    // 狀態過濾
    const matchesStatus = (statusFilter === 'All' || c.status === statusFilter);
    // 來源過濾 (僅在管理員模式下生效)
    const matchesSource = (viewMode === 'client' || !adminType || c.source === adminType);
    
    return matchesSearch && matchesStatus && matchesSource;
  });
}, [commissions, searchTerm, statusFilter, viewMode, adminType]);

const stats = useMemo(() => {
  // 如果是管理員，統計數據也應根據後台類型過濾
  const baseCommissions = (viewMode === 'admin' && adminType) 
    ? commissions.filter(c => c.source === adminType) 
    : commissions;

  return {
    queue: baseCommissions.filter(c => [CommissionStatus.APPLYING, CommissionStatus.DISCUSSION, CommissionStatus.DEPOSIT_PAID, CommissionStatus.QUEUED].includes(c.status)).length,
    active: baseCommissions.filter(c => c.status === CommissionStatus.IN_PRODUCTION).length,
    done: baseCommissions.filter(c => [CommissionStatus.COMPLETED, CommissionStatus.SHIPPED_LOCALLY].includes(c.status)).length
  };
}, [commissions, viewMode, adminType]);

const isAdminView = viewMode === 'admin';
const showLogin = isAdminView && !currentArtist;

return (
<div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8 flex flex-col">
<Header viewMode={viewMode} currentArtist={currentArtist} onLogout={handleLogout} onNavigateHome={handleNavigateToHome} />
<div className="flex-grow">
{appView === 'home' && (
    <HomePage 
        onNavigateToTracker={() => setAppView('tracker')} 
        onNavigateToShop={handleNavigateToShop} 
        onNavigateToGeneralOrder={handleNavigateToGeneralOrder}
    />
)}
{appView === 'tracker' && (showLogin ? <LoginScreen onLogin={handleLogin} isLoading={isLoggingIn} /> : (
<div className="animate-in fade-in duration-500">
<DashboardStats stats={stats} viewMode={viewMode} artistName={adminType === 'general' ? '斂財暹羅' : '餅舖店主暹羅'} />
<CommissionControls 
  searchTerm={searchTerm} 
  onSearchTermChange={setSearchTerm} 
  statusFilter={statusFilter} 
  onStatusFilterChange={setStatusFilter} 
  viewMode={viewMode} 
  onAddClick={() => setIsAddingModalOpen(true)} 
  onManageProductsClick={adminType === 'general' ? () => setIsProductManagerOpen(true) : undefined}
  onManageGalleryClick={() => setIsGalleryManagerOpen(true)}
/>
<CommissionList 
  commissions={filteredCommissions} 
  viewMode={viewMode} 
  searchTerm={searchTerm} 
  onUpdateStatus={updateCommissionStatus} 
  onUpdate={updateCommission}
  onDelete={deleteCommission} 
  onEdit={setEditingCommission} 
/>
</div>
))}
{appView === 'commission_form' && (
    <CommissionForm 
        onNavigateHome={handleNavigateToHome} 
        productOptions={productOptions} 
        onAddCommission={async (data) => { await addCommission({...data, artistId: '暹羅', source: 'general'}); }} 
        onComplete={() => setAppView('tracker')}
        customTitle={formConfig.title}
        customSubtitle={formConfig.subtitle}
    />
)}
{appView === 'nocy_shop' && (
    <NocyShop
        onNavigateHome={handleNavigateToHome}
        productOptions={productOptions}
        onAddCommission={async (data) => { await addCommission({...data, artistId: '暹羅', source: 'nocy'}); }}
        onComplete={() => setAppView('tracker')}
        showcaseItems={showcaseItems}
    />
)}
</div>
<div className="mt-20 pt-10 border-t border-stone-100 flex flex-col items-center">
<button onClick={toggleViewMode} className="flex items-center gap-2 text-stone-300 hover:text-stone-500 transition-colors font-bold text-xs" title={isAdminView ? '切換至委託者視視角' : '暹羅開門'}>{isAdminView ? <Unlock size={14} /> : <Lock size={14} />}</button>
</div>
<AddCommissionModal isOpen={isAddingModalOpen} onClose={() => setIsAddingModalOpen(false)} onAdd={(data) => addCommission({...data, artistId: '暹羅', source: adminType || 'nocy'})} productOptions={productOptions} />
<ProductManagerModal isOpen={isProductManagerOpen} onClose={() => setIsProductManagerOpen(false)} productOptions={productOptions} onSave={updateProductOptions} />
<GalleryManagerModal isOpen={isGalleryManagerOpen} onClose={() => setIsGalleryManagerOpen(false)} items={showcaseItems} onAdd={addShowcaseItem} onRemove={removeShowcaseItem} />
<EditCommissionModal isOpen={!!editingCommission} onClose={() => setEditingCommission(null)} commission={editingCommission} onSave={updateCommission} />
</div>
);
};
export default App;
