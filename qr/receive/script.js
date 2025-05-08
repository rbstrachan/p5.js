
const state = {
    receivedChunks: {},
    fileName: '',
    fileType: '',
    scanning: false
};

document.addEventListener('DOMContentLoaded', function () {
    startCamera();
    updateFeedbackQR(-1);
});

async function startCamera() {
    if (state.scanning) return;

    const cameraPreview = document.getElementById('cameraPreview');

    try {
        if (!navigator.mediaDevices) {
            const MediaDevices = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;

            if (!MediaDevices) {
                throw new Error('Your browser doesn\'t support camera access. Try Chrome or update your browser.');
            }

            MediaDevices({ video: { facingMode: 'environment' } },
                function (stream) {
                    cameraPreview.srcObject = stream;
                    cameraPreview.style.display = 'block';
                    cameraPreview.play();
                    state.scanning = true;
                    requestAnimationFrame(scanQRCode);
                },
                function (error) {
                    throw new Error('Camera access failed: ' + error.message);
                }
            );
        } else {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraPreview.srcObject = stream;
            cameraPreview.style.display = 'block';
            cameraPreview.play();

            state.scanning = true;

            requestAnimationFrame(scanQRCode);
        }

        state.receivedChunks = {};
        document.getElementById('scannedCount').textContent = '0';
        document.getElementById('totalBlocks').textContent = '?';
        document.getElementById('downloadBtn').style.display = 'none';

    } catch (error) {
        console.error('Error accessing camera:', error);
        document.getElementById('receiveArea').innerHTML = `
            <div class="error">
                <p>Error accessing camera: ${error.message}</p>
                <p>Try the following:</p>
                <ul>
                    <li>Make sure you've granted camera permissions</li>
                    <li>Try using Chrome browser instead of Firefox</li>
                    <li>Check if your camera is being used by another application</li>
                    <li>Reload the page and try again</li>
                </ul>
            </div>`;
    }
}
function stopCamera() {
    if (!state.scanning) return;

    const cameraPreview = document.getElementById('cameraPreview');

    if (cameraPreview.srcObject) {
        const tracks = cameraPreview.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        cameraPreview.srcObject = null;
    }

    state.scanning = false;
}

function updateFeedbackQR(chunkIndex) {
    const feedbackQRContainer = document.getElementById('feedbackQR');
    feedbackQRContainer.innerHTML = '';

    const feedbackData = JSON.stringify({
        type: 'feedback',
        lastReceived: chunkIndex,
        fileName: state.fileName
    });

    const canvas = document.createElement('canvas');
    feedbackQRContainer.appendChild(canvas);

    try {
        QRCode.toCanvas(canvas, feedbackData, {
            scale: 8,
            margin: 1,
            errorCorrectionLevel: 'L'
        }, function (error) {
            if (error) {
                console.error('Error generating feedback QR code:', error);
                feedbackQRContainer.innerHTML = `<div class="error">Error generating feedback QR: ${error.message}</div>`;
            }
        });
    } catch (error) {
        console.error('Error generating feedback QR code:', error);
        feedbackQRContainer.innerHTML = `<div class="error">Error generating feedback QR: ${error.message}</div>`;
    }
}

function updateReceiveProgress() {
    const scannedCount = Object.keys(state.receivedChunks).length;
    const totalBlocks = document.getElementById('totalBlocks').textContent;

    document.getElementById('scannedCount').textContent = scannedCount;

    if (totalBlocks !== '?') {
        const progress = Math.round((scannedCount / parseInt(totalBlocks)) * 100);
        document.getElementById('receiveProgress').value = progress;
    }

    let highestChunkIndex = -1;
    for (const key in state.receivedChunks) {
        const index = parseInt(key);
        if (index > highestChunkIndex) {
            highestChunkIndex = index;
        }
    }

    updateFeedbackQR(highestChunkIndex);
}

function scanQRCode() {
    if (!state.scanning) return;

    const cameraPreview = document.getElementById('cameraPreview');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (cameraPreview.videoWidth && cameraPreview.videoHeight) {
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        if (code) {
            try {
                try {
                    const jsonData = JSON.parse(code.data);
                    if (jsonData.type === 'header') {
                        document.getElementById('totalBlocks').textContent = jsonData.totalChunks;
                        state.fileName = jsonData.fileName;
                        state.fileType = jsonData.fileType;

                        if (!state.receivedChunks[0]) {
                            state.receivedChunks[0] = jsonData;
                            updateReceiveProgress();
                        }
                    }
                    return;
                } catch (jsonError) {
                }

                const binaryString = code.data;
                const bytes = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const view = new DataView(bytes.buffer);
                const chunkIndex = view.getUint16(0, false);
                const totalChunks = view.getUint16(2, false);

                const chunkData = bytes.slice(4);

                if (!state.receivedChunks[chunkIndex]) {
                    state.receivedChunks[chunkIndex] = {
                        type: 'binary',
                        index: chunkIndex,
                        data: chunkData
                    };
                    updateReceiveProgress();

                    if (Object.keys(state.receivedChunks).length === totalChunks) {
                        assembleFile();
                    }
                }
            } catch (error) {
                console.error('Error processing QR data:', error);
            }
        }
    }

    requestAnimationFrame(scanQRCode);
}

function assembleFile() {
    try {
        const header = state.receivedChunks[0];
        const totalChunks = header.totalChunks;

        for (let i = 0; i < totalChunks; i++) {
            if (!state.receivedChunks[i]) {
                throw new Error(`Missing chunk ${i}`);
            }
        }

        let totalSize = 0;

        for (let i = 1; i < totalChunks; i++) {
            const chunk = state.receivedChunks[i];
            totalSize += chunk.data.length;
        }

        const combinedData = new Uint8Array(totalSize);
        let offset = 0;

        for (let i = 1; i < totalChunks; i++) {
            const chunk = state.receivedChunks[i];
            combinedData.set(chunk.data, offset);
            offset += chunk.data.length;
        }

        const decompressedData = pako.inflate(combinedData);

        console.log(`Compressed size: ${combinedData.length} bytes, Decompressed size: ${decompressedData.length} bytes`);

        const blob = new Blob([decompressedData], { type: header.fileType });

        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = function () {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = header.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        const receivedData = document.getElementById('receivedData');
        receivedData.innerHTML += `
            <div class="success">
                File successfully reconstructed: ${header.fileName} (${formatFileSize(decompressedData.length)})
                <br>Compressed size: ${formatFileSize(combinedData.length)} (${(combinedData.length / decompressedData.length * 100).toFixed(1)}% of original)
            </div>`;

    } catch (error) {
        console.error('Error assembling file:', error);
        const receivedData = document.getElementById('receivedData');
        receivedData.innerHTML += `<div class="error">Error assembling file: ${error.message}</div>`;
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}
