const RESET = "\x1b[0m";
const FG_CYAN = "\x1b[36m";
const FG_YELLOW = "\x1b[33m";

class Process {
    constructor(number, allocated, request = []) {
        this.number = number;
        this.allocated = allocated;
        this.request = request;
        this.finished = false;
    }
}

const deadlock_detection = (processes, total_resources, available = []) => {
    console.log(FG_CYAN + "Đề bài: " + RESET);
    console.table(processes, ["number", "allocated", "request"]);

    if (available.length === 0) {
        // Chưa có available, cần tính
        available = total_resources.map((total, index) => total - processes.reduce((sum, process) => sum + process.allocated[index], 0));
    }
    console.log(FG_CYAN + "Available: " + RESET + available);

    // Set finished = true cho các process có allocated = 0
    processes.forEach(process => {
        if (process.allocated.every(allocated => allocated === 0)) {
            process.finished = true;
        }
    });

    const N = processes.length;
    const chuoi_an_toan = [];
    let work = available;

    // Nếu còn process chưa hoàn thành
    while (processes.some(process => !process.finished)) {
        let found = false;
        for (let i = 0; i < N; i++) {
            // Thỏa mãn finish = false và request <= work
            if (!processes[i].finished && processes[i].request.every((request, index) => request <= work[index])) {
                found = true;
                work = work.map((w, index) => w + processes[i].allocated[index]);
                processes[i].finished = true;
                console.log(FG_YELLOW + "Tiến trình " + processes[i].number + " hoàn thành. Work = " + work + RESET);
                chuoi_an_toan.push(processes[i].number);
                break;
            }
        }

        if (!found) {
            console.log(FG_CYAN + "Không chọn được Process tiếp theo." + RESET);
            console.log(FG_CYAN + `Hệ thống có bế tắc và bế tắc liên quan đến ${processes.filter(p => !p.finished).map(p => `P${p.number}`)}` + RESET);
            return;
        }
    }

    console.log(FG_CYAN + "Hệ thống không bế tắc. Chuỗi: " + chuoi_an_toan + RESET);
}

const init = () => {
    const numbers = [0, 1, 2, 3, 4];
    const allocateds = [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1], [0, 0, 2]];
    const requests = [[0, 0, 0], [2, 0, 2], [0, 0, 1], [1, 0, 0], [0, 0, 2]];

    const total_resources = [];

    // Nếu đề bài cho sẵn available (Chỉnh total_resources = [])
    const available = [0, 0, 0];

    const processes = [];
    for (let i = 0; i < numbers.length; i++) {
        processes.push(new Process(numbers[i], allocateds[i], requests[i]));
    }

    deadlock_detection(processes, total_resources, available);
}

init()