import React from 'react';
import { StripeDiagnostics } from '@/components/payments/stripe-diagnostics';
import Layout from '@/components/layout';

export function StripeDiagnosticsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Diagnóstico de pagos con Stripe</h1>
        <StripeDiagnostics />
      </div>
    </Layout>
  );
}