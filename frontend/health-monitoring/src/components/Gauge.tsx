import React from 'react';
import GaugeComponent from 'react-gauge-chart';

type GaugeProps = {
  value: number;
  minValue?: number;
  maxValue?: number;
  textColor?: string;
  title: string;
};

const Gauge: React.FC<GaugeProps> = ({ value, minValue = 0, maxValue = 100, textColor = '#000', title }) => {
  return (
    <div className="gauge-container">
      <GaugeComponent
        id="gauge"
        nrOfLevels={30}
        percent={value / maxValue}
        textColor={textColor}
        arcPadding={0.02}
        style={{ width: '100%', height: '100%' }}
      />
      <div className="gauge-value" style={{ color: textColor }}>
        {value} {title}
      </div>
    </div>
  );
};

export default Gauge;