document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');
    const videoList = document.getElementById('videoList');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.querySelector('.close');

    // Base API URL
    const API_URL = 'http://localhost:5000/api/videos';

    // Load videos when page loads
    loadVideos();

    // Handle video upload
   uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const videoFile = document.getElementById('videoFile').files[0];
        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDescription').value;

        formData.append('video', videoFile);
        formData.append('metadata', JSON.stringify({
            title: title,
            description: description,
            uploadDate: new Date().toISOString()
        }));

        try {
            showStatus('Uploading video...', 'info');
            
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showStatus('Video uploaded successfully!', 'success');
                uploadForm.reset();
                loadVideos();
            } else {
                showStatus(`Error: ${result.error || 'Upload failed'}`, 'error');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            console.error('Upload error:', error);
        }
    });

    // Load all videos
    async function loadVideos() {
        try {
            const response = await fetch(API_URL);
            const videos = await response.json();

            videoList.innerHTML = '';
            
            if (videos.length === 0) {
                videoList.innerHTML = '<p>No videos found. Upload your first video!</p>';
                return;
            }

            videos.forEach(video => {
                const videoCard = createVideoCard(video);
                videoList.appendChild(videoCard);
            });
        } catch (error) {
            console.error('Error loading videos:', error);
            videoList.innerHTML = '<p class="error">Error loading videos. Please try again.</p>';
        }
    }

    // Create video card element
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        
        // In a real app, you might want to generate thumbnails on upload
        // For demo, we'll use a placeholder
        const img = document.createElement('img');
        img.src = 'https://via.placeholder.com/300x169?text=Video+Thumbnail';
        img.alt = video.filename;
        thumbnail.appendChild(img);
        
        const info = document.createElement('div');
        info.className = 'video-info';
        
        const title = document.createElement('h3');
        title.textContent = video.metadata?.title || video.filename;
        info.appendChild(title);
        
        const desc = document.createElement('p');
        desc.textContent = video.metadata?.description || 'No description provided';
        info.appendChild(desc);
        
        const playBtn = document.createElement('a');
        playBtn.className = 'play-btn';
        playBtn.textContent = 'Play Video';
        playBtn.href = '#';
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal(video);
        });
        info.appendChild(playBtn);
        
        card.appendChild(thumbnail);
        card.appendChild(info);
        
        return card;
    }

    // Open video modal
    function openVideoModal(video) {
        modalTitle.textContent = video.metadata?.title || video.filename;
        modalDescription.textContent = video.metadata?.description || '';
        modalVideo.src = `${API_URL}/${video._id}`;
        videoModal.style.display = 'block';
    }

    // Close modal
    closeModal.addEventListener('click', function() {
        videoModal.style.display = 'none';
        modalVideo.pause();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            modalVideo.pause();
        }
    });

    // Show status message
    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = `status-message ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 5000);
    }
});