// About Us
document.addEventListener('DOMContentLoaded', async () => {
    const snippetContainer = document.getElementById('homeHistorySnippet');
    const homeImg = document.getElementById('homeHistoryImg');

    try {
        // Fetch text and image in parallel for efficiency
        const [contentRes, imageRes] = await Promise.all([
            fetch(`${API_URL}/api/admin/history-content`),
            fetch(`${API_URL}/api/admin/history-image`)
        ]);

        const contentData = await contentRes.json();
        const imageData = await imageRes.json();

        // 1. Handle Text Snippet (truncate to ~200 characters or roughly 3 lines)
        if (contentRes.ok && contentData.content) {
            const fullText = contentData.content;
            const snippet = fullText.length > 220 ? fullText.substring(0, 220) + '...' : fullText;
            snippetContainer.textContent = snippet;
        }

        // 2. Handle Image Display
        if (imageRes.ok && imageData.imageUrl) {
            homeImg.src = imageData.imageUrl;
            homeImg.style.display = 'block'; // Reveal image container if available
        }
    } catch (err) {
        console.error('Failed to load homepage history preview:', err);
        snippetContainer.textContent = 'Cunchelim is a village known for its rich history, cultural heritage, and scenic beauty...';
    }
});

// Mass Timings Section
document.addEventListener('DOMContentLoaded', async () => {
    const homeTimingList = document.getElementById('homeTimingList');

    try {
        const res = await fetch(`${API_URL}/api/admin/mass-timings`);
        const timings = await res.json();

        if (res.ok && timings.length > 0) {
            homeTimingList.innerHTML = '';
            
            // Render preview items (e.g., showing top 5 or all)
            timings.forEach((item) => {
                const li = document.createElement('li');
                li.className = 'home-timing-item';
                li.style.cursor = 'pointer';
                
                li.innerHTML = `
                    <span style="font-weight: bold; color: #2c3e50;">${item.day} (${item.date || '-'})</span> - 
                    <span style="color: #5bc0de;">${item.time}</span>: 
                    <span>${item.title}</span>
                `;

                // On click, redirect to the services page and jump to mass timings section
                li.addEventListener('click', () => {
                    window.location.href = `services.html#massTimingsSection`;
                });

                homeTimingList.appendChild(li);
            });
        } else {
            homeTimingList.innerHTML = `<li>No mass timings available.</li>`;
        }
    } catch (err) {
        console.error('Error loading mass preview:', err);
        homeTimingList.innerHTML = `<li>Failed to load schedule.</li>`;
    }
});