// src/components/ScanPage.jsx
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const scannerRef = useRef(null);
  const navigate = useNavigate();
  const handledRef = useRef(false); // กันสแกนซ้ำ

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("barcode-scanner");

    Html5Qrcode.getCameras().then((devices) => {
      if (!devices?.length) return;
      const cameraId = devices[0].id;
      html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (handledRef.current) return;
          handledRef.current = true;
          try {
            await html5QrCode.stop();
          } catch {}
          // ตัดช่องว่าง/ขึ้นบรรทัดถ้ามี
          const sku = String(decodedText).trim();
          navigate(`/products/${encodeURIComponent(sku)}`);
        },
        (err) => {
          // สามารถแสดง toast ได้ถ้าต้องการ
          // console.warn("scan error", err);
        }
      );
    });

    return () => {
      try {
        html5QrCode.stop();
      } catch {}
    };
  }, [navigate]);

  return (
    <div style={{ padding: 30 }}>
      <h1>📷 สแกนบาร์โค้ด</h1>
      <div id="barcode-scanner" ref={scannerRef} style={{ width: 420 }} />
    </div>
  );
}
