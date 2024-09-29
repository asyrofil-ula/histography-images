import { useEffect, useState } from "react";
import Card from "../components/Elements/Card";
import InsertImage from "../components/Elements/InsertImage";
import Modal from "../components/Elements/Modal";
import Button from "../components/Elements/Button";
import HistogramChart from "../components/layouts/HistogramChart.jsx";
import Statistics from "../components/Fragments/Statistics.jsx";
import Footer from "../components/layouts/Footer.jsx";

const Gray = () => {
    const [image, setImage] = useState('');
    const [his, setHis] = useState([]);
    const [data, setData] = useState({
        labels: [],
        datasets: [],
    });
    const [statistics, setStatistics] = useState(null);
    const [normalizedHis, setNormalizedHis] = useState([]);
    const [normalizedData, setNormalizedData] = useState({
        labels: [],
        datasets: [],
    });
    const [normalizedStatistics, setNormalizedStatistics] = useState(null);
    const [originalImage, setOriginalImage] = useState('');
    const [grayscaleImage, setGrayscaleImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = (event) => {
        setImage(event.target.files[0]);
    };

    const submitImage = async () => {
        const formData = new FormData();
        formData.append('file', image);

        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://127.0.0.1:3000/gray', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Unknown error');
            }

            const jsonResponse = await response.json();

            setHis(jsonResponse.histogram);
            setNormalizedHis(jsonResponse.normalized_histogram);
            setStatistics(jsonResponse.statistics);
            setNormalizedStatistics(jsonResponse.normalized_statistics);
            setOriginalImage(`http://127.0.0.1:3000/uploads/${jsonResponse.original_image}`);
            setGrayscaleImage(`http://127.0.0.1:3000/uploads/${jsonResponse.grayscale_image}`);
            openModal();
        } catch (error) {
            setError(`There was a problem with the fetch operation: ${error.message}`);
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        document.getElementById('gray').showModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (his.length) {
            setData({
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [
                    {
                        label: 'Histogram Citra Grayscale',
                        data: his,
                        backgroundColor: 'rgba(114, 91, 91, 0.53)',
                    },
                ],
            });
        }
    }, [his]);

    useEffect(() => {
        if (normalizedHis.length) {
            setNormalizedData({
                labels: Array.from({ length: 256 }, (_, i) => i),
                datasets: [
                    {
                        label: 'Histogram Citra Grayscale Normalisasi',
                        data: normalizedHis,
                        backgroundColor: 'rgba(114, 91, 91, 0.53)',
                    },
                ],
            });
        }
    }, [normalizedHis]);

    useEffect(() => {
        if (isModalOpen) {
            setImage('');
        }
    }, [isModalOpen]);

    return (
        <div className="flex justify-center">
        <div className="card mt-5 mx-auto p-5 shadow-2xl">
        <Card>
            <Card.Header title="Citra Grayscale" description="Konversi Citra Grayscale Ke Histogram">
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
                        onClick={submitImage}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </Button>
                </div>
                {error && <div className="alert alert-error mt-4">{error}</div>}
                <Modal id="gray">
                    <Modal.Body title="Histogram Citra Grayscale" closeModal={closeModal}>
                      <div className="flex justify-center">
                      </div>
                        <div className="flex justify-center gap-8">
                          <div>
                            <h4 className="font-bold">Citra Awal</h4>
                            {originalImage  && <img src={originalImage} alt="Original" className="mb-4 max-w-80 max-h-80" /> }
                            </div>
                            <div>
                            <h4 className="font-bold">Citra Grayscale</h4>
                            {grayscaleImage && <img src={grayscaleImage} alt="Grayscale" className="mb-4 max-w-80 max-h-80" />}
                          </div>
                        </div>

                        <HistogramChart data={data} />
                        {statistics && <Statistics title="Statistics Grayscale" statistics={statistics} />}
                        <HistogramChart data={normalizedData} />
                        {normalizedStatistics && <Statistics title="Statistics Grayscale setelah dinormalisasi" statistics={normalizedStatistics} />}
                    </Modal.Body>
                </Modal>
            </Card.Header>
            {/* <Footer /> */}
        </Card>
        </div>
        </div>
    );
};

export default Gray;
