
import React, { useState, useEffect } from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { PaymentHistory } from './PaymentHistory';
import { CourseAccess } from './CourseAccess';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/services/subscriptionService';
import { Subscription, Payment } from '@/types/subscription';

export const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [subscriptionData, paymentsData] = await Promise.all([
        subscriptionService.getCurrentSubscription(user.id),
        subscriptionService.getPaymentHistory(user.id)
      ]);
      
      setSubscription(subscriptionData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Acesso negado
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Você precisa estar logado para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        Minha Assinatura
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Gerencie sua assinatura, acesse seus cursos e visualize seu histórico de pagamentos
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SubscriptionCard subscription={subscription} onUpdate={loadData} />
          <CourseAccess />
        </div>
        
        <div>
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </div>
  );
};
