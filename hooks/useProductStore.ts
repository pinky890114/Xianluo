import { useState } from 'react';
import { productOptions as initialOptions } from '../constants';
import { ProductOptions } from '../types';

export const useProductStore = () => {
  // In a real application, this would sync with Firestore. 
  // For now, we use local state initialized from constants.
  const [productOptions, setProductOptions] = useState<ProductOptions>(initialOptions);
  
  const updateProductOptions = (newOptions: ProductOptions) => {
    setProductOptions(newOptions);
    // TODO: persist to Firestore
  };

  return { productOptions, updateProductOptions };
};