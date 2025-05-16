import cv2
import time
import os
import numpy as np
import hashlib
import threading
import queue

# Directory for storing videos
VIDEO_DIR = "videos"
video_queue = queue.Queue()

# -------------------- Video Capture Function --------------------
def capture_video_segments(output_dir="videos", segment_duration=10, fps=20):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(0)  # Open default camera
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'XVID')

    print("🎥 Continuous recording started. Press 'Ctrl+C' to stop.")

    while True:  # Infinite loop to record continuously
        timestamp = int(time.time())  # Unique timestamp
        output_file = os.path.join(output_dir, f"video_{timestamp}.avi")

        out = cv2.VideoWriter(output_file, fourcc, fps, (width, height))
        frame_count = fps * segment_duration

        for _ in range(frame_count):
            ret, frame = cap.read()
            if not ret:
                print("❌ Camera error! Stopping.")
                cap.release()
                return
            
            out.write(frame)
            cv2.imshow("Recording", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):  # Stop when 'q' is pressed
                cap.release()
                out.release()
                cv2.destroyAllWindows()
                return

        out.release()
        print(f"✅ Video saved: {output_file}")

        # Add video file to queue for processing
        video_queue.put(output_file)

# -------------------- Processing Thread --------------------
def process_videos():
    while True:
        video_file = video_queue.get()
        if video_file is None:
            break
        main(video_file)
        video_queue.task_done()

# -------------------- Text and Hash Functions --------------------
def text_to_binary(text):
    return ''.join(format(ord(c), '08b') for c in text)

def binary_to_text(binary_string):
    chars = [binary_string[i:i+8] for i in range(0, len(binary_string), 8)]
    return ''.join(chr(int(c, 2)) for c in chars if len(c) == 8)

def generate_hash(message):
    return hashlib.sha256(message.encode()).hexdigest()

# -------------------- Video Processing Functions --------------------
def read_video_frames(video_path):
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

def write_video_frames(video_path, frames, fourcc, fps, width, height):
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    for frame in frames:
        out.write(frame)
    out.release()

# -------------------- Hash Embedding --------------------
def embed_hash_size(first_frame, binary_size):
    size_index = 0
    for i in range(first_frame.shape[0]):
        for j in range(first_frame.shape[1]):
            for k in range(3):
                if size_index < 16:
                    first_frame[i, j, k] = (first_frame[i, j, k] & 0b11111110) | int(binary_size[size_index])
                    size_index += 1
                else:
                    break
            if size_index >= 16:
                break
        if size_index >= 16:
            break
    return first_frame

def embed_hash_data(frames, binary_hash, hash_length):
    hash_index = 0
    for frame_idx in range(1, len(frames)):
        frame = frames[frame_idx]
        for i in range(frame.shape[0]):
            for j in range(frame.shape[1]):
                for k in range(3):
                    if hash_index < hash_length:
                        frame[i, j, k] = (frame[i, j, k] & 0b11111110) | int(binary_hash[hash_index])
                        hash_index += 1
                    else:
                        break
                else:
                    continue
                break
            else:
                continue
            break
    return frames

def embed_hash(video_path, message):
    hash_value = generate_hash(message)
    binary_hash = text_to_binary(hash_value)
    hash_length = len(binary_hash)
    binary_size = format(hash_length, '016b')

    frames = read_video_frames(video_path)
    if frames is None or len(frames) < 5:
        print("❌ Video must have at least 5 frames.")
        return

    fourcc = cv2.VideoWriter_fourcc(*'FFV1')
    fps = int(cv2.VideoCapture(video_path).get(cv2.CAP_PROP_FPS))
    width = int(cv2.VideoCapture(video_path).get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cv2.VideoCapture(video_path).get(cv2.CAP_PROP_FRAME_HEIGHT))

    frames[0] = embed_hash_size(frames[0], binary_size)
    frames = embed_hash_data(frames, binary_hash, hash_length)

    write_video_frames(video_path, frames, fourcc, fps, width, height)
    print(f"✅ Hash embedded in {video_path}")
    

# -------------------- Main Function --------------------
def main(video_file):
    secret_message = "Hello, world!"
    
    # Embed the hash
    embed_hash(video_file, secret_message)

    # Extract the hash
    #extracted_hash = extract_hash(video_file)

    # Verify the hash
##    new_hash = generate_hash(secret_message)
##    if extracted_hash == new_hash:
##        print(f"✅ {video_file}: Hash verification successful.")
##    else:
##        print(f"❌ {video_file}: Hash verification failed.")

# -------------------- Run Program --------------------
if __name__ == "__main__":
    if not os.path.exists(VIDEO_DIR):
        os.makedirs(VIDEO_DIR)
    
    processing_thread = threading.Thread(target=process_videos, daemon=True)
    processing_thread.start()
    
    try:
        capture_video_segments()  # Infinite loop, will keep recording
    except KeyboardInterrupt:
        print("\n❌ Stopping video recording.")
        video_queue.put(None)  # Signal the processing thread to exit
        processing_thread.join()
        cv2.destroyAllWindows()

