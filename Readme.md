# Final-Year-Project
# 📹 Tamper-Resistant CCTV Footage Storage System Using Digital Watermarking and Hash Verification

This system ensures the integrity and authenticity of CCTV footage using a combination of **digital watermarking**, **hash verification**, and **secure video processing**. It provides a React-based interface to upload surveillance footage, and a Flask backend that verifies if the footage has been tampered with.

---

## 💡 Features

- ✅ Tamper-proof video upload and verification  
- ✅ SHA-256 based watermarking and comparison  
- ✅ Digital watermark detection and frame analysis  
- ✅ Video format conversion (AVI/MOV to MP4)    
- ✅ Stream verified videos  
- ✅ Built using React + Flask + OpenCV + FFmpeg  

---

##   Tech Stack

| Component         | Technology         |
|------------------|--------------------|
| Frontend         | React.js, Bootstrap |
| Backend          | Flask (Python)     |
| Video Processing | OpenCV, FFmpeg     |
| Hashing          | SHA-256            |
| Styling          | Bootstrap, CSS     |
| CORS             | flask-cors         |

---

## 🛠 Prerequisites

Make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/)
- [Python 3.7+](https://www.python.org/)
- [FFmpeg](https://ffmpeg.org/download.html)  
  - Windows: Add to System PATH  
  - macOS: `brew install ffmpeg`  
  - Linux: `sudo apt install ffmpeg`

---

## 📂 Project Structure
Tamper-Resistant-CCTV/
├── backend/
│ ├── app.py # Flask server
│ ├── uploads/ # Stores uploaded/converted videos
│ ├── requirements.txt # Python dependencies
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── package.json # React dependencies
│
├── README.md


---


```bash
step 1 clone the repo or download the repo
git clone https://github.com/Mhmd-Ashif/Final-Year-Project.git
cd tamper-resistant-cctv

🔧 Backend Setup (Flask + Python)
Step 2: Navigate to Backend
bash
cd backend
Step 3: Create Virtual Environment (Optional)
bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
Step 4: Install Dependencies
bash
pip install -r requirements.txt
If requirements.txt is missing:

bash
pip install Flask flask-cors opencv-python numpy
Step 5: Start the Flask Server
bash
python app.py
The Flask backend will start at:
http://localhost:5000

🌐 Frontend Setup (React.js)
Step 6: Navigate to Frontend
bash
cd ../frontend
Step 7: Install Dependencies
bash
npm install
Step 8: Start the React App
bash
npm start
Now go to:
http://localhost:3000

📦 requirements.txt
Flask
flask-cors
opencv-python
numpy
If you haven't created it yet, save the above as backend/requirements.txt.
