// Input Image
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    const overlay = document.getElementById('adminImgOverlay');
    const imageInput = document.getElementById('imageUploadInput');
    const previewImg = document.getElementById('archiveImgPreview');
    const removeBtn = document.getElementById('removeImageBtn');
    const defaultSvg = previewImg.src; // Keep the fallback SVG

    // Fetch the saved image on page load
    try {
        const response = await fetch(`${API_URL}/api/admin/history-image`);
        const data = await response.json();
        if (response.ok && data.imageUrl) {
            previewImg.src = data.imageUrl; // Load saved Cloudinary image
        }
    } catch (err) {
        console.error('Failed to load image:', err);
    }
    
    // Show hover overlay if admin is authenticated
    if (token && overlay) {
        // Override default flex display behavior on hover via a class check or direct style
        overlay.style.display = ''; // Controlled via CSS hover, but ensure it exists
    }

    // Handle Image Upload & Cloudinary routing
    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);
            formData.append('section', 'church_history_image');

            try {
                const response = await fetch(`${API_URL}/api/admin/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                const data = await response.json();
                if (response.ok) {
                    previewImg.src = data.imageUrl; // Cloudinary secure URL returned from backend
                } else {
                    alert(data.message || 'Image upload failed.');
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert('Server error during upload.');
            }
        });
    }

    // Handle Image Removal
    if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to remove this image?')) return;

            try {
                const response = await fetch(`${API_URL}/api/admin/image/church_history_image`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    previewImg.src = 'images/placeholder-thumbnail.jpg'; // Revert to default thumbnail
                } else {
                    alert('Failed to remove image.');
                }
            } catch (err) {
                console.error('Removal error:', err);
            }
        });
    }
});

// History Content
document.addEventListener('DOMContentLoaded', async () => {
    const historyParagraph = document.getElementById('historyParagraph');
    const editControls = document.getElementById('adminEditControls');
    const editBtn = document.getElementById('editHistoryBtn');
    
    // Check if user is logged in as admin to show the edit button
    const token = localStorage.getItem('adminToken');
    if (token && editControls) {
        editControls.style.display = 'block';
    }

    // 1. Fetch and display existing content on page load
    try {
        const res = await fetch(`${API_URL}/api/admin/history-content`);
        const data = await res.json();
        if (res.ok && data.content) {
            historyParagraph.textContent = data.content;
        }
    } catch (err) {
        console.error('Failed to load history content:', err);
    }

    // 2. Handle Edit Click: Swap paragraph with Textarea & Save button
    editBtn.addEventListener('click', () => {
        const currentText = historyParagraph.textContent;
        const container = document.getElementById('historyTextContainer');

        container.innerHTML = `
            <textarea id="historyTextarea" style="width: 100%; height: 150px; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">${currentText}</textarea>
            <button id="saveHistoryBtn" class="upload-btn-label" style="border: none; cursor: pointer;">Save</button>
            <button id="cancelHistoryBtn" class="remove-btn" style="margin-left: 10px; cursor: pointer;">Cancel</button>
        `;
        editBtn.style.display = 'none'; // Hide edit button while editing

        // 3. Handle Save Click
        document.getElementById('saveHistoryBtn').addEventListener('click', async () => {
            const newContent = document.getElementById('historyTextarea').value;

            try {
                const response = await fetch(`${API_URL}/api/admin/history-content`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: newContent })
                });

                const result = await response.json();
                if (response.ok) {
                    // Restore paragraph view with updated content
                    container.innerHTML = `<p id="historyParagraph">${result.content}</p>`;
                    editBtn.style.display = 'inline-block';
                } else {
                    alert(result.message || 'Failed to save');
                }
            } catch (error) {
                console.error('Error saving content:', error);
            }
        });

        // Handle Cancel Click
        document.getElementById('cancelHistoryBtn').addEventListener('click', () => {
            container.innerHTML = `<p id="historyParagraph">${currentText}</p>`;
            editBtn.style.display = 'inline-block';
        });
    });
});