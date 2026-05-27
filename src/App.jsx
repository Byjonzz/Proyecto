import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import MetricsSection from './components/Dashboard/MetricsSection';
import CoverageMap from './components/Dashboard/CoverageMap';
import RecentActivity from './components/Dashboard/RecentActivity';
import NewProspect from './components/Forms/NewProspect';
import PlanAndQuotation from './components/Forms/PlanAndQuotation';
import ContractAndSignature from './components/Forms/ContractAndSignature';
import Evidence from './components/Dashboard/Evidence';
import LeadsFollowUp from './components/Dashboard/LeadsFollowUp';
import InstallationSchedule from './components/Dashboard/InstallationSchedule';
import ProspectDetails from './components/Dashboard/ProspectDetails';
import Reports from './components/Dashboard/Reports';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MetricsSection />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CoverageMap />
              </div>
            </div>
            <RecentActivity />
            <ProspectDetails />
            <InstallationSchedule />
            <LeadsFollowUp />
            <Reports />
          </div>
        );
      case 'newProspect':
        return <NewProspect />;
      case 'plan':
        return <PlanAndQuotation />;
      case 'contract':
        return <ContractAndSignature />;
      case 'evidence':
        return <Evidence />;
      default:
        return (
          <div className="space-y-6">
            <MetricsSection />
            <CoverageMap />
            <RecentActivity />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
