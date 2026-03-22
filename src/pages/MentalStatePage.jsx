import React from 'react';
import MentalForm from '../components/MentalForm';
import MentalHistory from '../components/MentalHistory';
import MentalChart from '../components/Charts/MentalChart';

const MentalStatePage = () => {
  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Mental State</div>
        <div className="page-sub">Track mood, energy, focus and motivation</div>
      </div>

      <MentalForm />

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Trends (last 14 days)</div>
          <div className="chart-wrap">
            <MentalChart />
          </div>
        </div>
        <div className="card">
          <div className="card-title">History</div>
          <MentalHistory />
        </div>
      </div>
    </div>
  );
};

export default MentalStatePage;
