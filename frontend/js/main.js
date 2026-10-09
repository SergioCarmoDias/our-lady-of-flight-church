document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    const adminControls = document.getElementById('admin-controls');

    if (token) {
        // Optional: You can decode the token or verify its existence
        // If token exists, reveal admin-only elements and edit buttons
        adminControls.style.display = 'flex';
        
        // Reveal any inline edit buttons you added to the history/gallery sections
        document.querySelectorAll('.admin-edit-btn').forEach(btn => {
            btn.style.display = 'inline-block';
        });
    }

    // Handle logout action
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.reload(); // Refresh page to hide admin controls
        });
    }
});

// Determine the API base URL automatically based on where the app is running
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'                    // Local development
    : 'https://our-lady-of-flight-church-backend.vercel.app';   // Your live Render backend URL
