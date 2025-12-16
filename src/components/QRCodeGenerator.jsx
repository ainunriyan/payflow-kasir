import React from "react";

const QRCodeGenerator = ({ text, size = 200 }) => {
  // Generate QR code URL using qr-server.com API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}`;

  return (
    <div className="flex justify-center">
      <img
        src={qrUrl}
        alt="QR Code"
        className="border rounded-lg shadow-sm"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default QRCodeGenerator;
