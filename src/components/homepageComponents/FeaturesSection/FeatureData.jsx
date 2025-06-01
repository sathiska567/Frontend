import React from "react";
import { Bolt } from "lucide-react";

// Import your images
import AITaggingImage from "/features/image1.jpeg";
import FastProcessingImage from "/features/image2.jpeg";
import UserInterfaceImage from "/features/image3.jpeg";
import IntegrationImage from "/features/image4.jpeg";

export const features = [
  {
    title: "Smart Image Tagging",
    description:
      "Automatically tag images using AI to save time and improve accuracy. Our advanced algorithms ensure precise categorization for all your media assets.",
    icon: <Bolt className="h-6 w-6 text-blue-400" />,
    image: AITaggingImage,
  },
  {
    title: "Fast Processing",
    description:
      "Process large batches of images in seconds with our optimized engine. Handle thousands of files simultaneously without compromising performance.",
    icon: <Bolt className="h-6 w-6 text-blue-400" />,
    image: FastProcessingImage,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Easily navigate and use all features with an intuitive UI. Designed for both beginners and professionals to streamline your workflow.",
    icon: <Bolt className="h-6 w-6 text-blue-400" />,
    image: UserInterfaceImage,
  },
  {
    title: "Download metadata CSV",
    description:
      "Export image metadata in CSV format for easy integration with other tools. Simplify your data management and analysis with one-click downloads.",
    icon: <Bolt className="h-6 w-6 text-blue-400" />,
    image: IntegrationImage,
  }
];
