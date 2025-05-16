

from flask import Flask, request, jsonify, send_file
import os
import cv2
import numpy as np
import hashlib
import subprocess
from werkzeug.utils import secure_filename
from flask_cors import CORS
import tempfile
import time
from threading import Thread

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def cleanup_uploads():
    """Delete files older than X hours from uploads folder"""
    while True:
        now = time.time()
        for filename in os.listdir(UPLOAD_FOLDER):
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.isfile(filepath):
                # Delete files older than 24 hours (adjust as needed)
                if now - os.path.getmtime(filepath) > 10 * 60:
                    try:
                        os.unlink(filepath)
                        print(f"Cleaned up: {filename}")
                    except Exception as e:
                        print(f"Error deleting {filename}: {e}")
        time.sleep(600)  # Run hourly

if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
    Thread(target=cleanup_uploads, daemon=True).start()

ALLOWED_EXTENSIONS = {'avi', 'mp4', 'mov'}

SECRET_MESSAGE = "Hello, world!"

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_video_to_playable(input_path, output_path):
    """Convert video to MP4 with H.264 codec using ffmpeg."""
    try:
        command = [
            'ffmpeg',
            '-i', input_path,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '22',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            '-y',  # Overwrite without asking
            output_path
        ]
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg conversion failed: {e.stderr}")
        return False
    except Exception as e:
        print(f"Conversion error: {str(e)}")
        return False

def text_to_binary(text):
    """Convert text to a binary string."""
    return ''.join(format(ord(c), '08b') for c in text)

def binary_to_text(binary_string):
    """Convert a binary string to text."""
    chars = [binary_string[i:i+8] for i in range(0, len(binary_string), 8)]
    return ''.join(chr(int(c, 2)) for c in chars if len(c) == 8)

def generate_hash(message):
    """Generate a SHA-256 hash from the message."""
    return hashlib.sha256(message.encode()).hexdigest()

def read_video_frames(video_path):
    """Read all frames from a video file."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("❌ Error: Could not open video.")
        return None

    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)

    cap.release()
    return frames

def extract_hash_size(first_frame):
    """Extract the size of the hash from the first frame."""
    binary_size = ""
    size_index = 0

    for i in range(first_frame.shape[0]):
        for j in range(first_frame.shape[1]):
            for k in range(3):  # RGB channels
                if size_index < 16:
                    binary_size += str(first_frame[i, j, k] & 1)
                    size_index += 1
                else:
                    break
            if size_index >= 16:
                break
        if size_index >= 16:
            break

    return int(binary_size, 2)

def extract_hash_data(frames, hash_size):
    """Extract the hash data from subsequent frames."""
    binary_hash = ""
    hash_index = 0

    for frame_idx in range(1, len(frames)):
        frame = frames[frame_idx]
        for i in range(frame.shape[0]):
            for j in range(frame.shape[1]):
                for k in range(3):  # RGB channels
                    if hash_index < hash_size:
                        binary_hash += str(frame[i, j, k] & 1)
                        hash_index += 1
                    else:
                        break
                else:
                    continue
                break
            else:
                continue
            break

    return binary_hash

def extract_hash_from_video(video_path):
    """Extract a hash from the video."""
    frames = read_video_frames(video_path)
    if frames is None or len(frames) < 5:
        return None

    hash_size = extract_hash_size(frames[0])
    binary_hash = extract_hash_data(frames, hash_size)
    return binary_to_text(binary_hash)

@app.route('/verify-video', methods=['POST'])
def verify_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not (file and allowed_file(file.filename)):
        return jsonify({'error': 'Invalid file type'}), 400

    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        extracted_hash = extract_hash_from_video(filepath)
        if not extracted_hash:
            return jsonify({'error': 'Failed to extract hash from video'}), 400
        
        # Compare with hash of our secret message
        expected_hash = generate_hash(SECRET_MESSAGE)
        
        if extracted_hash == expected_hash:
            # Convert the video to playable format
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                converted_path = temp_file.name
            
            if not convert_video_to_playable(filepath, converted_path):
                return jsonify({'error': 'Failed to convert video to playable format'}), 500
            
            # Return both the success message and the converted video
            return jsonify({
                'status': 'success',
                'message': 'Video verification successful: The content matches the secret message.',
                'video_url': f'/download-converted?path={converted_path}'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Video verification failed: The content does not match the secret message or the video is not encoded'
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/download-converted')
# def download_converted():
#     video_path = request.args.get('path')
#     if not video_path or not os.path.exists(video_path):
#         return jsonify({'error': 'Video not found'}), 404
    
#     # Send the file and schedule it for deletion after sending
#     response = send_file(
#         video_path,
#         mimetype='video/mp4',
#         as_attachment=False,
#         download_name='converted_video.mp4'
#     )
    
#     # Clean up the temporary file after sending
#     @response.call_on_close
#     def remove_file():
#         try:
#             os.unlink(video_path)
#         except Exception as e:
#             print(f"Error deleting temporary file: {str(e)}")
    
#     return response

@app.route('/download-converted')
def download_converted():
    video_path = request.args.get('path')
    if not video_path or not os.path.exists(video_path):
        return jsonify({'error': 'Video not found'}), 404
    
    try:
        # Create a temporary converted file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
            converted_path = temp_file.name
        
        # Convert to playable format
        if not convert_video_to_playable(video_path, converted_path):
            return jsonify({'error': 'Failed to convert video'}), 500
        
        # Send the converted file
        response = send_file(
            converted_path,
            mimetype='video/mp4',
            as_attachment=False,
            download_name='converted_video.mp4'
        )
        
        # Clean up both original and converted files
        @response.call_on_close
        def remove_files():
            try:
                os.unlink(video_path)
                os.unlink(converted_path)
            except Exception as e:
                print(f"Error deleting temporary files: {str(e)}")
        
        return response
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-video/<filename>')
def get_video(filename):
    """Serve video files for the history page"""
    # Security checks
    safe_filename = secure_filename(filename)
    if not safe_filename:
        return jsonify({'error': 'Invalid filename'}), 400
    
    original_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
    if not os.path.exists(original_path):
        return jsonify({'error': 'Video not found'}), 404
    
    if not allowed_file(original_path):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        # Create a temporary converted file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
            converted_path = temp_file.name
        
        # Convert to playable format
        if not convert_video_to_playable(original_path, converted_path):
            return jsonify({'error': 'Failed to convert video'}), 500
        
        # Determine appropriate mimetype
        ext = os.path.splitext(converted_path)[1][1:].lower()
        mimetype = f'video/{ext}' if ext in {'mp4', 'webm', 'ogg'} else 'video/mp4'
        
        # Send the converted file
        response = send_file(
            converted_path,
            mimetype=mimetype,
            as_attachment=False,
            download_name=f'converted_{safe_filename}'
        )
        
        # Clean up the converted file after sending
        @response.call_on_close
        def remove_file():
            try:
                os.unlink(converted_path)
            except Exception as e:
                print(f"Error deleting temporary file: {str(e)}")
        
        return response
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)