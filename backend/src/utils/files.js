const fs = require("fs");

const check = (headers) => {
  return (buffers, options = { offset: 0 }) =>
    headers.every(
      (header, index) => header === buffers[options.offset + index]
    );
};

const validateFileType = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // Convert data to ArrayBuffer
      const arrayBuffer = data.buffer.slice(0, 8);

      const uint8Array = new Uint8Array(arrayBuffer);

      // Use the 'arrayBuffer' here as needed
      const isPNG = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const isJPEG = check([0xff, 0xd8, 0xff]);

      if (isPNG(uint8Array) === false && isJPEG(uint8Array) === false) {
        resolve({
          eng: "File format not allowed! Only JPG or PNG...",
          esp: "Formato de archivo no válido! Solo JPG o PNG...",
        });
      }

      return resolve(false);
    });
  });
};

const validateImageSize = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      const fileSizeInBytes = stats.size;

      const fileSizeInMb = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMb > 2) {
        resolve({
          eng: "File must be up to 2mb!",
          esp: "El archivo debe pesar hasta 2mb!",
        });
      }

      return resolve(false);
    });
  });
};

module.exports = {
  validateFileType,
  validateImageSize,
};
