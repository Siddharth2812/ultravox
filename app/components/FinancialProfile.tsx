import React, { useState, useEffect } from 'react';
import { FinancialProfileData } from '@/lib/types';

const FinancialProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<FinancialProfileData | null>(null);

  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent<FinancialProfileData>) => {
      setProfileData(event.detail);
    };

    const handleCallEnded = () => {
      setProfileData(null);
    };

    window.addEventListener('financialProfileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('financialProfileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  if (!profileData) {
    return (
      <div className="mt-10">
        <h1 className="text-xl font-bold mb-4">Financial Profile</h1>
        <div className="shadow-md rounded p-4">
          <span className="text-gray-500 text-base font-mono">No profile data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold mb-4">Financial Profile</h1>
      <div className="shadow-md rounded p-4 space-y-4">
        <section>
          <h2 className="text-gray-400 font-mono mb-2">Personal Information</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Age: {profileData.personalInfo.age}</p>
            <p>Employment: {profileData.personalInfo.employmentStatus}</p>
            <p>Dependents: {profileData.personalInfo.dependents}</p>
          </div>
        </section>

        <section>
          <h2 className="text-gray-400 font-mono mb-2">Financial Status</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Annual Income: {profileData.financialStatus.annualIncome}</p>
            <p>Monthly Expenses: ${profileData.financialStatus.monthlyExpenses}</p>
            <p>Obligations: {profileData.financialStatus.obligations.join(', ')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-gray-400 font-mono mb-2">Investments</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Current Savings: ${profileData.investments.currentSavings}</p>
            <p>Investment Accounts: {profileData.investments.investmentAccounts.join(', ')}</p>
            <p>Retirement Plans: {profileData.investments.retirementPlans.join(', ')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-gray-400 font-mono mb-2">Risk Profile</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Risk Tolerance: {profileData.riskProfile.riskTolerance}</p>
            <p>Investment Experience: {profileData.riskProfile.investmentExperience}</p>
            <p>Time Horizon: {profileData.riskProfile.timeHorizon}</p>
          </div>
        </section>

        <section>
          <h2 className="text-gray-400 font-mono mb-2">Insurance</h2>
          <div className="pl-4 border-l-2 border-gray-200">
            <p>Current Policies: {profileData.insurance.currentPolicies.join(', ')}</p>
            <p>Coverage Gaps: {profileData.insurance.coverageGaps.join(', ')}</p>
            <p>Future Needs: {profileData.insurance.futureNeeds.join(', ')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FinancialProfile;