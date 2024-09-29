import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const BarChart = (props) => {
    const {option, chartData} = props
    // console.log(option)
    // console.log(chartData)
    return <Bar options={option} data={chartData} />;
};

export default BarChart;
