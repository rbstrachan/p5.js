// Tab switching logic
document.getElementById('transmitTab').addEventListener('click', function () {
    document.getElementById('transmitTab').classList.add('active');
    document.getElementById('receiveTab').classList.remove('active');
    document.getElementById('transmitContent').classList.add('active');
    document.getElementById('receiveContent').classList.remove('active');
});

document.getElementById('receiveTab').addEventListener('click', function () {
    document.getElementById('transmitTab').classList.remove('active');
    document.getElementById('receiveTab').classList.add('active');
    document.getElementById('transmitContent').classList.remove('active');
    document.getElementById('receiveContent').classList.add('active');
});

// File transfer state
const state = {
    file: null,
    compressedData: null,
    chunks: [],
    currentChunkIndex: 0,
    totalChunks: 0,
    receivedChunks: {},
    fileName: '',
    fileType: '',
    scanning: false
};

// Constants
const MAX_QR_DATA = 1500; // Maximum data size per QR code (can be adjusted)

// Transmit logic
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');

// Drag and drop handling
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

// Compress and prepare file for QR encoding
document.getElementById('startTransmitBtn').addEventListener('click', function () {
    if (!state.file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const arrayBuffer = e.target.result;

        try {
            // Compress data using pako (GZIP implementation)
            const uint8Array = new Uint8Array(arrayBuffer);
            const compressed = pako.deflate(uint8Array);
            state.compressedData = compressed;

            // Split compressed data into chunks
            prepareChunks(compressed);

            // Display first QR code
            displayQRCode(0);

            document.getElementById('nextQRBtn').style.display = 'block';
            document.getElementById('startTransmitBtn').disabled = true;
        } catch (err) {
            console.error('Compression error:', err);
            const qrProgress = document.getElementById('qrProgress');
            qrProgress.innerHTML = `<div class="error">Error compressing file: ${err.message}</div>`;
        }
    };
    reader.readAsArrayBuffer(state.file);
});

// Next QR code button
document.getElementById('nextQRBtn').addEventListener('click', function () {
    if (state.currentChunkIndex < state.totalChunks - 1) {
        state.currentChunkIndex++;
        displayQRCode(state.currentChunkIndex);
    } else {
        // Loop back to first chunk
        state.currentChunkIndex = 0;
        displayQRCode(state.currentChunkIndex);
    }
});

function prepareChunks(data) {
    const chunkSize = MAX_QR_DATA;
    state.chunks = [];

    // Prepare header chunk with metadata
    const headerData = {
        type: 'header',
        fileName: state.fileName,
        fileType: state.fileType || 'application/octet-stream',
        totalSize: data.length,
        totalChunks: Math.ceil(data.length / chunkSize) + 1 // +1 for header chunk
    };

    state.chunks.push(JSON.stringify(headerData));
    state.totalChunks = headerData.totalChunks;

    // Split data into chunks
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        // Convert binary chunk to base64
        const base64Chunk = arrayBufferToBase64(chunk);

        const chunkData = {
            type: 'chunk',
            index: state.chunks.length,
            totalChunks: headerData.totalChunks,
            data: base64Chunk
        };

        state.chunks.push(JSON.stringify(chunkData));
    }
}

