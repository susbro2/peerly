class ResourceLibrary {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.searchQuery = '';
        
        // Sample resource data - in real app, this would come from backend
        this.resources = [
            {
                id: 1,
                title: "Calculus Fundamentals Guide",
                type: "pdf",
                subject: "mathematics",
                description: "Comprehensive guide covering limits, derivatives, and integrals",
                author: "Dr. Sarah Johnson",
                uploadDate: "2024-01-15",
                downloads: 245,
                rating: 4.8,
                size: "2.3 MB",
                thumbnail: "https://i.imgur.com/placeholder1.jpg"
            },
            {
                id: 2,
                title: "Physics Lab Experiments",
                type: "video",
                subject: "physics",
                description: "Step-by-step video demonstrations of common physics experiments",
                author: "Prof. Michael Chen",
                uploadDate: "2024-01-10",
                downloads: 189,
                rating: 4.6,
                size: "45 MB",
                thumbnail: "https://i.imgur.com/placeholder2.jpg"
            },
            {
                id: 3,
                title: "Chemistry Periodic Table Interactive",
                type: "interactive",
                subject: "chemistry",
                description: "Interactive periodic table with element properties and examples",
                author: "Dr. Emily Rodriguez",
                uploadDate: "2024-01-08",
                downloads: 312,
                rating: 4.9,
                size: "1.1 MB",
                thumbnail: "https://i.imgur.com/placeholder3.jpg"
            },
            {
                id: 4,
                title: "Programming Basics Presentation",
                type: "presentation",
                subject: "programming",
                description: "Introduction to programming concepts and best practices",
                author: "Alex Thompson",
                uploadDate: "2024-01-05",
                downloads: 156,
                rating: 4.4,
                size: "5.7 MB",
                thumbnail: "https://i.imgur.com/placeholder4.jpg"
            },
            {
                id: 5,
                title: "Statistics Cheat Sheet",
                type: "pdf",
                subject: "mathematics",
                description: "Quick reference for statistical formulas and concepts",
                author: "Dr. Lisa Wang",
                uploadDate: "2024-01-03",
                downloads: 278,
                rating: 4.7,
                size: "0.8 MB",
                thumbnail: "https://i.imgur.com/placeholder5.jpg"
            }
        ];
        
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="resource-library-header">
                <h1>Resource Library</h1>
                <p>Discover and share educational resources with the community</p>
            </div>
            
            <div class="resource-controls">
                <div class="search-section">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search resources..." value="${this.searchQuery}" 
                               onkeyup="resourceLibrary.handleSearch(this.value)">
                    </div>
                    <button class="upload-btn" onclick="resourceLibrary.showUploadModal()">
                        <i class="fas fa-plus"></i> Upload Resource
                    </button>
                </div>
                
                <div class="filter-section">
                    <div class="filter-group">
                        <label>Filter by type:</label>
                        <select onchange="resourceLibrary.setFilter(this.value)">
                            <option value="all">All Types</option>
                            <option value="pdf">PDF Documents</option>
                            <option value="video">Videos</option>
                            <option value="presentation">Presentations</option>
                            <option value="interactive">Interactive</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Sort by:</label>
                        <select onchange="resourceLibrary.setSort(this.value)">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="popular">Most Downloaded</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="resources-grid">
                ${this.renderResources()}
            </div>
        `;
    }
    
    renderResources() {
        let filteredResources = this.getFilteredResources();
        
        if (filteredResources.length === 0) {
            return `
                <div class="no-resources">
                    <i class="fas fa-folder-open"></i>
                    <h3>No resources found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
        }
        
        return filteredResources.map(resource => `
            <div class="resource-card" data-id="${resource.id}">
                <div class="resource-thumbnail">
                    <img src="${resource.thumbnail}" alt="${resource.title}">
                    <div class="resource-type">
                        <i class="fas ${this.getTypeIcon(resource.type)}"></i>
                    </div>
                </div>
                
                <div class="resource-content">
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    
                    <div class="resource-meta">
                        <div class="resource-author">
                            <i class="fas fa-user"></i>
                            <span>${resource.author}</span>
                        </div>
                        <div class="resource-date">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(resource.uploadDate)}</span>
                        </div>
                    </div>
                    
                    <div class="resource-stats">
                        <div class="stat">
                            <i class="fas fa-download"></i>
                            <span>${resource.downloads}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>${resource.rating}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-file"></i>
                            <span>${resource.size}</span>
                        </div>
                    </div>
                    
                    <div class="resource-actions">
                        <button class="action-btn primary" onclick="resourceLibrary.downloadResource(${resource.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="action-btn" onclick="resourceLibrary.previewResource(${resource.id})">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="action-btn" onclick="resourceLibrary.shareResource(${resource.id})">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getFilteredResources() {
        let filtered = this.resources;
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(resource => 
                resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                resource.author.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
        
        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(resource => resource.type === this.currentFilter);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.uploadDate) - new Date(a.uploadDate);
                case 'oldest':
                    return new Date(a.uploadDate) - new Date(b.uploadDate);
                case 'popular':
                    return b.downloads - a.downloads;
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });
        
        return filtered;
    }
    
    getTypeIcon(type) {
        const icons = {
            pdf: 'fa-file-pdf',
            video: 'fa-video',
            presentation: 'fa-file-powerpoint',
            interactive: 'fa-mouse-pointer'
        };
        return icons[type] || 'fa-file';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    handleSearch(query) {
        this.searchQuery = query;
        this.render();
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }
    
    setSort(sort) {
        this.currentSort = sort;
        this.render();
    }
    
    downloadResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            // Increment download count
            resource.downloads++;
            
            // In a real app, this would trigger an actual download
            alert(`Downloading: ${resource.title}`);
            
            // Update the display
            this.render();
        }
    }
    
    previewResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            this.showPreviewModal(resource);
        }
    }
    
    shareResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            // In a real app, this would generate a shareable link
            const shareUrl = `${window.location.origin}/resource/${id}`;
            
            if (navigator.share) {
                navigator.share({
                    title: resource.title,
                    text: resource.description,
                    url: shareUrl
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('Share link copied to clipboard!');
                });
            }
        }
    }
    
    showPreviewModal(resource) {
        const modal = document.createElement('div');
        modal.className = 'resource-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${resource.title}</h3>
                    <button class="close-modal" onclick="this.closest('.resource-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="preview-area">
                        ${this.getPreviewContent(resource)}
                    </div>
                    <div class="resource-details">
                        <p><strong>Author:</strong> ${resource.author}</p>
                        <p><strong>Type:</strong> ${resource.type.toUpperCase()}</p>
                        <p><strong>Size:</strong> ${resource.size}</p>
                        <p><strong>Rating:</strong> ${resource.rating}/5</p>
                        <p><strong>Downloads:</strong> ${resource.downloads}</p>
                        <p><strong>Description:</strong> ${resource.description}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="action-btn primary" onclick="resourceLibrary.downloadResource(${resource.id}); this.closest('.resource-modal').remove();">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="action-btn" onclick="this.closest('.resource-modal').remove()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    getPreviewContent(resource) {
        switch (resource.type) {
            case 'video':
                return `<div class="video-preview">
                    <i class="fas fa-play-circle"></i>
                    <p>Video Preview</p>
                </div>`;
            case 'pdf':
                return `<div class="pdf-preview">
                    <i class="fas fa-file-pdf"></i>
                    <p>PDF Document</p>
                </div>`;
            case 'presentation':
                return `<div class="presentation-preview">
                    <i class="fas fa-file-powerpoint"></i>
                    <p>Presentation Slides</p>
                </div>`;
            default:
                return `<div class="generic-preview">
                    <i class="fas fa-file"></i>
                    <p>File Preview</p>
                </div>`;
        }
    }
    
    showUploadModal() {
        const modal = document.createElement('div');
        modal.className = 'resource-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Upload Resource</h3>
                    <button class="close-modal" onclick="this.closest('.resource-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form class="upload-form" onsubmit="resourceLibrary.handleUpload(event)">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Subject</label>
                        <select name="subject" required>
                            <option value="">Select Subject</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="programming">Programming</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>File</label>
                        <input type="file" name="file" required accept=".pdf,.ppt,.pptx,.mp4,.mov,.avi">
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="action-btn primary">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                        <button type="button" class="action-btn" onclick="this.closest('.resource-modal').remove()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    handleUpload(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        // In a real app, this would upload to the server
        const newResource = {
            id: this.resources.length + 1,
            title: formData.get('title'),
            description: formData.get('description'),
            subject: formData.get('subject'),
            type: this.getFileType(formData.get('file').name),
            author: 'You',
            uploadDate: new Date().toISOString().split('T')[0],
            downloads: 0,
            rating: 0,
            size: this.formatFileSize(formData.get('file').size),
            thumbnail: "https://i.imgur.com/placeholder6.jpg"
        };
        
        this.resources.unshift(newResource);
        this.render();
        
        // Close modal
        event.target.closest('.resource-modal').remove();
        
        alert('Resource uploaded successfully!');
    }
    
    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'pdf',
            'ppt': 'presentation',
            'pptx': 'presentation',
            'mp4': 'video',
            'mov': 'video',
            'avi': 'video'
        };
        return typeMap[extension] || 'other';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}