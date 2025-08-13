// Wedding Photo Sharing Application with Authentic Hong Kong Chinese
let app;

// Simple initialization function
function initApp() {
    console.log('Starting app initialization...');
    
    // Sample data with authentic Hong Kong Chinese from provided JSON
    const photos = [
        {
            id: 1,
            category: "ceremony",
            title: "行禮交換戒指",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
            comments: [{
                guestName: "陳小姐",
                comment: "新人好襯呀！祝你哋百年好合！",
                timestamp: "2025-08-13T14:30:00",
                visible: true
            }],
            printRequests: []
        },
        {
            id: 2,
            category: "ceremony", 
            title: "敬茶環節",
            url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=300&h=200&fit=crop",
            comments: [{
                guestName: "李生", 
                comment: "好感動嘅時刻，恭喜曬！",
                timestamp: "2025-08-13T14:45:00",
                visible: true
            }],
            printRequests: []
        },
        {
            id: 3,
            category: "reception",
            title: "擺酒晚宴", 
            url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop",
            comments: [{
                guestName: "王太",
                comment: "個場好靚呀！祝你哋幸福快樂！",
                timestamp: "2025-08-13T15:00:00",
                visible: true
            }],
            printRequests: []
        },
        {
            id: 4,
            category: "reception",
            title: "切蛋糕儀式",
            url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop", 
            thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop",
            comments: [],
            printRequests: []
        },
        {
            id: 5,
            category: "group",
            title: "兄弟姊妹大合照",
            url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=600&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=200&fit=crop", 
            comments: [],
            printRequests: []
        },
        {
            id: 6,
            category: "group",
            title: "家人親戚合照", 
            url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
            thumbnail: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=200&fit=crop",
            comments: [],
            printRequests: []
        }
    ];

    const printSizes = [
        { id: "4r", name: "4R相 (4x6吋)", price: "HK$8" },
        { id: "5r", name: "5R相 (5x7吋)", price: "HK$12" },
        { id: "8r", name: "8R相 (8x10吋)", price: "HK$25" },
        { id: "11r", name: "11R相 (11x14吋)", price: "HK$45" }
    ];

    let currentGuest = null;
    let currentPhoto = null;
    let currentCategory = 'all';

    // Show view function
    function showView(viewName) {
        console.log('Switching to view:', viewName);
        
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}Page`);
        if (targetView) {
            targetView.classList.add('active');
            
            if (viewName === 'gallery') {
                loadPhotos();
            } else if (viewName === 'admin') {
                loadAdminData();
            }
        }
    }

    // Guest login handler
    function handleGuestLogin(event) {
        event.preventDefault();
        console.log('Guest login form submitted');
        
        const guestNameInput = document.getElementById('guestName');
        const guestName = guestNameInput ? guestNameInput.value.trim() : '';
        
        console.log('Guest name entered:', guestName);
        
        if (guestName) {
            currentGuest = guestName;
            const currentGuestNameEl = document.getElementById('currentGuestName');
            if (currentGuestNameEl) {
                currentGuestNameEl.textContent = `歡迎，${guestName}`;
            }
            showView('gallery');
        } else {
            alert('請輸入你嘅名');
        }
    }

    // Admin login handler
    function handleAdminLogin(event) {
        event.preventDefault();
        
        const usernameInput = document.getElementById('adminUsername');
        const passwordInput = document.getElementById('adminPassword');
        
        const username = usernameInput ? usernameInput.value : '';
        const password = passwordInput ? passwordInput.value : '';
        
        if (username === 'admin' && password === 'password') {
            hideModal();
            showView('admin');
        } else {
            alert('用戶名或密碼錯咗');
        }
    }

    // Load photos function
    function loadPhotos() {
        const photoGrid = document.getElementById('photoGrid');
        if (!photoGrid) return;
        
        const filteredPhotos = currentCategory === 'all' 
            ? photos 
            : photos.filter(photo => photo.category === currentCategory);

        photoGrid.innerHTML = '';

        filteredPhotos.forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.innerHTML = `
                <img src="${photo.thumbnail}" alt="${photo.title}" loading="lazy">
                <div class="photo-card-info">
                    <h3 class="photo-card-title">${photo.title}</h3>
                    <div class="photo-stats">
                        <span>💬 ${photo.comments.filter(c => c.visible !== false).length}</span>
                        <span>📷 ${photo.printRequests.length}</span>
                    </div>
                </div>
            `;
            
            photoCard.addEventListener('click', () => {
                openPhoto(photo.id);
            });

            photoGrid.appendChild(photoCard);
        });
    }

    // Open photo modal
    function openPhoto(photoId) {
        const photo = photos.find(p => p.id === photoId);
        if (!photo) return;

        currentPhoto = photo;
        
        const modalPhoto = document.getElementById('modalPhoto');
        const modalPhotoTitle = document.getElementById('modalPhotoTitle');
        
        if (modalPhoto) modalPhoto.src = photo.url;
        if (modalPhotoTitle) modalPhotoTitle.textContent = photo.title;
        
        loadPhotoComments(photo);
        showModal('photoModal');
    }

    // Load photo comments
    function loadPhotoComments(photo) {
        const commentsSection = document.getElementById('photoComments');
        if (!commentsSection) return;
        
        const visibleComments = photo.comments.filter(c => c.visible !== false);
        
        if (visibleComments.length === 0) {
            commentsSection.innerHTML = '<p class="empty-state">暫時無留言，快啲留個祝福啦！</p>';
            return;
        }

        commentsSection.innerHTML = visibleComments.map(comment => `
            <div class="comment">
                <div class="comment-author">${comment.guestName}</div>
                <div class="comment-text">${comment.comment}</div>
                <div class="comment-time">${formatDate(comment.timestamp)}</div>
            </div>
        `).join('');
    }

    // Handle comment submission
    function handleCommentSubmit(event) {
        event.preventDefault();
        
        const commentTextEl = document.getElementById('commentText');
        const commentText = commentTextEl ? commentTextEl.value.trim() : '';
        
        if (!commentText || !currentGuest || !currentPhoto) {
            alert('請寫低你嘅祝福先');
            return;
        }

        const newComment = {
            guestName: currentGuest,
            comment: commentText,
            timestamp: new Date().toISOString(),
            visible: true
        };

        currentPhoto.comments.push(newComment);
        loadPhotoComments(currentPhoto);
        loadPhotos();
        
        if (commentTextEl) commentTextEl.value = '';
        hideModal();
        
        showSuccessMessage('留言已經send咗！');
    }

    // Handle print submission
    function handlePrintSubmit(event) {
        event.preventDefault();
        
        const sizeEl = document.getElementById('printSize');
        const quantityEl = document.getElementById('printQuantity');
        const phoneEl = document.getElementById('printPhone');
        const notesEl = document.getElementById('printNotes');
        
        const formData = {
            size: sizeEl ? sizeEl.value : '',
            quantity: quantityEl ? parseInt(quantityEl.value) : 0,
            phone: phoneEl ? phoneEl.value : '',
            notes: notesEl ? notesEl.value : '',
            guestName: currentGuest,
            timestamp: new Date().toISOString()
        };

        if (!formData.size || !formData.quantity || !formData.phone || !currentPhoto) {
            alert('請填晒所有必填欄位');
            return;
        }

        currentPhoto.printRequests.push(formData);
        loadPhotos();
        
        const printForm = document.getElementById('printForm');
        if (printForm) printForm.reset();
        if (quantityEl) quantityEl.value = 1;
        
        hideModal();
        showSuccessMessage('沖曬申請已經遞交！我哋會盡快WhatsApp你！');
    }

    // Modal functions
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function hideModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Load admin data
    function loadAdminData() {
        loadPrintRequests();
        loadComments();
    }

    function loadPrintRequests() {
        const container = document.getElementById('printRequestsList');
        if (!container) return;
        
        const allRequests = [];

        photos.forEach(photo => {
            photo.printRequests.forEach(request => {
                allRequests.push({
                    ...request,
                    photoTitle: photo.title,
                    photoId: photo.id
                });
            });
        });

        if (allRequests.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>暫時無沖曬申請</h3><p>等賓客申請沖曬相片啦</p></div>';
            return;
        }

        container.innerHTML = allRequests.map((request, index) => {
            const sizeInfo = printSizes.find(s => s.id === request.size);
            return `
                <div class="request-item">
                    <div class="request-header">
                        <h4 class="request-title">${request.photoTitle}</h4>
                        <span class="status status--info">待處理</span>
                    </div>
                    <div class="request-details">
                        <p><strong>賓客：</strong>${request.guestName}</p>
                        <p><strong>尺寸：</strong>${sizeInfo ? sizeInfo.name + ' ' + sizeInfo.price : request.size}</p>
                        <p><strong>數量：</strong>${request.quantity} 張</p>
                        <p><strong>聯絡：</strong>${request.phone}</p>
                        ${request.notes ? `<p><strong>備註：</strong>${request.notes}</p>` : ''}
                        <p><strong>申請時間：</strong>${formatDate(request.timestamp)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    function loadComments() {
        const container = document.getElementById('commentsList');
        if (!container) return;
        
        const allComments = [];

        photos.forEach(photo => {
            photo.comments.forEach((comment, index) => {
                allComments.push({
                    ...comment,
                    photoTitle: photo.title,
                    photoId: photo.id,
                    commentIndex: index
                });
            });
        });

        if (allComments.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>暫時無留言</h3><p>等賓客留言啦</p></div>';
            return;
        }

        container.innerHTML = allComments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <h4 class="comment-title">${comment.photoTitle}</h4>
                    <span class="status ${comment.visible !== false ? 'status--success' : 'status--warning'}">
                        ${comment.visible !== false ? '顯示中' : '已隱藏'}
                    </span>
                </div>
                <div class="comment-details">
                    <p><strong>賓客：</strong>${comment.guestName}</p>
                    <p><strong>留言：</strong>"${comment.comment}"</p>
                    <p><strong>時間：</strong>${formatDate(comment.timestamp)}</p>
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('zh-HK', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // Navigation functions
    function navigatePhoto(direction) {
        if (!currentPhoto) return;
        
        const filteredPhotos = currentCategory === 'all' 
            ? photos 
            : photos.filter(photo => photo.category === currentCategory);

        let currentIndex = filteredPhotos.findIndex(photo => photo.id === currentPhoto.id);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = filteredPhotos.length - 1;
        if (newIndex >= filteredPhotos.length) newIndex = 0;

        const newPhoto = filteredPhotos[newIndex];
        currentPhoto = newPhoto;
        
        const modalPhoto = document.getElementById('modalPhoto');
        const modalPhotoTitle = document.getElementById('modalPhotoTitle');
        
        if (modalPhoto) modalPhoto.src = newPhoto.url;
        if (modalPhotoTitle) modalPhotoTitle.textContent = newPhoto.title;
        
        loadPhotoComments(newPhoto);
    }

    function switchCategory(category) {
        currentCategory = category;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        loadPhotos();
    }

    function switchAdminTab(tab) {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tab}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (tab === 'prints') {
            loadPrintRequests();
        } else if (tab === 'comments') {
            loadComments();
        }
    }

    function logout() {
        currentGuest = null;
        showView('landing');
        
        const guestNameInput = document.getElementById('guestName');
        const adminUsernameInput = document.getElementById('adminUsername');
        const adminPasswordInput = document.getElementById('adminPassword');
        
        if (guestNameInput) guestNameInput.value = '';
        if (adminUsernameInput) adminUsernameInput.value = '';
        if (adminPasswordInput) adminPasswordInput.value = '';
    }

    // Event binding
    console.log('Binding events...');

    // Guest login form
    const guestLoginForm = document.getElementById('guestLoginForm');
    if (guestLoginForm) {
        guestLoginForm.addEventListener('submit', handleGuestLogin);
        console.log('Guest login form bound');
    }

    // Admin login button
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('adminLoginModal');
        });
        console.log('Admin login button bound');
    }

    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }

    // Print form
    const printForm = document.getElementById('printForm');
    if (printForm) {
        printForm.addEventListener('submit', handlePrintSubmit);
    }

    // Logout buttons
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', logout);
    }

    // Category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchCategory(e.target.dataset.category);
        });
    });

    // Admin tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchAdminTab(e.target.dataset.tab);
        });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal();
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal();
        });
    });

    // Photo navigation
    const prevPhoto = document.getElementById('prevPhoto');
    const nextPhoto = document.getElementById('nextPhoto');
    if (prevPhoto) {
        prevPhoto.addEventListener('click', () => {
            navigatePhoto(-1);
        });
    }
    if (nextPhoto) {
        nextPhoto.addEventListener('click', () => {
            navigatePhoto(1);
        });
    }

    // Comment and print buttons
    const commentBtn = document.getElementById('commentBtn');
    const printBtn = document.getElementById('printBtn');
    if (commentBtn) {
        commentBtn.addEventListener('click', () => {
            showModal('commentModal');
        });
    }
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            showModal('printModal');
        });
    }

    // Cancel buttons
    const cancelComment = document.getElementById('cancelComment');
    const cancelPrint = document.getElementById('cancelPrint');
    const cancelAdminLogin = document.getElementById('cancelAdminLogin');
    
    if (cancelComment) {
        cancelComment.addEventListener('click', hideModal);
    }
    if (cancelPrint) {
        cancelPrint.addEventListener('click', hideModal);
    }
    if (cancelAdminLogin) {
        cancelAdminLogin.addEventListener('click', hideModal);
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const photoModal = document.getElementById('photoModal');
        if (photoModal && !photoModal.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') navigatePhoto(-1);
            if (e.key === 'ArrowRight') navigatePhoto(1);
            if (e.key === 'Escape') hideModal();
        }
    });

    console.log('App initialization complete!');
    
    // Store globally for access
    window.appFunctions = {
        showView,
        showModal,
        hideModal,
        switchCategory,
        switchAdminTab,
        navigatePhoto,
        openPhoto,
        logout
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}