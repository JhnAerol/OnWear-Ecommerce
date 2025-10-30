function showToast(title, message) {
      const container = document.getElementById('toastContainer');
      
      const toast = document.createElement('div');
      toast.className = `toast`;
      toast.innerHTML = `
        <div class="toast-header">
          <strong class="toast-title">${title}</strong>
          <button class="toast-close" onclick="closeToast(this)">&times;</button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
        <div class="toast-progress"></div>
      `;

      container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 10);

      setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));

        
      }, 5000);

      
    }

    function closeToast(button) {
      const toast = button.closest('.toast');
      toast.classList.remove('show');
      toast.classList.add('hide');
      
      setTimeout(() => {
        toast.remove();
      }, 400);
    }