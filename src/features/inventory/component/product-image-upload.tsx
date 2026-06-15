import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppAlert from "@/components/app-alert";
import { FileUploader } from "@/components/file-uploader";
import { uploadImage } from "@/hooks/services/upload";

export function ProductImageUpload({
  onImagesUploaded,
  error,
}: {
  onImagesUploaded?: (urls: string[]) => void;
  error?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; public_id: string }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadImage(files, (progress) => {
        // Update progress for all files
        const progressMap = files.reduce(
          (acc, file) => {
            acc[file.name] = progress;
            return acc;
          },
          {} as Record<string, number>,
        );
        setUploadProgress(progressMap);
      });

      setUploadedImages((prev) => [...prev, ...response.images]);

      const allUrls = [...uploadedImages, ...response.images].map(
        (img) => img.url,
      );

      onImagesUploaded?.(allUrls);

      toast.success(response.message);

      // Clear the files after successful upload
      setFiles([]);
      setUploadProgress({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleRemoveUploadedImage = (index: number) => {
  //   setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  //   const newUrls = uploadedImages
  //     .filter((_, i) => i !== index)
  //     .map((img) => img.url);
  //   onImagesUploaded?.(newUrls);
  // };

  // const handleClearAll = () => {
  //   setFiles([]);
  //   setUploadedImages([]);
  //   setUploadProgress({});
  //   onImagesUploaded?.([]);
  // };

  return (
    <>
      <div className="space-y-4">
        <AppAlert
          type="warning"
          title="Note on Image Uploads"
          description={`Uploads will be optimized automatically, but starting with a
        high-quality image of minimum resolution of (800x800) pixels helps
        maintain clarity and detail. Avoid using low-resolution images to ensure
        your products are showcased in the best light. Click the "Upload Images"
        button to upload images before adding your product.`}
        />

        {/* Uploaded Images Section */}
        {uploadedImages.length > 0 && (
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-600" />
                <h3 className="font-semibold">
                  Uploaded Images ({uploadedImages.length})
                </h3>
              </div>
              {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isUploading}
            >
              Clear All
            </Button> */}
            </div>

            <ScrollArea className="h-50">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {uploadedImages.map((image, index) => (
                  <div
                    key={image.public_id}
                    className="group relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={image.url}
                      alt={`Uploaded ${index + 1}`}
                      className="size-full object-cover"
                    />
                    {/* <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 size-8"
                      onClick={() => handleRemoveUploadedImage(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div> */}
                    <Badge
                      variant="secondary"
                      className="absolute bottom-2 left-2 text-xs"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="library">Select from Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Your Own</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="flex h-50 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground text-sm">
                Library picker coming soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <FileUploader
              value={files}
              onValueChange={setFiles}
              maxFiles={5}
              maxSize={1024 * 1024 * 3} // 3MB
              progresses={uploadProgress}
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/webp": [".webp"],
              }}
              multiple
              disabled={isUploading}
            />

            {files.length > 0 && (
              <Button
                className="w-full"
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload {files.length} image{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
    </>
  );
}
