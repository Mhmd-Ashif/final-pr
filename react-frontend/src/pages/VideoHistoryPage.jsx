// import { useState, useEffect } from "react";
// import { Button } from "../components/ui/button";
// import { Card } from "../components/ui/Card";
// import { useToast } from "../components/ui/Toast";
// import { Play, Download, Loader2 } from "lucide-react";
// import Navbar from "../components/Navbar";

// export default function VideoHistoryPage() {
//   const [history, setHistory] = useState([]);
//   const [loadingVideo, setLoadingVideo] = useState(null);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Load history from sessionStorage
//     const storedHistory = JSON.parse(
//       sessionStorage.getItem("videoHistory") || "[]"
//     );
//     setHistory(storedHistory);

//     // Cleanup function to revoke blob URLs when component unmounts
//     return () => {
//       storedHistory.forEach((item) => {
//         if (item.videoUrl && item.videoUrl.startsWith("blob:")) {
//           URL.revokeObjectURL(item.videoUrl);
//         }
//       });
//     };
//   }, []);

//   // const handlePlayVideo = async (videoName) => {
//   //   setLoadingVideo(videoName);
//   //   try {
//   //     const response = await fetch(
//   //       `http://localhost:5000/get-video/${videoName}`
//   //     );
//   //     if (!response.ok) throw new Error("Failed to fetch video");

//   //     const blob = await response.blob();
//   //     const videoUrl = URL.createObjectURL(blob);
//   //     setCurrentVideo(videoUrl);
//   //   } catch (error) {
//   //     toast(error.message, { variant: "destructive" });
//   //   } finally {
//   //     setLoadingVideo(null);
//   //   }
//   // };
//   const handlePlayVideo = async (videoItem) => {
//     console.log(videoItem);
//     setLoadingVideo(videoItem);
//     try {
//       // Check if we already have a blob URL in session
//       if (videoItem.videoUrl?.startsWith("blob:")) {
//         setCurrentVideo(videoItem.videoUrl);
//         return;
//       }

//       // Fetch from server if no blob URL exists
//       const response = await fetch(
//         `http://localhost:5000/get-video/${encodeURIComponent(videoItem)}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch video");

//       const blob = await response.blob();
//       const videoUrl = URL.createObjectURL(blob);

//       // Update sessionStorage with the new blob URL
//       const history = JSON.parse(
//         sessionStorage.getItem("videoHistory") || "[]"
//       );
//       const updatedHistory = history.map((item) =>
//         item.name === videoItem.name ? { ...item, videoUrl } : item
//       );

//       sessionStorage.setItem("videoHistory", JSON.stringify(updatedHistory));
//       setCurrentVideo(videoUrl);
//     } catch (error) {
//       toast(error.message, { variant: "destructive" });
//     } finally {
//       setLoadingVideo(null);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold">Video History</h2>

//         {currentVideo && (
//           <Card className="p-4">
//             <video controls className="w-full rounded" autoPlay>
//               <source src={currentVideo} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <Button
//               variant="outline"
//               className="mt-2 w-full"
//               onClick={() => setCurrentVideo(null)}
//             >
//               Close Player
//             </Button>
//           </Card>
//         )}

//         <div className="space-y-4">
//           {history.length === 0 ? (
//             <p className="text-muted-foreground text-center py-8">
//               No video history found
//             </p>
//           ) : (
//             history.map((item, index) => (
//               <Card key={index} className="p-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(item.date).toLocaleString()}
//                     </p>
//                     <p
//                       className={`text-sm ${
//                         item.status === "success"
//                           ? "text-green-500"
//                           : "text-destructive"
//                       }`}
//                     >
//                       {item.message}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handlePlayVideo(item.name)}
//                       disabled={loadingVideo === item.name}
//                       isLoading={loadingVideo === item.name}
//                       icon={
//                         loadingVideo !== item.name ? (
//                           <Play className="h-4 w-4" />
//                         ) : null
//                       }
//                     >
//                       {item.status == "success" ? "Play" : ""}
//                     </Button>
//                     {item.status === "success" && (
//                       <Button size="sm" variant="outline" asChild>
//                         <a
//                           href={`http://localhost:5000/get-video/${item.name}`}
//                           download
//                         >
//                           <Download className="h-4 w-4" />
//                         </a>
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Play, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VideoHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load history from sessionStorage
    const storedHistory = JSON.parse(
      sessionStorage.getItem("videoHistory") || "[]"
    );
    setHistory(storedHistory);

    // Cleanup function to revoke blob URLs when component unmounts
    return () => {
      storedHistory.forEach((item) => {
        if (item.videoUrl && item.videoUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.videoUrl);
        }
      });
    };
  }, []);

  const handlePlayVideo = async (videoItem) => {
    setLoadingVideo(videoItem.name);
    try {
      // Check if we already have a blob URL in session
      if (videoItem.videoUrl?.startsWith("blob:")) {
        setCurrentVideo(videoItem.videoUrl);
        return;
      }

      // In a real app, you would fetch from server if no blob URL exists
      // For demo purposes, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Error",
        description: "Could not load video from server",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch video",
        variant: "destructive",
      });
    } finally {
      setLoadingVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Navbar />

      <div className="container pt-28 pb-16 space-y-8 px-10 md:px-28">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Video History</h2>
          <Link to="/upload">
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-zinc-200"
            >
              Upload New Video
            </Button>
          </Link>
        </div>

        {currentVideo && (
          <Card className="p-6 bg-zinc-900 border border-zinc-800">
            <div className="space-y-4">
              <video controls className="w-full rounded-lg" autoPlay>
                <source src={currentVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                variant="outline"
                className="w-full bg-white text-black hover:bg-zinc-200"
                onClick={() => setCurrentVideo(null)}
              >
                Close Player
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 border border-zinc-800 rounded-lg bg-zinc-900/30">
              <p className="text-zinc-400 text-lg">No video history found</p>
              <p className="text-zinc-500 mt-2">
                Upload a video to get started
              </p>
              <Link to="/upload" className="mt-6 inline-block">
                <Button className="bg-white text-black hover:bg-zinc-200 mt-4">
                  Upload Video
                </Button>
              </Link>
            </div>
          ) : (
            history.map((item, index) => (
              <Card
                key={index}
                className="p-6 bg-zinc-900 border border-zinc-800"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-zinc-400">
                      {item.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {new Date(item.date).toLocaleString()}
                    </p>
                    <p
                      className={`text-sm mt-2 flex items-center ${
                        item.status === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.status === "success" ? (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                          {item.message || "Verified Successfully"}
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                          {item.message || "Verification Failed"}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      className="bg-zinc-800 hover:bg-zinc-700 text-white"
                      onClick={() => handlePlayVideo(item)}
                      disabled={loadingVideo === item.name}
                    >
                      {loadingVideo === item.name ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                          Loading...
                        </div>
                      ) : (
                        <>
                          <Play className="h-4 w-4 " />
                          Play
                        </>
                      )}
                    </Button>
                    {/* {item.status === "success" && (
                      <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-zinc-200"
                      >
                        <Download className="h-4 w-4 " />
                        Download
                      </Button>
                    )} */}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
