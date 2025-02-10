// src/pages/UploadFile.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { httpClient } from "../../utils/httpClient/httpClient";
import { BlockBlobClient } from "@azure/storage-blob";

export function UploadFile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("genetic-report");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Retrieve the access token from storage or your auth context.
  const accessToken = localStorage.getItem("access_token");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value);
  };

  const handleUpload = async () => {
    if (!id || !selectedFile) {
      setError("Please select a file.");
      return;
    }
    setError("");
    setIsUploading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      // Build the endpoint similar to your Python code.
      const endpointBase = `${baseUrl}/patients/${id}/files/upload-file-info`;
      const queryParams = `?file_name=${encodeURIComponent(
        selectedFile.name
      )}&file_type=${encodeURIComponent(fileType)}`;
      const uploadInfoEndpoint = endpointBase + queryParams;

      // Build the headers, including the Authorization header if available.
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Make the POST request with no body to get the blob upload info.
      const tokenResponse = await httpClient.post<null, { file_url: string }>(
        uploadInfoEndpoint,
        null,
        { headers }
      );

      console.log("Received file_url:", tokenResponse.file_url);

      // Validate the returned URL.
      if (!tokenResponse.file_url || !/^https?:\/\//.test(tokenResponse.file_url)) {
        throw new Error(`Invalid file_url returned from API: ${tokenResponse.file_url}`);
      }

      // Create a BlockBlobClient directly from the file_url.
      const blockBlobClient = new BlockBlobClient(tokenResponse.file_url);
      await blockBlobClient.uploadData(selectedFile, {
        blobHTTPHeaders: { blobContentType: selectedFile.type },
      });

      alert("File uploaded successfully!");
      navigate(-1); // Navigate back to the patient details page or another appropriate page.
    } catch (err) {
      console.error("File upload failed:", err);
      setError("File upload failed. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <div className="p-8 md:p-16">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Upload File</h1>
        <div className="mb-4">
          <label className="block text-neutral-600 font-medium mb-1">
            Select File:
          </label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="mb-4">
          <label className="block text-neutral-600 font-medium mb-1">
            File Type:
          </label>
          <select
            value={fileType}
            onChange={handleFileTypeChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
          >
            <option value="genetic-report">Genetic Report</option>
            <option value="doctor-report">Doctor Report</option>
            <option value="generic">Generic</option>
          </select>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="flex space-x-2">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-700 transition-colors"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="py-2 px-4 rounded-md bg-neutral-500 text-white hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