function displayQRCode(index) {
    const qrCodeContainer = document.getElementById('qrCode');
    const qrProgress = document.getElementById('qrProgress');
    qrCodeContainer.innerHTML = '';

    // Create a canvas element
    const canvas = document.createElement('canvas');
    qrCodeContainer.appendChild(canvas);

    try {
        QRCode.toCanvas(canvas, state.chunks[index], {
            scale: 8,
            margin: 1,
            errorCorrectionLevel: 'L'
        }, function (error) {
            if (error) {
                console.error('Error generating QR code:', error);
                qrProgress.innerHTML = `<div class="error">Error generating QR code: ${error.message}</div>`;
            } else {
                qrProgress.innerHTML = `Showing block ${index + 1} of ${state.totalChunks} (${Math.round((index + 1) / state.totalChunks * 100)}%)`;
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrProgress.innerHTML = `<div class="error">Error generating QR code: ${error.message}</div>`;
    }
}

// Receive logic
const startCameraBtn = document.getElementById('startCameraBtn');
const cameraPreview = document.getElementById('cameraPreview');

startCameraBtn.addEventListener('click', function () {
    if (state.scanning) {
        stopCamera();
        startCameraBtn.textContent = 'Start Camera';
        document.getElementById('receiveArea').style.display = 'none';
        state.scanning = false;
    } else {
        startCamera();
        startCameraBtn.textContent = 'Stop Camera';
        document.getElementById('receiveArea').style.display = 'block';
        state.scanning = true;

        // Reset received state
        state.receivedChunks = {};
        document.getElementById('scannedCount').textContent = '0';
        document.getElementById('totalBlocks').textContent = '?';
        document.getElementById('downloadBtn').style.display = 'none';
    }
});

async function startCamera() {
    try {
        // Check if mediaDevices API is available
        if (!navigator.mediaDevices) {
            // Try alternative access method for older browsers
            const MediaDevices = navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;

            if (!MediaDevices) {
                throw new Error('Your browser doesn\'t support camera access. Try Chrome or update your browser.');
            }

            // Use older API
            MediaDevices({ video: { facingMode: 'environment' } },
                // Success callback
                function (stream) {
                    cameraPreview.srcObject = stream;
                    cameraPreview.style.display = 'block';
                    cameraPreview.play();
                    requestAnimationFrame(scanQRCode);
                },
                // Error callback
                function (error) {
                    throw new Error('Camera access failed: ' + error.message);
                }
            );
        } else {
            // Modern API
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

            // Start scanning for QR codes
            requestAnimationFrame(scanQRCode);
        }
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
    if (cameraPreview.srcObject) {
        const tracks = cameraPreview.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        cameraPreview.srcObject = null;
        cameraPreview.style.display = 'none';
    }
}

function scanQRCode() {
    if (!state.scanning) return;

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
                const chunkData = JSON.parse(code.data);

                // Handle header chunk
                if (chunkData.type === 'header') {
                    document.getElementById('totalBlocks').textContent = chunkData.totalChunks;
                    state.fileName = chunkData.fileName;
                    state.fileType = chunkData.fileType;

                    // Mark header as received
                    if (!state.receivedChunks[0]) {
                        state.receivedChunks[0] = chunkData;
                        updateReceiveProgress();
                    }
                }
                // Handle data chunk
                else if (chunkData.type === 'chunk') {
                    // Store chunk if not already received
                    if (!state.receivedChunks[chunkData.index]) {
                        state.receivedChunks[chunkData.index] = chunkData;
                        updateReceiveProgress();

                        // Check if all chunks received
                        if (Object.keys(state.receivedChunks).length === chunkData.totalChunks) {
                            assembleFile();
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing QR data:', error);
            }
        }
    }

    requestAnimationFrame(scanQRCode);
}

function updateReceiveProgress() {
    const scannedCount = Object.keys(state.receivedChunks).length;
    const totalBlocks = document.getElementById('totalBlocks').textContent;

    document.getElementById('scannedCount').textContent = scannedCount;

    if (totalBlocks !== '?') {
        const progress = Math.round((scannedCount / parseInt(totalBlocks)) * 100);
        document.getElementById('receiveProgress').value = progress;
    }
}

function assembleFile() {
    try {
        // Extract header information
        const header = state.receivedChunks[0];
        const totalChunks = header.totalChunks;

        // Verify all chunks are received
        for (let i = 0; i < totalChunks; i++) {
            if (!state.receivedChunks[i]) {
                throw new Error(`Missing chunk ${i}`);
            }
        }

        // Assemble binary data
        const binaryChunks = [];

        // Skip header (index 0)
        for (let i = 1; i < totalChunks; i++) {
            const chunk = state.receivedChunks[i];
            const binaryData = base64ToArrayBuffer(chunk.data);
            binaryChunks.push(binaryData);
        }

        // Combine all binary chunks
        const totalLength = binaryChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const combinedData = new Uint8Array(totalLength);

        let offset = 0;
        for (const chunk of binaryChunks) {
            combinedData.set(chunk, offset);
            offset += chunk.length;
        }

        // Decompress data
        const decompressedData = pako.inflate(combinedData);

        // Create file and prepare download
        const blob = new Blob([decompressedData], { type: header.fileType });

        // Set up download button
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

        // Add success message
        const receivedData = document.getElementById('receivedData');
        receivedData.innerHTML += `<div class="success">File successfully reconstructed: ${header.fileName} (${formatFileSize(decompressedData.length)})</div>`;

    } catch (error) {
        console.error('Error assembling file:', error);
        const receivedData = document.getElementById('receivedData');
        receivedData.innerHTML += `<div class="error">Error assembling file: ${error.message}</div>`;
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Add these to the state object
state.lastAcknowledgedChunk = -1;
state.autoAdvance = false;
state.feedbackScanning = false;

// Function to generate feedback QR code on the receiving device
function updateFeedbackQR(chunkIndex) {
    const feedbackQRContainer = document.getElementById('feedbackQR');
    feedbackQRContainer.innerHTML = '';

    const feedbackData = JSON.stringify({
        type: 'feedback',
        lastReceived: chunkIndex,
        fileName: state.fileName
    });

    // Create a canvas element for the feedback QR code
    const canvas = document.createElement('canvas');
    feedbackQRContainer.appendChild(canvas);

    try {
        QRCode.toCanvas(canvas, feedbackData, {
            scale: 4, // Adjust scale as needed for visibility
            margin: 1,
            errorCorrectionLevel: 'L' // Use string value directly
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

// Modify the updateReceiveProgress function to generate feedback QR
function updateReceiveProgress() {
    const scannedCount = Object.keys(state.receivedChunks).length;
    const totalBlocks = document.getElementById('totalBlocks').textContent;

    document.getElementById('scannedCount').textContent = scannedCount;

    if (totalBlocks !== '?') {
        const progress = Math.round((scannedCount / parseInt(totalBlocks)) * 100);
        document.getElementById('receiveProgress').value = progress;
    }

    // Generate feedback QR code with the highest received chunk index
    let highestChunkIndex = -1;
    for (const key in state.receivedChunks) {
        const index = parseInt(key);
        if (index > highestChunkIndex) {
            highestChunkIndex = index;
        }
    }

    updateFeedbackQR(highestChunkIndex);
}

// Start feedback scanner on transmitting device
document.getElementById('startTransmitBtn').addEventListener('click', function () {
    if (!state.file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const arrayBuffer = e.target.result;

        try {
            // Compress data using pako (GZIP implementation)
            const uint8Array = new Uint8Array(arrayBuffer);
            const compressed = pako.deflate(uint8Array);
            state.compressedData = compressed;

            // Split compressed data into chunks
            prepareChunks(compressed);

            // Display first QR code
            displayQRCode(0);

            // Show feedback scanner section
            document.getElementById('feedbackScannerSection').style.display = 'block';
            document.getElementById('nextQRBtn').style.display = 'block';
            document.getElementById('startTransmitBtn').disabled = true;
        } catch (err) {
            console.error('Compression error:', err);
            const qrProgress = document.getElementById('qrProgress');
            qrProgress.innerHTML = `<div class="error">Error compressing file: ${err.message}</div>`;
        }
    };
    reader.readAsArrayBuffer(state.file);
});

// Add feedback scanner functionality
document.getElementById('startFeedbackScanBtn').addEventListener('click', function () {
    if (state.feedbackScanning) {
        stopFeedbackScanner();
        this.textContent = 'Start Feedback Scanner';
        state.autoAdvance = false;
    } else {
        startFeedbackScanner();
        this.textContent = 'Stop Feedback Scanner';
        state.autoAdvance = true;
    }
});

// Start feedback scanner camera
async function startFeedbackScanner() {
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

        // Start scanning for feedback QR codes
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

// Stop feedback scanner
function stopFeedbackScanner() {
    const feedbackCameraPreview = document.getElementById('feedbackCameraPreview');

    if (feedbackCameraPreview.srcObject) {
        const tracks = feedbackCameraPreview.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        feedbackCameraPreview.srcObject = null;
        feedbackCameraPreview.style.display = 'none';
    }

    state.feedbackScanning = false;
}

// Scan feedback QR codes
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

                    // If we get a new acknowledgment, move to the next chunk
                    if (lastReceived > state.lastAcknowledgedChunk) {
                        state.lastAcknowledgedChunk = lastReceived;

                        // If we haven't reached the end yet, show the next chunk
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
                            // All chunks have been received
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

// Update the scanQRCode function to generate feedback QR after each successful scan
function scanQRCode() {
    if (!state.scanning) return;

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
                const chunkData = JSON.parse(code.data);

                // Handle header chunk
                if (chunkData.type === 'header') {
                    document.getElementById('totalBlocks').textContent = chunkData.totalChunks;
                    state.fileName = chunkData.fileName;
                    state.fileType = chunkData.fileType;

                    // Mark header as received
                    if (!state.receivedChunks[0]) {
                        state.receivedChunks[0] = chunkData;
                        updateReceiveProgress();
                    }
                }
                // Handle data chunk
                else if (chunkData.type === 'chunk') {
                    // Store chunk if not already received
                    if (!state.receivedChunks[chunkData.index]) {
                        state.receivedChunks[chunkData.index] = chunkData;
                        updateReceiveProgress();

                        // Check if all chunks received
                        if (Object.keys(state.receivedChunks).length === chunkData.totalChunks) {
                            assembleFile();
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing QR data:', error);
            }
        }
    }

    requestAnimationFrame(scanQRCode);
}
