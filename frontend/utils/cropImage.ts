export const getCroppedImg = async (
  imageSrc: string,
  cropPixels: any
): Promise<File> => {
  const img = document.createElement("img");
  img.src = imageSrc;

  await new Promise((resolve) => (img.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], "cropped_image.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
};
