
export enum CommissionStatus {
  APPLYING = '申請中',
  DISCUSSION = '討論中',
  DEPOSIT_PAID = '已付定金',
  QUEUED = '排單中',
  ESTABLISHED = '委託成立',
  DRAFTING = '效果圖繪製中',
  DRAFT_CHECK = '效果圖確認中',
  DRAFT_CONFIRMED = '效果圖已確認',
  IN_PRODUCTION = '小餅製作中',
  PRODUCT_CHECK = '成品圖已確認',
  SHIPPED_BY_ARTIST = '老師已發貨',
  WAREHOUSE_RECEIVED = '集運倉已入倉',
  SHIPPING_INTL = '集運中',
  PACKING = '暹羅分裝中',
  SHIPPED_LOCALLY = '暹羅已出貨',
  COMPLETED = '已送達(委託完成)'
}

export interface Commission {
  id: string;
  artistId: string;
  clientName: string;
  contact?: string;
  title: string;
  description: string;
  type: string;
  price: number;
  status: CommissionStatus;
  dateAdded: string;
  lastUpdated: string;
  thumbnailUrl?: string;
  imageUrls?: string[]; // 支援多張參考圖
  notes?: string;
  source?: 'nocy' | 'general'; // 訂單來源
  
  // 新增欄位：製作進度
  currentProgress?: string;
  progressImageUrls?: string[];
}

export type ThemeMode = 'client' | 'admin';
export interface Addon { name: string; price: number; }
export interface Product { name: string; price: number; img: string; addons?: Addon[]; }
export interface ProductOptions { [key: string]: Product[]; }

export interface ShowcaseItem {
  id: string;
  url: string;
  dateAdded: number;
}
