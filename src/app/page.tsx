'use client';

import { ClaimProvider } from '../context/ClaimContext';
import ClaimFlowManager from '../components/ClaimFlowManager';

export default function Home() {
  return (
    <ClaimProvider>
      <ClaimFlowManager />
    </ClaimProvider>
  );
}