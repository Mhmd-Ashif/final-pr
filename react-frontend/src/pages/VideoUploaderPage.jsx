// import { useState, useRef, useEffect } from "react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "../components/ui/Card";
// import { Input } from "../components/ui/Input";
// import { useToast } from "../components/ui/Toast";
// import { Upload, X } from "lucide-react";
// import Aurora from "../components/Aurora";
// import Navbar from "../components/Navbar";

// export default function VideoUploaderPage() {
//   const [file, setFile] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [verificationResult, setVerificationResult] = useState(null);
//   const videoRef = useRef(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Function to clean up expired videos
//     const cleanupExpiredVideos = () => {
//       const history = JSON.parse(
//         sessionStorage.getItem("videoHistory") || "[]"
//       );
//       const fiveMin = Date.now() - 180000;

//       const validVideos = history.filter((video) => {
//         return new Date(video.date).getTime() > fiveMin;
//       });

//       sessionStorage.setItem("videoHistory", JSON.stringify(validVideos));
//     };

//     // Run immediately on component mount
//     cleanupExpiredVideos();

//     // Then set up hourly cleanup
//     const intervalId = setInterval(cleanupExpiredVideos, 180000); //5 min

//     // Clean up the interval when component unmounts
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleUpload = async () => {
//     if (!file) return;
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/verify-video", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();

//       if (data.status === "success") {
//         const videoResponse = await fetch(
//           `http://localhost:5000${data.video_url}`
//         );
//         const videoBlob = await videoResponse.blob();
//         const videoObjectUrl = URL.createObjectURL(videoBlob);
//         setVideoUrl(videoObjectUrl);

//         // Save to sessionStorage with cleanup
//         const history = JSON.parse(
//           sessionStorage.getItem("videoHistory") || "[]"
//         );

//         // 1. Clean up old blob URLs before they're lost
//         history.forEach((item) => {
//           if (item.videoUrl?.startsWith("blob:")) {
//             URL.revokeObjectURL(item.videoUrl);
//           }
//         });

//         // 2. Store new entry (limit to last 5 videos)
//         const newHistory = [
//           {
//             name: file.name,
//             date: new Date().toISOString(),
//             status: data.status,
//             message: data.message,
//             videoUrl: videoObjectUrl,
//             size: file.size, // Store for quota management
//           },
//           ...history.slice(0, 8), // Keep only 5 most recent
//         ];

//         sessionStorage.setItem("videoHistory", JSON.stringify(newHistory));
//       }

//       setVerificationResult(data);
//       toast(data.message, {
//         variant: data.status === "success" ? "default" : "destructive",
//       });
//     } catch (error) {
//       toast("Failed to upload video", { variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePlayPause = () => {
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//     } else {
//       videoRef.current.pause();
//     }
//   };

//   const handleVolumeChange = (e) => {
//     videoRef.current.volume = e.target.value;
//   };

//   const handleClear = () => {
//     setFile(null);
//     if (videoUrl) {
//       URL.revokeObjectURL(videoUrl); // Clean up the object URL
//     }
//     setVideoUrl(null);
//     setVerificationResult(null);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="mt-16">
//         <Card>
//           <CardHeader>
//             <CardTitle>Upload Video for Verification</CardTitle>
//             <CardDescription>
//               Supports MP4, MOV, AVI (max 100MB)
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4">
//               {!videoUrl ? (
//                 <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
//                   <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
//                   <Input
//                     type="file"
//                     id="video-upload"
//                     className="hidden"
//                     accept=".mp4,.mov,.avi,video/*"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                   />
//                   <label
//                     htmlFor="video-upload"
//                     className="mt-4 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
//                   >
//                     Browse Files
//                   </label>
//                 </div>
//               ) : (
//                 <div className="relative">
//                   <video
//                     ref={videoRef}
//                     src={videoUrl}
//                     className="w-full rounded-lg"
//                     controls
//                   />
//                   <button
//                     onClick={handleClear}
//                     className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}

//               {file && !videoUrl && (
//                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
//                   <span className="text-sm truncate">{file.name}</span>
//                   <Button variant="ghost" size="sm" onClick={handleClear}>
//                     Clear
//                   </Button>
//                 </div>
//               )}

//               {!videoUrl && (
//                 <Button
//                   className="w-full"
//                   onClick={handleUpload}
//                   disabled={!file || isLoading}
//                   isLoading={isLoading}
//                 >
//                   Verify Video
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";

import {
  Upload,
  X,
  ArrowLeft,
  Check,
  AlertCircle,
  FileVideo,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function VideoUploaderPage() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Function to clean up expired videos
    const cleanupExpiredVideos = () => {
      const history = JSON.parse(
        sessionStorage.getItem("videoHistory") || "[]"
      );
      const fiveMin = Date.now() - 180000;

      const validVideos = history.filter((video) => {
        return new Date(video.date).getTime() > fiveMin;
      });

      sessionStorage.setItem("videoHistory", JSON.stringify(validVideos));
    };

    cleanupExpiredVideos();

    // Then set up hourly cleanup
    const intervalId = setInterval(cleanupExpiredVideos, 180000); //5 min

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate API call for demo purposes

      const response = await fetch("http://localhost:5000/verify-video", {
        method: "POST",
        body: formData,
      });  
      console.log(response);
      const data = await response.json();

      if (data.status === "success") {
        const videoResponse = await fetch(
          `http://localhost:5000${data.video_url}`
        );
        const videoBlob = await videoResponse.blob();
        
        const videoObjectUrl = URL.createObjectURL(videoBlob);
        setVideoUrl(videoObjectUrl);

        // Save to sessionStorage with cleanup
        const history = JSON.parse(
          sessionStorage.getItem("videoHistory") || "[]"
        );

        // 1. Clean up old blob URLs before they're lost
        history.forEach((item) => {
          if (item.videoUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(item.videoUrl);
          }
        });

        // 2. Store new entry (limit to last 5 videos)
        const newHistory = [
          {
            name: file.name,
            date: new Date().toISOString(),
            status: data.status,
            message: data.message,
            videoUrl: videoObjectUrl,
            size: file.size, // Store for quota management
          },
          ...history.slice(0, 8), // Keep only 5 most recent
        ];

        sessionStorage.setItem("videoHistory", JSON.stringify(newHistory));
      }

      setVerificationResult(data);
      toast({
        title: data.status === "success" ? "Success" : "Error",
        description: data.message,
        variant: data.status === "success" ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl); // Clean up the object URL
    }
    setVideoUrl(null);
    setVerificationResult(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 md:px-28">
      <Navbar />

      <div className="container pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Upload Video for Verification
          </h1>

          <Card className="bg-zinc-900 border border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Video Verification</CardTitle>
              <CardDescription className="text-zinc-400">
                Upload your video to verify its authenticity and ensure it
                hasn't been tampered with. Supports MP4, MOV, AVI (max 100MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {!videoUrl ? (
                  <div
                    className={`border-2 border-dashed ${
                      dragActive
                        ? "border-white bg-zinc-800/30"
                        : "border-zinc-800"
                    } rounded-lg p-10 text-center transition-colors duration-200`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-zinc-500" />
                    <p className="mt-4 text-zinc-400 text-lg">
                      Drag and drop your video here
                    </p>
                    <p className="text-zinc-500 mt-2">or</p>
                    <Input
                      type="file"
                      id="video-upload"
                      className="hidden"
                      accept=".mp4,.mov,.avi,video/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="video-upload"
                      className="mt-4 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-zinc-200 h-10 px-6 py-2"
                    >
                      Browse Files
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-800">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full rounded-lg"
                      controls
                    />
                    <button
                      onClick={handleClear}
                      className="absolute top-3 right-3 p-2 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {file && !videoUrl && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-800">
                    <div className="flex items-center">
                      <FileVideo className="h-5 w-5 mr-3 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[300px] text-zinc-500">
                          {file.name}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {verificationResult && (
                  <div
                    className={`p-4 rounded-lg ${
                      verificationResult.status === "success"
                        ? "bg-green-900/20 border border-green-800"
                        : "bg-red-900/20 border border-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {verificationResult.status === "success" ? (
                        <>
                          <div className="bg-green-900/50 p-2 rounded-full mr-3">
                            <Check className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-green-400">
                              Verification Successful
                            </p>
                            <p className="text-sm text-zinc-400 mt-1">
                              {verificationResult.message}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-red-900/50 p-2 rounded-full mr-3">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-red-400">
                              Verification Failed
                            </p>
                            <p className="text-sm text-zinc-400 mt-1">
                              {verificationResult.message}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-800 pt-6">
              <Button
                variant="outline"
                onClick={handleClear}
                className="bg-white text-black hover:bg-zinc-200"
              >
                Clear
              </Button>

              {!videoUrl && (
                <Button
                  className="bg-white text-black hover:bg-zinc-200"
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-black rounded-full"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Video"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
