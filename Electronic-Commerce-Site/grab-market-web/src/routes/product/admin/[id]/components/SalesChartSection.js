import React from 'react';
import { SimpleLineChart } from '../../../../../components/charts/LineChart';

export default function SalesChartSection({ chart }) {
  return (
    <section className="admin-product-detail__chart">
      <div className="section-header">
        <div>
          <div className="section-title">Monthly Sales</div>
          <div className="section-subtitle">최근 12개월 판매 추이</div>
        </div>
      </div>
      <SimpleLineChart
        labels={chart.labels}
        datasets={chart.datasets}
        height={320}
        emptyMessage="판매 데이터가 없습니다."
      />
    </section>
  );
}

