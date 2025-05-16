// import { Link, useParams } from "react-router-dom";
// import { Button } from "./ui/Button";

// export default function Navbar() {
//   return (
//     <>
//       <nav className="border-b border-border px-4 py-3">
//         <div className="flex items-center justify-between">
//           <h1 className="text-xl font-bold">Video Verification</h1>
//           <div className="flex space-x-2">
//             <Button asChild variant="ghost">
//               <Link to="/upload">Upload</Link>
//             </Button>
//             <Button asChild variant="ghost">
//               <Link to="/history">History</Link>
//             </Button>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Camera, Hash, History, Upload } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-black fixed top-0 left-0 right-0 z-50 backdrop-blur-xs border-b border-white/10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className=" md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-xl text-gray-300 hover:text-white font-bold "
                >
                  ProofCam
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="text-sm text-gray-300 hover:text-white font-bold">
              <Link to="/upload" className="flex">
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Link>
            </Button>
            <Button className="text-sm to-accent hover:opacity-90 text-gray-300 hover:text-white font-bold">
              <Link to="/history" className="flex justify-center place">
                <History className="w-4 h-4 mr-1" />
                History
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
