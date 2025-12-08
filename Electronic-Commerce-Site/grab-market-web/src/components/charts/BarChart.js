import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * BarChartDataset 타입 정의
 * @typedef {Object} BarChartDataset
 * @property {string} label - 데이터셋의 레이블
 * @property {number[]} data - 데이터 값 배열
 * @property {string} backgroundColor - 막대 색상
 * @property {string} [borderColor] - 테두리 색상
 * @property {number} [borderWidth] - 테두리 너비
 */

/**
 * BaseBarChart 컴포넌트
 * recharts를 사용한 기본 바 차트
 */
export const BaseBarChart = ({ 
  labels, 
  datasets, 
  title, 
  height = 300,
  showLegend = true,
  showGrid = true,
  horizontal = false,
  stacked = false
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
        <RechartsBarChart 
          data={chartData}
          layout={horizontal ? "vertical" : "horizontal"}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} />
            </>
          )}
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
            const backgroundColor = dataset.backgroundColor || '#1A1A1A';
            const borderColor = dataset.borderColor || backgroundColor;
            const borderWidth = dataset.borderWidth || 0;
            
            return (
              <Bar
                key={index}
                dataKey={key}
                fill={backgroundColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
                name={dataset.label}
                stackId={stacked ? "stack" : undefined}
              />
            );
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * SimpleBarChart 컴포넌트의 Props
 * @typedef {Object} SimpleBarChartProps
 * @property {string[]} labels - X축의 라벨 배열
 * @property {BarChartDataset[]} datasets - 데이터셋 배열 (복수의 막대 그룹을 지원)
 * @property {string} [title] - 그래프의 제목
 * @property {number} [height] - 그래프의 높이 (픽셀)
 * @property {boolean} [loading] - 로딩 상태
 * @property {string} [emptyMessage] - 데이터가 없을 때의 메시지
 * @property {boolean} [horizontal] -横向き棒グラフにするか (デフォルト: false)
 * @property {boolean} [stacked] - 積み上げ棒グラフにするか (デフォルト: false)
 */

/**
 * SimpleBarChart 컴포넌트
 * 어디서든 사용할 수 있는 범용적인 바 차트
 * 
 * @example
 * // 단일 막대 그래프
 * <SimpleBarChart
 *   labels={['Product A', 'Product B', 'Product C']}
 *   datasets={[
 *     {
 *       label: 'Sales',
 *       data: [45, 23, 67],
 *       backgroundColor: 'rgba(99, 102, 241, 0.8)',
 *     }
 *   ]}
 * />
 * 
 * @example
 * // 복수의 막대 그래프 (그룹화)
 * <SimpleBarChart
 *   labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
 *   datasets={[
 *     {
 *       label: 'Product A',
 *       data: [12, 19, 3, 5, 2],
 *       backgroundColor: 'rgba(99, 102, 241, 0.8)',
 *     },
 *     {
 *       label: 'Product B',
 *       data: [5, 10, 2, 3, 1],
 *       backgroundColor: 'rgba(16, 185, 129, 0.8)',
 *     }
 *   ]}
 * />
 * 
 * @example
 * // 積み上げ棒グラフ
 * <SimpleBarChart
 *   labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
 *   datasets={[
 *     {
 *       label: 'Product A',
 *       data: [12, 19, 3, 5, 2],
 *     },
 *     {
 *       label: 'Product B',
 *       data: [5, 10, 2, 3, 1],
 *     }
 *   ]}
 *   stacked={true}
 * />
 */
export const SimpleBarChart = ({ 
  labels,
  datasets,
  title,
  height = 300,
  loading = false,
  emptyMessage = 'No data available',
  horizontal = false,
  stacked = false,
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
    <BaseBarChart
      labels={labels}
      datasets={datasets}
      title={title}
      height={height}
      showLegend={datasets.length > 1} // 複数データセットの場合のみ凡例表示
      showGrid={true}
      horizontal={horizontal}
      stacked={stacked}
    />
  );
};

export default SimpleBarChart;

/**
 * 기존 형식의 BarChart 컴포넌트 (하위 호환성)
 * data, dataKey, name props를 사용하는 간단한 바 차트
 */
export const BarChart = ({ data, dataKey, name, fill = '#1A1A1A' }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={fill} name={name} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

