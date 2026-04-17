import { Helmet } from 'react-helmet-async';
import TrendDashboard from '../components/TrendDashboard';

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Trend Dashboard — ShopSense AI</title>
        <meta name="description" content="Real-time shopping trends, price charts, and AI-powered insights for Indian shoppers." />
        <link rel="canonical" href="https://shopsense-ai.web.app/dashboard" />
      </Helmet>
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <TrendDashboard />
      </main>
    </>
  );
}

export default Dashboard;
