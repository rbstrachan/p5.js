const state = {
    file: null,
    compressedData: null,
    chunks: [],
    currentChunkIndex: 0,
    totalChunks: 0,
    fileName: '',
    fileType: '',
    lastAcknowledgedChunk: -1,
    autoAdvance: true,
    feedbackScanning: false
};

const MAX_QR_DATA = 1500;

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');

dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.classList.add('dragover');
});
dropzone.addEventListener('dragleave', function () {
    this.classList.remove('dragover');
});
dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    this.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});
dropzone.addEventListener('click', function () {
    fileInput.click();
});
fileInput.addEventListener('change', function () {
    if (this.files.length) {
        handleFileSelect(this.files[0]);
    }
});
function handleFileSelect(file) {
    state.file = file;
    state.fileName = file.name;
    state.fileType = file.type;

    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('transmitArea').style.display = 'block';
}

document.getElementById('startTransmitBtn').addEventListener('click', function () {
    if (!state.file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const arrayBuffer = e.target.result;

        try {
            const uint8Array = new Uint8Array(arrayBuffer);
            const compressed = pako.deflate(uint8Array);
            state.compressedData = compressed;

            prepareChunks(compressed);

            displayQRCode(0);

            document.getElementById('feedbackScannerSection').style.display = 'block';
            document.getElementById('nextQRBtn').style.display = 'block';
            document.getElementById('startTransmitBtn').disabled = true;

            startFeedbackScanner();
        } catch (err) {
            console.error('Compression error:', err);
            const qrProgress = document.getElementById('qrProgress');
            qrProgress.innerHTML = `<div class="error">Error compressing file: ${err.message}</div>`;
        }
    };
    reader.readAsArrayBuffer(state.file);
});

function prepareChunks(data) {
    const chunkSize = MAX_QR_DATA;
    state.chunks = [];

    const headerData = {
        type: 'header',
        fileName: state.fileName,
        fileType: state.fileType || 'application/octet-stream',
        totalSize: data.length,
        totalChunks: Math.ceil(data.length / chunkSize) + 1
    };

    state.chunks.push({
        type: 'json',
        data: JSON.stringify(headerData)
    });

    state.totalChunks = headerData.totalChunks;

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);

        state.chunks.push({
            type: 'binary',
            index: state.chunks.length,
            totalChunks: headerData.totalChunks,
            data: chunk
        });
    }

    const qrProgress = document.getElementById('qrProgress');
    const originalSize = state.file.size;
    const compressedSize = data.length;
    const compressionRatio = (compressedSize / originalSize * 100).toFixed(1);

    qrProgress.innerHTML += `
        <div class="info">
            <p>Original size: ${formatFileSize(originalSize)}</p>
            <p>Compressed size: ${formatFileSize(compressedSize)} (${compressionRatio}% of original)</p>
            <p>QR codes needed: ${state.totalChunks}</p>
        </div>`;
}

document.getElementById('nextQRBtn').addEventListener('click', function () {
    if (state.currentChunkIndex < state.totalChunks - 1) {
        state.currentChunkIndex++;
        displayQRCode(state.currentChunkIndex);
    } else {
        state.currentChunkIndex = 0;
        displayQRCode(state.currentChunkIndex);
    }
});

function displayQRCode(index) {
    const qrCodeContainer = document.getElementById('qrCode');
    const qrProgress = document.getElementById('qrProgress');
    qrCodeContainer.innerHTML = '';

    const canvas = document.createElement('canvas');
    qrCodeContainer.appendChild(canvas);

    const chunk = state.chunks[index];

    try {
        if (chunk.type === 'json') {
            QRCode.toCanvas(canvas, chunk.data, {
                scale: 8,
                margin: 1,
                errorCorrectionLevel: 'L'
            }, function (error) {
                if (error) throw error;
            });
        } else if (chunk.type === 'binary') {

            const headerSize = 4;
            const buffer = new ArrayBuffer(headerSize + chunk.data.length);
            const view = new DataView(buffer);

            view.setUint16(0, chunk.index, false);
            view.setUint16(2, chunk.totalChunks, false);

            const uint8 = new Uint8Array(buffer);
            uint8.set(chunk.data, headerSize);

            let binaryString = '';
            for (let i = 0; i < uint8.length; i++) {
                binaryString += String.fromCharCode(uint8[i]);
            }

            QRCode.toCanvas(canvas, binaryString, {
                scale: 8,
                margin: 1,
                errorCorrectionLevel: 'L'
            }, function (error) {
                if (error) throw error;
            });
        }

        qrProgress.innerHTML = `Showing block ${index + 1} of ${state.totalChunks} (${Math.round((index + 1) / state.totalChunks * 100)}%)`;
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrProgress.innerHTML = `<div class="error">Error generating QR code: ${error.message}</div>`;
    }
}

async function startFeedbackScanner() {
    if (state.feedbackScanning) return;

    const feedbackCameraPreview = document.getElementById('feedbackCameraPreview');

    try {
        if (!navigator.mediaDevices) {
            throw new Error('Your browser doesn\'t support camera access');
        }

        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        feedbackCameraPreview.srcObject = stream;
        feedbackCameraPreview.style.display = 'block';
        feedbackCameraPreview.play();

        state.feedbackScanning = true;
        state.autoAdvance = true;

        requestAnimationFrame(scanFeedbackQR);

    } catch (error) {
        console.error('Error accessing feedback camera:', error);
        document.getElementById('feedbackScannerSection').innerHTML += `
            <div class="error">
                <p>Error accessing camera: ${error.message}</p>
                <p>You can still use the manual "Next Block" button</p>
            </div>`;
    }
}
function stopFeedbackScanner() {
    if (!state.feedbackScanning) return;

    const feedbackCameraPreview = document.getElementById('feedbackCameraPreview');

    if (feedbackCameraPreview.srcObject) {
        const tracks = feedbackCameraPreview.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        feedbackCameraPreview.srcObject = null;
    }

    state.feedbackScanning = false;
    state.autoAdvance = false;
}

function scanFeedbackQR() {
    if (!state.feedbackScanning) return;

    const feedbackCameraPreview = document.getElementById('feedbackCameraPreview');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (feedbackCameraPreview.videoWidth && feedbackCameraPreview.videoHeight) {
        canvas.width = feedbackCameraPreview.videoWidth;
        canvas.height = feedbackCameraPreview.videoHeight;
        context.drawImage(feedbackCameraPreview, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        if (code) {
            try {
                const feedbackData = JSON.parse(code.data);

                if (feedbackData.type === 'feedback' && feedbackData.fileName === state.fileName) {
                    const lastReceived = feedbackData.lastReceived;

                    if (lastReceived > state.lastAcknowledgedChunk) {
                        state.lastAcknowledgedChunk = lastReceived;

                        if (lastReceived < state.totalChunks - 1) {
                            state.currentChunkIndex = lastReceived + 1;
                            displayQRCode(state.currentChunkIndex);

                            const qrProgress = document.getElementById('qrProgress');
                            qrProgress.innerHTML = `
                                <div class="success">
                                    Receiver acknowledged chunk ${lastReceived}. 
                                    Now showing chunk ${state.currentChunkIndex + 1} of ${state.totalChunks}.
                                </div>
                            `;
                        } else {
                            const qrProgress = document.getElementById('qrProgress');
                            qrProgress.innerHTML = `
                                <div class="success">
                                    All chunks have been acknowledged! Transfer complete.
                                </div>
                            `;
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing feedback QR:', error);
            }
        }
    }

    if (state.feedbackScanning) {
        requestAnimationFrame(scanFeedbackQR);
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}
