import BarChart from "../Elements/BarChart.jsx";

const HistogramChart = ({data}) => {
    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Nilai Keabuan',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Jumlah Pixel',
                },
            },
        },
    };

    const chartData = {
        labels:data.labels,
        datasets: data.datasets
    }

    return (
        <>
        <BarChart option={options} chartData = {chartData}/>
        </>
    )

}

export default HistogramChart;