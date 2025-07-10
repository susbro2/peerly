class BookingCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.bookedSlots = new Set(); // In real app, this would come from backend
        this.availableSlots = [
            '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav-btn" onclick="calendar.previousMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 class="calendar-month">${this.getMonthYear()}</h3>
                <button class="calendar-nav-btn" onclick="calendar.nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid">
                ${this.renderCalendarDays()}
            </div>
            <div class="time-slots-container">
                <h4>Available Times</h4>
                <div class="time-slots">
                    ${this.renderTimeSlots()}
                </div>
            </div>
            <button class="book-session-btn" onclick="calendar.bookSession()" ${!this.selectedDate || !this.selectedTime ? 'disabled' : ''}>
                Book Session
            </button>
        `;
    }
    
    getMonthYear() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
    
    renderCalendarDays() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let html = '';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Day headers
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = this.isToday(date);
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isSelected = this.selectedDate && this.isSameDate(date, this.selectedDate);
            
            let classes = 'calendar-day';
            if (!isCurrentMonth) classes += ' other-month';
            if (isToday) classes += ' today';
            if (isPast) classes += ' past';
            if (isSelected) classes += ' selected';
            
            html += `
                <div class="${classes}" onclick="calendar.selectDate('${date.toISOString()}')">
                    ${date.getDate()}
                </div>
            `;
        }
        
        return html;
    }
    
    renderTimeSlots() {
        if (!this.selectedDate) {
            return '<p class="no-date-selected">Please select a date first</p>';
        }
        
        return this.availableSlots.map(time => {
            const slotKey = `${this.selectedDate.toDateString()}-${time}`;
            const isBooked = this.bookedSlots.has(slotKey);
            const isSelected = this.selectedTime === time;
            
            let classes = 'time-slot';
            if (isBooked) classes += ' booked';
            if (isSelected) classes += ' selected';
            
            return `
                <button class="${classes}" 
                        onclick="calendar.selectTime('${time}')"
                        ${isBooked ? 'disabled' : ''}>
                    ${time}
                </button>
            `;
        }).join('');
    }
    
    selectDate(dateString) {
        const date = new Date(dateString);
        if (date < new Date().setHours(0, 0, 0, 0)) return; // Can't select past dates
        
        this.selectedDate = date;
        this.selectedTime = null; // Reset time selection
        this.render();
    }
    
    selectTime(time) {
        const slotKey = `${this.selectedDate.toDateString()}-${time}`;
        if (this.bookedSlots.has(slotKey)) return;
        
        this.selectedTime = time;
        this.render();
    }
    
    bookSession() {
        if (!this.selectedDate || !this.selectedTime) return;
        
        const slotKey = `${this.selectedDate.toDateString()}-${this.selectedTime}`;
        this.bookedSlots.add(slotKey);
        
        // Show confirmation modal
        this.showBookingConfirmation();
        
        // Reset selections
        this.selectedDate = null;
        this.selectedTime = null;
        this.render();
    }
    
    showBookingConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Session Booked!</h3>
                <p>Your session has been scheduled for ${this.selectedDate.toLocaleDateString()} at ${this.selectedTime}</p>
                <div class="modal-actions">
                    <button class="confirm" onclick="this.closest('.booking-modal').remove()">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 3000);
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }
    
    isToday(date) {
        const today = new Date();
        return this.isSameDate(date, today);
    }
    
    isSameDate(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }
}