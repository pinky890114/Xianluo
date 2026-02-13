import React, { useState } from 'react';
import { ProductOptions, ShowcaseItem } from '../types';
import { CommissionForm } from './CommissionForm';
import { ArrowLeft, Image as ImageIcon, ShoppingBag, CheckCircle, Clock, ChevronRight, AlertCircle, Info, Shirt, Truck, Wallet, FileText, Camera, X } from 'lucide-react';

interface Props {
  onNavigateHome: () => void;
  productOptions: ProductOptions;
  showcaseItems?: ShowcaseItem[];
  onAddCommission: (data: any) => void;
}

type ShopTab = 'intro' | 'showcase' | 'order' | 'supplies';
type OrderStep = 'tos' | 'workflow' | 'form';

interface SupplyItem {
  name: string;
  price: number;
  img: string;
  description: string;
}

export const NocyShop: React.FC<Props> = ({ onNavigateHome, productOptions, onAddCommission, showcaseItems = [] }) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('intro');
  const [orderStep, setOrderStep] = useState<OrderStep>('tos');
  const [selectedSupply, setSelectedSupply] = useState<SupplyItem | null>(null);

  const supplies: SupplyItem[] = [
    { 
      name: '基礎款立牌包', 
      price: 75, 
      img: 'https://i.ibb.co/tTv9By3b/IMG-4596.jpg',
      description: '- 大創賣的普通立牌包，每一個尺寸是11×2.5×16cm，適配大多數小餅的長寬（有帽子的不一定可以）\n- 附圖有黑色的內裡跟背面樣式，我直接去大創網站上抓的，**網站上直接買是隨機顏色出貨**\n- 顏色有黑、白、紅、粉、藍、紫、橘、黃、綠，可以挑色但現場不一定有，沒有的話可以退款或換其他顏色\n- 如果不確定自己的小餅裝不裝得下，可以在小餅到貨之後直接讓我帶去門市裡比對拍照或者拆我現在有的來裝看看'
    },
    { 
      name: '保麗龍膠', 
      price: 13, 
      img: 'https://i.ibb.co/ch8j65Ft/image.png',
      description: '- 一瓶是30ml，這是我目前能找到最小容量的包裝\n- 沒有什麼特別之處，只是我之前住的地方附近沒有文具店，所以覺得要另外找時間去買這種東西很麻煩\n- 如果小餅的衣服或配件玩久了有點鬆脫，可以用牙籤勾一些抹上去沾牢，記得不要碰到酒精'
    },
    { 
      name: '保護膜標籤紙', 
      price: 4, 
      img: 'https://i.ibb.co/MyBzxqKW/image.png',
      description: '- 每張有20個標籤貼紙，每一個尺寸是1.4×2.6cm\n- 是普通貼紙的升級版本，表面上有一層自黏塑膠膜，可以在寫完之後貼住，就不會磨損或暈開\n- 我會把外觀名字寫了貼在收納袋上，就可以知道這一格原先放的是哪一套衣服\n- 跟文具店賣的一模一樣，我也是去文具店買的，只是一包有200個貼紙感覺一般人用不完'
    },
    { 
      name: 'A5活頁收納袋', 
      price: 8, 
      img: 'https://i.ibb.co/twHJmPN9/image.png',
      description: '- 有分成一頁單格或雙格的款式。尺寸及放置後的樣式可參考附圖\n- 我用來收納沒有穿的衣服，長髮或有髮冠建議用單格款，雙格適合裝衣服、飾品或短髮\n- 如果要挑選外殼需要孔距參考的話，1-2、2-3、4-5、5-6的孔距是19mm、3-4的距離則是70cm'
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Shop Header */}
      <div className="flex items-center gap-4 mb-6">
          <button onClick={onNavigateHome} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-[#5D4037]">Nocy 餅舖</h2>
            <p className="text-stone-500 text-sm">手工娃娃 / 印象訂製 / 販售快樂</p>
          </div>
      </div>

      {/* Navigation Tabs */}
      {orderStep !== 'form' && (
          <div className="flex p-1 bg-stone-100 rounded-2xl mb-8 mx-auto max-w-xl overflow-x-auto">
            {[
                { id: 'intro', icon: Info, label: '小餅介紹' },
                { id: 'showcase', icon: ImageIcon, label: '成品展示' },
                { id: 'order', icon: ShoppingBag, label: '帶小餅回家' },
                { id: 'supplies', icon: Shirt, label: '小餅用品' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ShopTab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-white text-[#5D4037] shadow-sm' 
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
          </div>
      )}

      {/* Content Area */}
      <div className="bg-white border-2 border-stone-100 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px]">
        
        {/* 1. 小餅介紹 Intro */}
        {activeTab === 'intro' && (
            <div className="text-center space-y-8 animate-in fade-in duration-500">
                <div className="max-w-2xl mx-auto space-y-6">
                    <h3 className="text-2xl font-bold text-[#5D4037]">關於 Nocy 小餅</h3>
                    <div className="text-stone-600 leading-loose text-justify px-4 sm:px-12 space-y-4">
                        <p>
                            小餅其實是大陸的手作老師 <span className="font-bold text-[#A1887F]">Nocy</span> 做的一種可換裝式不織布娃娃，特色是跟劍三的乘黃小餅一樣扁得像是被壓過因此得名。
                        </p>
                        <p>
                            不管是自家OC、影視人物、動畫角色、喜歡的Vtuber，<span className="font-bold text-[#5D4037]">只要有清晰圖片老師都可以努力一下！</span>
                        </p>
                        <p>
                            相比於普通的棉花娃，小餅有便宜、不占空間和方便攜帶的優點。
                            不僅訂製一隻價格只要三位數，可以根據當天心情搭配OOTD，甚至放在立牌包裡就能輕鬆帶出門。
                        </p>
                        <p>
                            更別說只要活頁本 and 收納袋就能直接打造小餅衣櫃，媽媽想罵你又亂花錢買娃娃都不一定能找到。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="p-6 bg-[#FAF8F5] rounded-2xl text-center border border-[#EFEBE9] flex flex-col justify-center hover:border-[#A1887F]/30 transition-colors">
                            <div className="font-bold text-[#5D4037] text-xl mb-1">純手工</div>
                            <div className="text-xs font-bold text-[#A1887F] tracking-widest uppercase">Handmade</div>
                        </div>
                        <div className="p-6 bg-[#FAF8F5] rounded-2xl text-center border border-[#EFEBE9] flex flex-col justify-center hover:border-[#A1887F]/30 transition-colors">
                            <div className="font-bold text-[#5D4037] text-xl mb-1">客製化</div>
                            <div className="text-xs font-bold text-[#A1887F] tracking-widest uppercase">Customized</div>
                        </div>
                        <div className="p-6 bg-[#FAF8F5] rounded-2xl text-center border border-[#EFEBE9] flex flex-col justify-center hover:border-[#A1887F]/30 transition-colors">
                            <div className="font-bold text-[#5D4037] text-xl mb-1">零熱量</div>
                            <div className="text-xs font-bold text-[#A1887F] tracking-widest uppercase">Zero Calorie</div>
                        </div>
                    </div>
                </div>
                <button onClick={() => setActiveTab('order')} className="mt-8 bg-[#A1887F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#8D6E63] transition shadow-lg shadow-[#A1887F]/20">
                    帶一隻小餅回家
                </button>
            </div>
        )}

        {/* 2. 成品展示 Showcase */}
        {activeTab === 'showcase' && (
            <div className="animate-in fade-in duration-500">
                {showcaseItems.length === 0 ? (
                    <div className="text-center py-20 text-stone-400">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>目前還沒有成品展示圖片</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {showcaseItems.map((item) => (
                            <div key={item.id} className="aspect-square bg-stone-50 rounded-2xl overflow-hidden hover:opacity-90 transition group cursor-pointer relative">
                                <img src={item.url} alt="showcase" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-center text-stone-400 text-sm mt-8">更多作品請查看Discord</p>
            </div>
        )}

        {/* 3. 帶小餅回家 Order Process */}
        {activeTab === 'order' && (
            <div>
                {/* Progress Indicator for Order */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${orderStep === 'tos' ? 'bg-[#5D4037] text-white' : 'bg-[#EFEBE9] text-stone-400'}`}>1</span>
                        <span className="text-sm font-bold text-[#5D4037]">須知</span>
                    </div>
                    <div className="w-12 h-0.5 bg-stone-200 mx-2" />
                    <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${orderStep === 'workflow' ? 'bg-[#5D4037] text-white' : 'bg-[#EFEBE9] text-stone-400'}`}>2</span>
                        <span className={`text-sm font-bold ${orderStep === 'workflow' ? 'text-[#5D4037]' : 'text-stone-300'}`}>流程</span>
                    </div>
                    <div className="w-12 h-0.5 bg-stone-200 mx-2" />
                    <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${orderStep === 'form' ? 'bg-[#5D4037] text-white' : 'bg-[#EFEBE9] text-stone-400'}`}>3</span>
                        <span className={`text-sm font-bold ${orderStep === 'form' ? 'text-[#5D4037]' : 'text-stone-300'}`}>填單</span>
                    </div>
                </div>

                {/* Step 1: TOS */}
                {orderStep === 'tos' && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                        <h3 className="text-2xl font-bold text-center text-[#5D4037] mb-6">🍰 領養須知與委託詳情</h3>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl shadow-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20}/>
                                <div>
                                    <h4 className="font-bold text-amber-800 mb-1">權益說明 (必讀)</h4>
                                    <p className="text-amber-700 text-sm leading-relaxed">
                                        除了自家 OC 之外的定製商品均非買斷，會二次售賣（翻譯起來就是拒同擔慎約）。
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFEBE9] space-y-4 text-stone-600">
                             <h4 className="font-bold text-[#5D4037] text-lg flex items-center gap-2 mb-2"><FileText size={20}/> 基本規則</h4>
                            <ul className="space-y-3">
                                <li className="flex gap-3"><div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#A1887F]"></div><span>手工製品難免有微小氣泡或膠痕，完美主義者請三思。</span></li>
                                <li className="flex gap-3"><div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#A1887F]"></div><span>工期約 1.5 - 2 個月，具體根據該批次數量評估。</span></li>
                                <li className="flex gap-3"><div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#A1887F]"></div><span>確認排單後需<span className="font-bold text-[#5D4037]">全款支付</span>委託費以領取批號。</span></li>
                                <li className="flex gap-3"><div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-[#A1887F]"></div><span>會使用成品圖作為範例展示，若不想公開請提前告知。</span></li>
                            </ul>
                        </div>
                        <div className="bg-white border-2 border-stone-100 p-6 rounded-2xl space-y-4 text-stone-700">
                            <h4 className="font-bold text-[#5D4037] text-lg flex items-center gap-2"><Wallet size={20}/> 價格參考指標</h4>
                            <ul className="space-y-3 list-disc pl-5 text-sm">
                                <li><span className="font-bold">小餅素體 (裸體光頭娃娃)</span>：每隻 <span className="text-[#A1887F] font-bold">55元</span> 台幣。<span className="text-stone-400 ml-1">(大面積花紋則需另加 15-30 元)</span></li>
                                <li><span className="font-bold">全套 (頭髮+衣服+鞋子)</span>：約 <span className="text-[#A1887F] font-bold">600-800元</span> 左右。<span className="text-stone-400 ml-1">(女孩子可能會因精細度高而貴一點)</span></li>
                                <li><span className="font-bold">其他配飾</span>：帽子、眼鏡、面罩、手持物件等，需提供清晰圖片估價。</li>
                                <li><span className="font-bold">磁鐵加購</span>：需要在素體或物件上放置磁鐵，每個 <span className="text-[#A1887F] font-bold">5元</span>。</li>
                            </ul>
                        </div>
                        <div className="bg-white border-2 border-stone-100 p-6 rounded-2xl text-stone-700">
                            <h4 className="font-bold text-[#5D4037] text-lg flex items-center gap-2 mb-4"><Camera size={20}/> 資料提供須知</h4>
                            <div className="space-y-4 mb-8">
                                <div className="text-sm space-y-2">
                                    <p className="flex items-center gap-2 font-medium"><CheckCircle size={14} className="text-[#A1887F]"/> 正面全身（拼接沒有全身圖也沒關係）、背面全身</p>
                                    <p className="flex items-center gap-2 font-medium"><CheckCircle size={14} className="text-[#A1887F]"/> 正臉 + 髮型正面清晰圖</p>
                                    <p className="flex items-center gap-2 font-medium"><CheckCircle size={14} className="text-[#A1887F]"/> 正面上半身服裝及圖樣清晰圖</p>
                                    <p className="flex items-center gap-2 font-medium"><CheckCircle size={14} className="text-[#A1887F]"/> 正面下半身服裝及圖樣清晰圖（包含鞋子）</p>
                                    <p className="flex items-center gap-2 font-medium"><CheckCircle size={14} className="text-[#A1887F]"/> 完整髮型背面圖</p>
                                </div>
                            </div>
                            <div className="bg-[#FAF8F5] border-2 border-[#EFEBE9] rounded-2xl p-5 sm:p-8 text-center shadow-sm">
                                <div className="max-w-xl mx-auto rounded-xl mb-6 overflow-hidden border border-stone-200 shadow-md bg-white">
                                    <img src="https://i.ibb.co/Xk5Swg5T/image.png" alt="模特大江範例圖" className="w-full h-auto object-contain"/>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[#5D4037] font-bold text-lg">範例：模特大江</p>
                                    <p className="text-[#A1887F] font-bold text-base">(請發五張圖，勿合併)</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center pt-4 pb-10">
                            <button onClick={() => setOrderStep('workflow')} className="bg-[#5D4037] text-white px-10 py-4 rounded-full font-bold hover:bg-[#4E342E] transition flex items-center gap-2 text-lg shadow-lg shadow-[#5D4037]/20">我已閱讀並同意 <ChevronRight size={20}/></button>
                        </div>
                    </div>
                )}

                {/* Step 2: Workflow */}
                {orderStep === 'workflow' && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                         <h3 className="text-2xl font-bold text-center text-[#5D4037] mb-8">🚚 領養流程</h3>
                         <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                            {[
                                { title: '詢問與排單', desc: '委託人提供圖片 → 老師確認後報價 → 全款付款後領取批號（每批最多15隻）→ 當月收單時掌櫃告知預計出貨日' },
                                { title: '製作與監修', desc: '老師繪製效果圖 → 委託人確認無誤 → 老師開始製作 → 老師拍攝成品影片寄出' },
                                { title: '寄送與收貨', desc: '掌櫃把小餅集運回台灣 → 掌櫃收到小餅後分裝寄出 → 委託人貨到付款並拿到成品' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-8 bg-[#A1887F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ring-2 ring-[#A1887F]/20">{idx + 1}</div>
                                    <h4 className="font-bold text-[#5D4037] text-lg">{step.title}</h4>
                                    <p className="text-stone-500 text-sm leading-relaxed mt-1">{step.desc}</p>
                                </div>
                            ))}
                         </div>
                         <div className="flex justify-center gap-4 mt-10">
                            <button onClick={() => setOrderStep('tos')} className="text-stone-400 font-bold hover:text-stone-600">上一步</button>
                            <button onClick={() => setOrderStep('form')} className="bg-[#5D4037] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4E342E] transition flex items-center gap-2">開始填單 <ChevronRight size={18}/></button>
                        </div>
                    </div>
                )}

                {/* Step 3: Form */}
                {orderStep === 'form' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <CommissionForm onNavigateHome={() => setOrderStep('workflow')} productOptions={productOptions} onAddCommission={onAddCommission} customTitle="Nocy 餅舖委託單" customSubtitle="請詳細填寫您的小餅需求"/>
                    </div>
                )}
            </div>
        )}

        {/* 4. 小餅用品 Supplies */}
        {activeTab === 'supplies' && (
            <div className="animate-in fade-in duration-500">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#5D4037]">小餅配件屋</h3>
                    <p className="text-stone-500">點擊品項查看詳細介紹</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {supplies.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedSupply(item)}
                          className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EFEBE9] hover:border-[#A1887F] hover:shadow-md transition group cursor-pointer flex flex-col"
                        >
                            <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden relative shadow-sm">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300?text=品項圖片"; }}/>
                            </div>
                            <div className="text-center mt-auto">
                                <h4 className="font-bold text-[#5D4037] text-sm sm:text-base">{item.name}</h4>
                                <p className="text-[#A1887F] font-bold mt-1">NT$ {item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 bg-stone-50 p-6 rounded-2xl text-center border-2 border-dashed border-stone-200">
                    <p className="text-stone-500 text-sm mb-4">想要購買配件嗎？可以填寫委託單時一併備註，或是私訊店主喔！</p>
                    <button onClick={() => setActiveTab('order')} className="bg-[#5D4037] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#4E342E] transition">前往填單</button>
                </div>
            </div>
        )}

      </div>

      {/* Supplies Detail Modal */}
      {selectedSupply && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" 
          onClick={() => setSelectedSupply(null)}
        >
            <div 
              className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Top Close Button */}
                <button 
                  onClick={() => setSelectedSupply(null)} 
                  className="absolute top-6 right-6 z-[110] bg-white/80 hover:bg-white p-2 rounded-full text-stone-600 shadow-lg transition active:scale-95"
                >
                  <X size={20} />
                </button>

                {/* Scrollable Content Container */}
                <div className="overflow-y-auto flex-1 hide-scrollbar">
                    <div className="relative h-64 sm:h-80 bg-stone-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src={selectedSupply.img} 
                          alt={selectedSupply.name} 
                          className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-6">
                            <h3 className="text-2xl font-bold text-[#5D4037]">{selectedSupply.name}</h3>
                            <span className="text-xl font-bold text-[#A1887F]">NT$ {selectedSupply.price}</span>
                        </div>
                        <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#EFEBE9] mb-6">
                            <div className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                {selectedSupply.description}
                            </div>
                        </div>
                        <button 
                          onClick={() => setSelectedSupply(null)} 
                          className="w-full bg-[#5D4037] text-white py-4 rounded-full font-bold hover:bg-[#4E342E] transition shadow-lg shadow-[#5D4037]/10"
                        >
                            關閉介紹
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};