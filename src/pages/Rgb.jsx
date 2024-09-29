import Card from "../components/Elements/Card";
import InsertImage from "../components/Elements/InsertImage";
import Modal from "../components/Elements/Modal";
import Button from "../components/Elements/Button";
import HistogramChart from "../components/layouts/HistogramChart.jsx";
import { useEffect, useState } from "react";
import Statistics from "../components/Fragments/Statistics.jsx";
import Footer from "../components/layouts/Footer.jsx";

const Rgb = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [normalizedData, setNormalizedData] = useState({
    labels: [],
    datasets: [],
  });
  const [statistics, setStatistics] = useState({
    red: {},
    green: {},
    blue: {},
  });
  const [normalizedStatistics, setNormalizedStatistics] = useState({
    red: {},
    green: {},
    blue: {},
  });
  const [image, setImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [his, setHis] = useState(null);
  const [normalizedHis, setNormalizedHis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const submit = async () => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:3000/rgb", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();

      setHis(jsonResponse.histogram);
      setNormalizedHis(jsonResponse.normalized_histogram);
      setStatistics(jsonResponse.statistics);
      setNormalizedStatistics(jsonResponse.normalized_statistics);
      setUploadedImage(`http://127.0.0.1:3000/uploads/${jsonResponse.image}`);
      openModal();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.getElementById("gray").showModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (his) {
      setData({
        labels: Array.from({ length: 256 }, (_, i) => i),
        datasets: [
          {
            label: "Red",
            data: his.red,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
          {
            label: "Green",
            data: his.green,
            backgroundColor: "rgba(0, 128, 0, 0.6)",
          },
          {
            label: "Blue",
            data: his.blue,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });
    }
  }, [his]);

  useEffect(() => {
    if (normalizedHis) {
      setNormalizedData({
        labels: Array.from({ length: 256 }, (_, i) => i),
        datasets: [
          {
            label: "Normalisasi Red",
            data: normalizedHis.red,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
          {
            label: "Normalisasi Green",
            data: normalizedHis.green,
            backgroundColor: "rgba(0, 128, 0, 0.6)",
          },
          {
            label: "Normalisasi Blue",
            data: normalizedHis.blue,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });
    }
  }, [normalizedHis]);

  useEffect(() => {
    if (isModalOpen) {
      setImage("");
    }
  }, [isModalOpen]);

  return (
    <div className="flex justify-center">
      <div className="card mt-5 mx-auto p-5 shadow-2xl">
        <Card>
          <Card.Header
            title="Citra RGB"
            description="Konversi Citra RGB Ke Histogram"
          >
            <InsertImage image={image} onChange={handleUpload} />
            <div className="card-actions justify-center mt-4 gap-8">
              <a href="/">
                <Button
                  classname="btn btn-error text-white px-8 py-4"
                  role="button"
                  href="/"
                >
                  Back
                </Button>
              </a>
              <Button
                id="gray"
                classname="btn btn-primary hover:bg-primary text-white px-8 py-4"
                role="submit"
                onClick={submit}
              >
                Submit
              </Button>
            </div>
            <Modal id="gray">
              <Modal.Body title="Histogram Citra RGB" closeModal={closeModal}>
                <div className="flex justify-center">
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="mb-4 w-80 h-80"
                    />
                  )}
                </div>
                <div className="mb-4 mt-4 gap-8">
                  <h2 className="font-bold text-xl">Histogram Citra RGB</h2>
                  <HistogramChart data={data} />
                  <h1 className="font-bold text-2xl">Statistics</h1>
                  <Statistics title="Citra Red" statistics={statistics.red} />
                  <Statistics
                    title="Citra Green"
                    statistics={statistics.green}
                  />
                  <Statistics title="Citra Blue" statistics={statistics.blue} />
                </div>
                <div className="mb-4 mt-4 gap-8">
                  <h1 className="font-bold text-2xl">
                    Histogram Normalisasi Citra RGB
                  </h1>
                  <HistogramChart data={normalizedData} />
                  <h1 className="font-bold text-2xl">
                    Statistics Normalisasi Citra RGB
                  </h1>
                  <Statistics
                    title="Normalisasi Citra Red"
                    statistics={normalizedStatistics.red}
                  />
                  <Statistics
                    title="Normalisasi Citra Green"
                    statistics={normalizedStatistics.green}
                  />
                  <Statistics
                    title="Normalisasi Citra Blue"
                    statistics={normalizedStatistics.blue}
                  />
                </div>
              </Modal.Body>
            </Modal>
          </Card.Header>
          {/* <Footer /> */}
        </Card>
      </div>
    </div>
  );
};

export default Rgb;
