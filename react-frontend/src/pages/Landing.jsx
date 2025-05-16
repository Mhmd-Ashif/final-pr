import { Button } from "../components/ui/button";
import { ArrowRight, Camera, Check, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Aurora from "../components/Aurora";
import ScrollVelocity from "../components/ScrollVelocity";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="">
        <Aurora
          colorStops={["#413E41", "#6D6F6D", "#FFFFFF"]}
          blend={0.8}
          amplitude={7.0}
          speed={0.8}
        />
      </header>
      <section className="pb-10">
        <div className="container flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm mb-6">
            <span className="text-zinc-400">Introducing ProofCam</span>
            <div className="ml-1 h-1.5 w-1.5 rounded-full bg-zinc-400"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
            Capture{" "}
            <span className="bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Undeniable
            </span>{" "}
            Evidence
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10">
            ProofCam provides tamper-proof video evidence for legal, security,
            and personal documentation needs.
          </p>

          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 max-w-4xl opacity-70">
            Architecture
          </h3>
          <div className=" relative w-full max-w-5xl aspect-video rounded-lg border border-zinc-800  ">
            <div className=" bg-white absolute inset-0  group-hover:opacity-100  transition-opacity duration-300 flex items-center justify-center rounded-[1vw]">
              <img src="./image.png" className="w-fit h-11/12"></img>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-16 text-lg">
            {/* <Button className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-base ">
              Start Securing Your Footage ASAP{" "}
            </Button> */} 
          </div>
        </div>
      </section>

      <ScrollVelocity
        texts={["Tamper", "Resistant"]}
        className="custom-scroll-text "
      />

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-zinc-900 mt-10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Security Features
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              ProofCam combines cutting-edge technology with user-friendly
              design to ensure your footage is always secure and verifiable.
            </p>
          </div>
          <div className="grid md:grid-rows-3 gap-8 ">
            {[
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Tamper-Proof Encryption",
                description:
                  "Using SHA256 Algorithm Hash is Encoded into the Video using LSB technology.",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Real-Time Verification",
                description:
                  "Instant verification of footage authenticity with And Video Playback by HTTP .  ",
              },
              {
                icon: <Camera className="h-6 w-6" />,
                title: "Supports ESP32 Cam Recording",
                description:
                  "All We Need Is an Video Source It could be Either the IP of the Camera or Port ",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className=" flex justify-center  border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors duration-300 "
              >
                <div className="bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 border-t border-zinc-900 p-12 text-center"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How ProofCam Works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A simple three-step process to capture, verify, and store
              tamper-proof video evidence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Record",
                description:
                  "Capture footage with our Dedicated Script which will Encrypt the Data and Automatically Stores in your Disk.",
              },
              {
                step: "02",
                title: "Verify",
                description:
                  "Load the Encoded Video in Our Dedicated Web Player to Verify its Authenticity",
              },
              {
                step: "03",
                title: "Access",
                description:
                  "Securely access and Save the Decrypted Video in any Devices ",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-zinc-800 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2 text-zinc-800">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4  w-full place-content-center">
        <Button className="  px-8 py-6 text-base text-center ">
          <Link
            to={"/upload"}
            className="flex place-content-center justify-center"
          >
            Start Verifying <ArrowRight className="ml-2 mt-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <footer className=" border-zinc-900 py-12 p-8">
        <div className="container">
          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ProofCam. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
