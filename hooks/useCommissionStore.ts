import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Commission, CommissionStatus } from '../types';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useCommissionStore = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'commissions'), orderBy('dateAdded', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Commission)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addCommission = async (data: any) => {
    await addDoc(collection(db, 'commissions'), { 
      ...data, 
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
  };

  const updateCommissionStatus = async (id: string, status: CommissionStatus) => {
    await updateDoc(doc(db, 'commissions', id), { 
      status,
      lastUpdated: new Date().toISOString()
    });
  };

  const updateCommission = async (id: string, data: Partial<Commission>) => {
    await updateDoc(doc(db, 'commissions', id), { 
      ...data,
      lastUpdated: new Date().toISOString()
    });
  };

  const deleteCommission = async (id: string) => { 
    await deleteDoc(doc(db, 'commissions', id)); 
  };

  return { commissions, loading, addCommission, updateCommissionStatus, updateCommission, deleteCommission };
};