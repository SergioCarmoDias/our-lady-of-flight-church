document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('massTableBody');
    const adminHeader = document.getElementById('adminHeader');
    const token = localStorage.getItem('adminToken');
    const isAdmin = !!token;

    if (isAdmin && adminHeader) {
        adminHeader.style.display = 'table-cell';
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/mass-timings`);
        const timings = await res.json();

        if (res.ok && timings.length > 0) {
            renderTable(timings, isAdmin, token);
        } else {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No mass timings found.</td></tr>`;
        }
    } catch (err) {
        console.error('Error loading mass timings:', err);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Failed to load schedule.</td></tr>`;
    }
});

function renderTable(timings, isAdmin, token) {
    const tableBody = document.getElementById('massTableBody');
    tableBody.innerHTML = '';

    timings.forEach((item) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', item._id);

        row.innerHTML = `
            <td class="col-day">${item.day}</td>
            <td class="col-date">${item.date || '-'}</td>
            <td class="col-time">${item.time}</td>
            <td class="col-title">${item.title}</td>
            <td class="col-organizer">${item.organizer}</td>
            <td class="col-tag">${item.tag || '-'}</td>
            ${isAdmin ? `<td><button class="edit-row-btn">Edit</button></td>` : ''}
        `;

        if (isAdmin) {
            const editBtn = row.querySelector('.edit-row-btn');
            editBtn.addEventListener('click', () => makeRowEditable(row, item, token));
        }

        tableBody.appendChild(row);
    });
}

function makeRowEditable(row, item, token) {
    const titles = ['1st Mass', '2nd Mass', 'Sunday Anticipated English Mass', 'Daily Mass', 'Special Mass', 'No Mass'];
    const organizers = [
        'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 
        'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 
        'Catechist', 'Catechism Children', 'None'
    ];

    row.innerHTML = `
        <td data-label="Day">${item.day}</td>
        <td data-label="Date"><input type="text" class="edit-date" value="${item.date || ''}" placeholder="e.g. Sep 06, 2026"></td>
        <td data-label="Time"><input type="text" class="edit-time" value="${item.time || ''}" placeholder="e.g. 7:30 AM"></td>
        <td data-label="Mass Title">
            <select class="edit-title">
                ${titles.map(t => `<option value="${t}" ${item.title === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
        </td>
        <td data-label="Organizer">
            <select class="edit-organizer">
                ${organizers.map(s => `<option value="${s}" ${item.organizer === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
        </td>
        <td data-label="Intention / Tag"><input type="text" class="edit-tag" value="${item.tag || ''}" placeholder="e.g. Thanksgiving"></td>
        <td data-label="Action"><button class="save-row-btn">Save</button></td>
    `;

    row.querySelector('.save-row-btn').addEventListener('click', async () => {
        const timeInput = row.querySelector('.edit-time').value.trim();
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

        if (!timeRegex.test(timeInput)) {
            alert('Please enter a valid time in 12-hour format (e.g., 7:30 AM)');
            return;
        }

        const updatedData = {
            day: item.day,
            date: row.querySelector('.edit-date').value,
            time: timeInput,
            title: row.querySelector('.edit-title').value,
            organizer: row.querySelector('.edit-organizer').value,
            tag: row.querySelector('.edit-tag').value
        };

        try {
            const res = await fetch(`${API_URL}/api/admin/mass-timings/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const result = await res.json();
            if (res.ok) {
                Object.assign(item, updatedData);
                renderRowStatic(row, item, token);
            } else {
                alert(result.message || 'Failed to update');
            }
        } catch (error) {
            console.error('Error saving row:', error);
        }
    });
}

function renderRowStatic(row, item, token) {
    row.innerHTML = `
        <td data-label="Day">${item.day}</td>
        <td data-label="Date">${item.date || '-'}</td>
        <td data-label="Time">${item.time || '-'}</td>
        <td data-label="Mass Title">${item.title}</td>
        <td data-label="Organizer">${item.organizer}</td>
        <td data-label="Intention / Tag">${item.tag || '-'}</td>
        <td data-label="Action"><button class="edit-row-btn">Edit</button></td>
    `;
    row.querySelector('.edit-row-btn').addEventListener('click', () => makeRowEditable(row, item, token));
}

// Notice Section
document.addEventListener('DOMContentLoaded', async () => {
    const noticeDisplay = document.getElementById('noticeDisplay');
    const noticeEditSection = document.getElementById('noticeEditSection');
    const noticeInput = document.getElementById('noticeInput');
    const editNoticeBtn = document.getElementById('editNoticeBtn');
    const saveNoticeBtn = document.getElementById('saveNoticeBtn');
    const cancelNoticeBtn = document.getElementById('cancelNoticeBtn');
    
    const token = localStorage.getItem('adminToken');
    const isAdmin = !!token;

    let currentNoticeText = '';

    // Fetch notice on load
    try {
        const res = await fetch(`${API_URL}/api/admin/notice`);
        const data = await res.json();
        if (res.ok) {
            currentNoticeText = data.content;
            noticeDisplay.textContent = currentNoticeText;
            if (isAdmin) {
                editNoticeBtn.style.display = 'inline-block';
            }
        }
    } catch (err) {
        noticeDisplay.textContent = 'Failed to load notice.';
    }

    // Toggle edit mode on button click
    if (isAdmin) {
        editNoticeBtn.addEventListener('click', () => {
            noticeInput.value = currentNoticeText;
            noticeDisplay.style.display = 'none';
            noticeEditSection.style.display = 'block';
            editNoticeBtn.style.display = 'none';
        });

        cancelNoticeBtn.addEventListener('click', () => {
            noticeEditSection.style.display = 'none';
            noticeDisplay.style.display = 'block';
            editNoticeBtn.style.display = 'inline-block';
        });

        saveNoticeBtn.addEventListener('click', async () => {
            const updatedContent = noticeInput.value.trim();
            try {
                const res = await fetch(`${API_URL}/api/admin/notice`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: updatedContent })
                });
                const result = await res.json();
                if (res.ok) {
                    currentNoticeText = updatedContent;
                    noticeDisplay.textContent = currentNoticeText;
                    
                    // Switch back to static view
                    noticeEditSection.style.display = 'none';
                    noticeDisplay.style.display = 'block';
                    editNoticeBtn.style.display = 'inline-block';
                } else {
                    alert(result.message || 'Failed to update notice');
                }
            } catch (error) {
                console.error('Error updating notice:', error);
            }
        });
    }
});