import React from 'react';
import { LineChart as RechartsLineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * LineChartDataset 타입 정의
 * @typedef {Object} LineChartDataset
 * @property {string} label - 데이터셋의 레이블
 * @property {number[]} data - 데이터 값 배열
 * @property {string} borderColor - 선 색상
 * @property {boolean} [fill] - 영역 채우기 여부
 * @property {number} [tension] - 곡선의 부드러움 (0-1)
 * @property {number[]} [borderDash] - 점선 패턴 [실선길이, 공백길이]
 */

/**
 * BaseLineChart 컴포넌트
 * recharts를 사용한 기본 라인 차트
 */
export const BaseLineChart = ({ 
  labels, 
  datasets, 
  title, 
  height = 300,
  showLegend = true,
  showGrid = true 
}) => {
  // labels와 datasets를 recharts 형식으로 변환
  const chartData = labels.map((label, index) => {
    const dataPoint = { name: label };
    datasets.forEach((dataset, datasetIndex) => {
      // 데이터셋의 label을 키로 사용하거나, dataset_0, dataset_1 등의 키 사용
      const key = dataset.label || `dataset_${datasetIndex}`;
      dataPoint[key] = dataset.data[index] || 0;
    });
    return dataPoint;
  });

  return (
    <div style={{ height: `${height}px` }}>
      {title && (
        <h3 style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          color: '#1A1A1A'
        }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis 
            dataKey="name" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          {showLegend && <Legend />}
          {datasets.map((dataset, index) => {
            const key = dataset.label || `dataset_${index}`;
            const borderColor = dataset.borderColor || '#1A1A1A';
            const fillColor = dataset.fillColor || borderColor;
            const fillOpacity = dataset.fillOpacity !== undefined ? dataset.fillOpacity : 0.1;
            
            return (
              <React.Fragment key={index}>
                {dataset.fill && (
                  <Area
                    type={dataset.tension ? "monotone" : "linear"}
                    dataKey={key}
                    stroke="none"
                    fill={fillColor}
                    fillOpacity={fillOpacity}
                  />
                )}
                <Line
                  type={dataset.tension ? "monotone" : "linear"}
                  dataKey={key}
                  stroke={borderColor}
                  strokeWidth={dataset.strokeWidth || 2}
                  name={dataset.label}
                  strokeDasharray={dataset.borderDash ? dataset.borderDash.join(' ') : undefined}
                  dot={{ r: 4, fill: borderColor }}
                  activeDot={{ r: 6 }}
                />
              </React.Fragment>
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * SimpleLineChart 컴포넌트의 Props
 * @typedef {Object} SimpleLineChartProps
 * @property {string[]} labels - X축의 라벨 배열
 * @property {LineChartDataset[]} datasets - 데이터셋 배열 (복수의 선을 지원)
 * @property {string} [title] - 그래프의 제목
 * @property {number} [height] - 그래프의 높이 (픽셀)
 * @property {boolean} [loading] - 로딩 상태
 * @property {string} [emptyMessage] - 데이터가 없을 때의 메시지
 */

/**
 * SimpleLineChart 컴포넌트
 * 어디서든 사용할 수 있는 범용적인 라인 차트
 * 
 * @example
 * // 단일 선
 * <SimpleLineChart
 *   labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
 *   datasets={[
 *     {
 *       label: 'Revenue',
 *       data: [350000, 420000, 380000, 450000, 500000],
 *       borderColor: 'rgb(16, 185, 129)',
 *       fill: true,
 *     }
 *   ]}
 * />
 * 
 * @example
 * // 복수의 선 (실선과 점선)
 * <SimpleLineChart
 *   labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
 *   datasets={[
 *     {
 *       label: 'Revenue',
 *       data: [350000, 420000, 380000, 450000, 500000],
 *       borderColor: 'rgb(16, 185, 129)',
 *       fill: true,
 *       tension: 0.4,
 *     },
 *     {
 *       label: 'Target',
 *       data: [400000, 400000, 400000, 400000, 400000],
 *       borderColor: 'rgb(59, 130, 246)',
 *       borderDash: [5, 5],
 *       fill: false,
 *     }
 *   ]}
 * />
 */
export const SimpleLineChart = ({ 
  labels,
  datasets,
  title,
  height = 300,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div style={{ 
        height: `${height}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#FAFAFA',
        borderRadius: '8px',
        color: '#9CA3AF',
        fontSize: '14px'
      }}>
        Loading chart data...
      </div>
    );
  }

  if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
    return (
      <div style={{ 
        height: `${height}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#FAFAFA',
        borderRadius: '8px',
        color: '#9CA3AF',
        fontSize: '14px'
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <BaseLineChart
      labels={labels}
      datasets={datasets}
      title={title}
      height={height}
      showLegend={true}
      showGrid={true}
    />
  );
};

export default SimpleLineChart;

/**
 * 기존 형식의 LineChart 컴포넌트 (하위 호환성)
 * data, dataKey, name props를 사용하는 간단한 라인 차트
 */
export const LineChart = ({ data, dataKey, name, stroke = '#1A1A1A', strokeWidth = 2 }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} name={name} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
