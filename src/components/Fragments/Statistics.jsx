const Statistics = ({ title, statistics }) => {
    return (
        <div>
            <h3 className="font-bold">{title}</h3>
            <div>
                <p>Mean: {statistics.mean}</p>
                <p>Variance: {statistics.variance}</p>
                <p>Standard Deviation: {statistics.std_dev}</p>
            </div>
        </div>
    );
};

export default Statistics;
