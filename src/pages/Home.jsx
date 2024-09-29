// import Navbar from "../components/layouts/Navbar.jsx";
// import HistogramChart from "../components/layouts/HistogramChart.jsx"
import Card from "../components/Elements/Card";
import Option from "../components/Elements/Option";
import Footer from "../components/layouts/Footer";

const Home = () => {
    //   const data = {
    //     labels: ['Bin 1', 'Bin 2', 'Bin 3', 'Bin 4'],
    //     datasets:[
    //         {
    //             label: 'Histogram',
    //             data: [12, 19, 3, 5],
    //             backgroundColor: 'rgba(75, 192, 192, 0.6)'
    //         }
    //     ]
    // };

  return(
      <>
        <div className="flex justify-center">
        <div className="card mt-5 w-full mx-auto p-5 shadow-2xl">
          <Card.Header title="Konversi Citra Ke Histogram" description="Pilih Citra Yang Ingin Di Konversi">
              <Option classname="btn-block bg-success hover:bg-success" href="/rgb">Citra RGB</Option>
              <Option classname="btn-block bg-success hover:bg-success" href="/gray">Citra Gray</Option>
          </Card.Header>
          <Footer/>
        </div>
        </div>
      </>


  )
}

export default Home;
