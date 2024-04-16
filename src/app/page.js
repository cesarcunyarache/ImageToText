"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const convertImageToText = async () => {
      if (!selectedImage) return;
      setLoading(true);
      console.log("entro");
      const worker = await createWorker("eng");

      try {
        const { data } = await worker.recognize(selectedImage);
        setTextResult(data.text);
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
      } finally {
        await worker.terminate();
        setLoading(false);
      }
    };

    convertImageToText();
  }, [selectedImage]);

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult("");
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const codeBlock = document.getElementById("code-block");
    if (codeBlock) {
      const code = codeBlock.innerText;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy: ", error);
        });
    }
  };

  const refresh = () => {
    setSelectedImage(null);
    setTextResult("");
  };

  return (
    <div className="px-20 py-10">
      {selectedImage ? (
        <div
          class="flex items-center justify-center w-full"
          for="dropzone-file"
        >
          <div class="flex flex-col items-center justify-center w-full   border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800  hover:bg-gray-100">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="uploaded-image"
                accept="image/jpeg, image/png, image/jpg"
                className="object-contain max-h-96"
              />
            </div>
          </div>
        </div>
      ) : (
        <div class="flex items-center justify-center w-ful">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800  hover:bg-gray-100 "
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Haga clic para cargar</span> o
                arrastrar y soltar
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              onChange={handleChangeImage}
            />
          </label>
        </div>
      )}

      <div className="w-full border mt-6 rounded-lg ">
        <div className="relative bg-gray-50 rounded-lg  p-4 h-64 overflow-scroll max-h-full">
          <pre
            id="code-block"
            className="text-sm text-gray-500  whitespace-pre"
          >
            {textResult}
          </pre>
        </div>
        <div className="relative top-0 bg-gray-50  m-2 flex items-center">
          <button
            onClick={copyToClipboard}
            className="text-gray-900 d m-0.5 hover:bg-gray-100   d rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border"
          >
            {!copied && (
              <span className="inline-flex items-center">
                <svg
                  className="w-3 h-3 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
                <span className="text-xs font-semibold">Copiar</span>
              </span>
            )}

            {copied && (
              <span className="inline-flex items-center">
                <svg
                  className="w-3 h-3 text-blue-700  me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span className="text-xs font-semibold text-blue-700 ">
                  Copiado
                </span>
              </span>
            )}
          </button>

          <button
            onClick={refresh}
            className="text-gray-900 d m-0.5 hover:bg-gray-100   d rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border"
          >
            <svg
              class="w-[15px] h-[15px] text-gray-800  "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
