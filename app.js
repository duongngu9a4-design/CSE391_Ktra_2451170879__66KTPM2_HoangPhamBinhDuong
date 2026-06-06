let tasks = [];

// Khai báo các thành phần DOM
const taskList = document.getElementById('taskList'); 
const taskInput = document.getElementById('taskInput');
const btnSave = document.getElementById('btnSave');

// Tạo hoặc lấy vùng hiển thị thông báo lỗi (invalid-feedback) dưới ô nhập liệu
let feedbackEl = document.getElementById('taskInputFeedback');
if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.id = 'taskInputFeedback';
    feedbackEl.className = 'invalid-feedback';
    taskInput.parentNode.insertBefore(feedbackEl, taskInput.nextSibling);
}

// HÀM TỰ ĐỘNG NẠP DỮ LIỆU TỪ JSON VÀO HTML
async function loadTasks() {
    try {
        const response = await fetch('data.json'); 
        
        if (!response.ok) {
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }
        
        tasks = await response.json(); // Nạp dữ liệu vào mảng ngầm
        console.log("Dữ liệu nạp từ JSON thành công:", tasks); 
        
        // --- ĐOẠN TỰ ĐỘNG ĐẨY DỮ LIỆU VÀO HTML ---
        if (taskList) {
            taskList.innerHTML = ''; // Xóa sạch các thẻ cũ
            
            tasks.forEach(task => {
                let badgeClass = 'bg-success';
                if (task.priority === 'high') badgeClass = 'bg-danger';
                if (task.priority === 'medium') badgeClass = 'bg-warning text-dark';

                // Tự động chèn từng task từ JSON vào giao diện
                taskList.innerHTML += `
                    <div class="card-body bg-white p-3 rounded shadow-sm">
                        <div class="row row-cols-4 align-items-center">
                            <div class="col-5">
                                <small class="text-muted d-block">task</small>
                                <p class="m-0 fw-semibold">${task.task_name}</p>
                            </div>
                            <div class="col-3">
                                <small class="text-muted d-block">priority</small>
                                <span class="badge ${badgeClass}">${task.priority}</span>
                            </div>
                            <div class="col-4 text-end">
                                <button class="btn btn-sm btn-outline-success me-1">sửa</button>
                                <button class="btn btn-sm btn-outline-danger">xóa</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        // ----------------------------------------
        
    } catch (error) {
        console.error('Lỗi nạp dữ liệu JSON:', error);
        if (taskList) {
            taskList.innerHTML = `<div class="text-center text-danger py-4">Lỗi không nạp được file data.json!</div>`;
        }
    }
}
 
// Lắng nghe sự kiện click nút bấm lưu dữ liệu trên FORM 
btnSave.addEventListener('click', function(event) {
    const nameValue = taskInput.value.trim();

    if (nameValue === "") {
        taskInput.classList.add('is-invalid'); 
        feedbackEl.innerText = 'Vui lòng nhập tên task, không được để trống!'; 
        return; 
    } 
    else if (nameValue.length > 100) {
        taskInput.classList.add('is-invalid'); 
        feedbackEl.innerText = `Tên task không được vượt quá 100 kí tự! (Hiện tại bạn đã nhập: ${nameValue.length} kí tự)`; 
        return; 
    } 
    else {
        taskInput.classList.remove('is-invalid'); 
        taskInput.classList.add('is-valid');    
    }

    console.log("Dữ liệu hợp lệ, tiến hành thêm/sửa task: ", nameValue);
});

// Chạy hàm nạp dữ liệu từ file JSON ngay khi trình duyệt tải trang xong
loadTasks();