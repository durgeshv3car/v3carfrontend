"use client";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { useEffect, useState } from "react";

export interface FileWithPreview {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  files: FileWithPreview[];
  setFiles: (files: FileWithPreview[]) => void;
  expectedDimensions?: {
    width: number;
    height: number;
  };
  label?: string;
}

const ImageUpload = ({ 
  files, 
  setFiles, 
  expectedDimensions,
  label = "Image"
}: ImageUploadProps) => {
  const [validationError, setValidationError] = useState<string>("");

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!expectedDimensions) {
        resolve(true);
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const isValid = 
          img.width === expectedDimensions.width && 
          img.height === expectedDimensions.height;
        
        if (!isValid) {
          setValidationError(
            `${label} must be exactly ${expectedDimensions.width} x ${expectedDimensions.height} pixels. Selected image is ${img.width} x ${img.height} pixels.`
          );
        } else {
          setValidationError("");
        }
        
        resolve(isValid);
      };
      
      img.onerror = () => {
        setValidationError("Invalid image file");
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const isValid = await validateImageDimensions(file);
      
      if (isValid) {
        const mappedFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        setFiles(mappedFiles);
      }
    },
  });

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files?.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [files]);

  const closeTheFile = () => {
    files?.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    setFiles([]);
    setValidationError("");
  };

  return (
    <div className={files.length ? "h-[150px] w-full" : ""}>
      {files.length ? (
        <div className="w-full h-full relative">
          <Button
            type="button"
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-default-900 hover:bg-background hover:text-default-900 z-20"
            onClick={closeTheFile}
          >
            <span className="text-xs">
              <Icon icon="fa6-solid:xmark" />
            </span>
          </Button>
          
          <NextImage
            key={files[0].file ? files[0].file.name : files[0].preview}
            alt={files[0].file ? files[0].file.name : "Uploaded Image"}
            width={250}
            height={150}
            className="w-full h-full object-cover rounded-md"
            src={files[0].preview}
            priority={false}
          />
        </div>
      ) : (
        <div>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="w-full text-center border-dashed border border-default-200 dark:border-default-300 rounded-md py-[20px] flex items-center flex-col">
              <CloudUpload className="text-default-300 w-6 h-6" />
              <h4 className="text-sm font-medium mb-1 mt-1 text-card-foreground/80">
                Drop or click to upload.
              </h4>
              {expectedDimensions && (
                <p className="text-xs text-gray-500 mt-1">
                  Required: {expectedDimensions.width} x {expectedDimensions.height} pixels
                </p>
              )}
            </div>
          </div>
          
          {validationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{validationError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;