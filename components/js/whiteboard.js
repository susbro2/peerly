class Whiteboard {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.currentSize = 2;
        this.history = [];
        this.historyStep = -1;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.saveState();
    }
    
    setupCanvas() {
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Set default styles
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        // Fill with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        
        if (this.currentTool === 'pen') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = this.currentColor;
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
        }
        
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveState();
        }
    }
    
    setTool(tool) {
        this.currentTool = tool;
    }
    
    setColor(color) {
        this.currentColor = color;
    }
    
    setSize(size) {
        this.currentSize = size;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveState();
    }
    
    saveState() {
        this.historyStep++;
        if (this.historyStep < this.history.length) {
            this.history.length = this.historyStep;
        }
        this.history.push(this.canvas.toDataURL());
    }
    
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState();
        }
    }
    
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.restoreState();
        }
    }
    
    restoreState() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = this.history[this.historyStep];
    }
    
    downloadImage() {
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}