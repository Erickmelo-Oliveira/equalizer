import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Search, Package, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (data: any) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScanSuccess, onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      setLoading(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        // Start scanning after video loads
        videoRef.current.onloadedmetadata = () => {
          scanQRCode();
        };
      }
    } catch (err) {
      setError('Erro ao acessar a câmera. Verifique as permissões.');
      console.error('Camera error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Try to decode QR code from canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = await decodeQRCode(imageData);
      
      if (qrCode) {
        await processQRCode(qrCode);
        return;
      }
    } catch (err) {
      // Continue scanning
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const decodeQRCode = async (imageData: ImageData): Promise<string | null> => {
    // Simple QR code detection (in a real implementation, you'd use a proper QR code library)
    // For now, we'll simulate QR code detection
    return null;
  };

  const processQRCode = async (qrData: string) => {
    setLoading(true);
    try {
      // Parse QR code data (NFe format)
      const nfeData = parseNFeQRCode(qrData);
      
      if (nfeData) {
        // Fetch NFe details from SEFAZ
        const nfeDetails = await fetchNFeDetails(nfeData);
        onScanSuccess(nfeDetails);
        stopCamera();
      } else {
        setError('QR Code não é de uma Nota Fiscal válida');
      }
    } catch (err) {
      setError('Erro ao processar QR Code da NFe');
      console.error('QR processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseNFeQRCode = (qrData: string) => {
    try {
      // NFe QR Code format: URL with parameters
      const url = new URL(qrData);
      const params = new URLSearchParams(url.search);
      
      return {
        chNFe: params.get('chNFe'),
        nVersao: params.get('nVersao'),
        tpAmb: params.get('tpAmb'),
        cDest: params.get('cDest'),
        dhEmi: params.get('dhEmi'),
        vNF: params.get('vNF'),
        vICMS: params.get('vICMS'),
        digVal: params.get('digVal'),
        cIdToken: params.get('cIdToken')
      };
    } catch {
      return null;
    }
  };

  const fetchNFeDetails = async (qrData: any) => {
    // Simulate API call to SEFAZ or NFe service
    // In production, you'd integrate with services like:
    // - SEFAZ APIs
    // - NFe.io
    // - WebmaniaBR
    // - Focus NFe
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    return {
      chave: qrData.chNFe,
      numero: '000123456',
      serie: '001',
      dataEmissao: new Date().toISOString(),
      cnpjEmitente: '12.345.678/0001-90',
      nomeEmitente: 'Empresa Exemplo LTDA',
      produtos: [
        {
          codigo: 'PROD001',
          descricao: 'Produto Exemplo 1kg',
          ncm: '12345678',
          cfop: '5102',
          unidade: 'kg',
          quantidade: 1,
          valorUnitario: 15.50,
          valorTotal: 15.50,
          origem: '0',
          cst: '00'
        }
      ],
      valorTotal: parseFloat(qrData.vNF || '0')
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Create image from file
      const img = new Image();
      const canvas = canvasRef.current;
      
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = await decodeQRCode(imageData);
          
          if (qrCode) {
            await processQRCode(qrCode);
          } else {
            setError('Não foi possível detectar QR Code na imagem');
          }
        } catch (err) {
          setError('Erro ao processar imagem');
        } finally {
          setLoading(false);
        }
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Erro ao carregar imagem');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Scanner QR Code NFe</h3>
              <p className="text-gray-600 text-sm">Escaneie o QR Code da Nota Fiscal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center">
              <Loader className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
              <p className="text-blue-700 font-medium">Processando QR Code...</p>
            </div>
          )}

          {/* Camera View */}
          {isScanning ? (
            <div className="relative mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-900 rounded-xl object-cover"
              />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-xl pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                Posicione o QR Code no centro
              </div>
            </div>
          ) : (
            <div className="mb-6 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Escaneie o QR Code da Nota Fiscal para importar produtos automaticamente</p>
            </div>
          )}

          {/* Hidden canvas for QR processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!isScanning ? (
              <button
                onClick={startCamera}
                disabled={loading}
                className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Camera className="h-5 w-5 mr-2" />
                Iniciar Câmera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center justify-center px-6 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <X className="h-5 w-5 mr-2" />
                Parar Câmera
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center justify-center px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Imagem
            </button>

            <button
              onClick={onClose}
              className="flex items-center justify-center px-6 py-4 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Cancelar
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-bold text-blue-900 mb-2">Como usar:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Aponte a câmera para o QR Code da NFe</li>
              <li>• Ou faça upload de uma foto do QR Code</li>
              <li>• Os produtos serão importados automaticamente</li>
              <li>• Verifique os dados antes de salvar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}