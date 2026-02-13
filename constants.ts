import { CommissionStatus, ProductOptions } from './types';

export const STATUS_STEPS = [
  CommissionStatus.APPLYING, 
  CommissionStatus.DISCUSSION, 
  CommissionStatus.DEPOSIT_PAID,
  CommissionStatus.QUEUED, 
  CommissionStatus.IN_PRODUCTION, 
  CommissionStatus.COMPLETED, 
  CommissionStatus.SHIPPED,
];

export const CATEGORY_ORDER = ['正方形', '長方形', '圓形', '異形', '徽章磚', '雙色磚'];

export const productOptions: ProductOptions = {
  '正方形': [
    { name: '5x5cm正方形', price: 120, img: 'https://picsum.photos/seed/sq1/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}] },
    { name: '6x6cm正方形', price: 120, img: 'https://picsum.photos/seed/sq2/400', addons: [{name: '特殊亮片', price: 30}, {name: 'PET膠帶', price: 20}] },
  ],
  '長方形': [
    { name: '5.5x8.5cm長方形', price: 200, img: 'https://picsum.photos/seed/rect3/400', addons: [{name: '多層流沙層', price: 50}, {name: '立牌款式', price: 60}] },
  ],
};