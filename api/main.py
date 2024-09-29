import os
import datetime
from PIL import Image
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app, origins=['http://localhost:5173'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_histogram_gray(image):
    image_array = np.array(image.convert("L"))
    histogram, _ = np.histogram(image_array, bins=256, range=(0, 256))
    return histogram.tolist()

def calculate_histogram(image):
    image_array = np.array(image)
    histograms = {
        'red': np.histogram(image_array[:, :, 0], bins=256, range=(0, 256))[0].tolist(),
        'green': np.histogram(image_array[:, :, 1], bins=256, range=(0, 256))[0].tolist(),
        'blue': np.histogram(image_array[:, :, 2], bins=256, range=(0, 256))[0].tolist(),
    }
    return histograms

def calculate_normalized_histogram_gray(histogram):
    normalized_histogram = (np.array(histogram) / np.sum(histogram)).tolist()
    return normalized_histogram

def calculate_normalized_histogram_rgb(histograms):
    normalized_histograms = {
        'red': (np.array(histograms['red']) / np.sum(histograms['red'])).tolist(),
        'green': (np.array(histograms['green']) / np.sum(histograms['green'])).tolist(),
        'blue': (np.array(histograms['blue']) / np.sum(histograms['blue'])).tolist(),
    }
    return normalized_histograms

def calculate_statistics(histogram):
    mean = np.mean(histogram)
    variance = np.var(histogram)
    std_dev = np.std(histogram)
    return {"mean": mean, "variance": variance, "std_dev": std_dev}

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/gray', methods=['POST'])
def gray():
    if 'file' not in request.files:
        return jsonify({"error": "File tidak ada"}), 404
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        now = datetime.datetime.now()
        filename = secure_filename(file.filename)
        new_filename = f"{filename.rsplit('.', 1)[0]}_{now.strftime('%d_%m_%Y_%H_%M_%S')}.{filename.rsplit('.', 1)[1]}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        path_file = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        img = Image.open(path_file)

        grayscale_img = img.convert("L")
        grayscale_filename = f"{filename.rsplit('.', 1)[0]}_gray_{now.strftime('%d_%m_%Y_%H_%M_%S')}.{filename.rsplit('.', 1)[1]}"
        grayscale_path = os.path.join(app.config['UPLOAD_FOLDER'], grayscale_filename)
        grayscale_img.save(grayscale_path)

        histogram = calculate_histogram_gray(grayscale_img)
        normalized_histogram = calculate_normalized_histogram_gray(histogram)
        statistics = calculate_statistics(histogram)
        normalized_statistics = calculate_statistics(normalized_histogram)

        return jsonify({
            "histogram": histogram,
            "normalized_histogram": normalized_histogram,
            "statistics": statistics,
            "normalized_statistics": normalized_statistics,
            "original_image": new_filename,
            "grayscale_image": grayscale_filename
        })

@app.route('/rgb', methods=['POST'])
def rgb():
    if 'file' not in request.files:
        return jsonify({"message": "File not present"}), 404
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(file.filename):
        now = datetime.datetime.now()
        filename = secure_filename(file.filename)
        new_filename = f"{filename.rsplit('.', 1)[0]}_{now.strftime('%d_%m_%Y_%H_%M_%S')}.{filename.rsplit('.', 1)[1]}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        path_file = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        img = Image.open(path_file)

        # Original Histogram and Statistics
        histogram = calculate_histogram(img)
        statistics = {
            'red': calculate_statistics(histogram['red']),
            'green': calculate_statistics(histogram['green']),
            'blue': calculate_statistics(histogram['blue']),
        }

        # Normalized Histogram and Statistics
        normalized_histogram = calculate_normalized_histogram_rgb(histogram)
        normalized_statistics = {
            'red': calculate_statistics(normalized_histogram['red']),
            'green': calculate_statistics(normalized_histogram['green']),
            'blue': calculate_statistics(normalized_histogram['blue']),
        }

        return jsonify({
            "image": new_filename,
            "histogram": histogram,
            "normalized_histogram": normalized_histogram,
            "statistics": statistics,
            "normalized_statistics": normalized_statistics
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
