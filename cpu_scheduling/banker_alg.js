const RESET = "\x1b[0m";
const FG_CYAN = "\x1b[36m";
const FG_YELLOW = "\x1b[33m";

class Process {
    constructor(number, allocated, max, need = []) {
        this.number = number;
        this.allocated = allocated;
        this.max = max;
        this.need = need;
        this.finished = false;
    }
}

const banker_alg = (processes, total_resources, available = []) => {
    let hasMax = false;
    if (!processes.every(process => process.need.length > 0)) {
        hasMax = true;
        // Chưa có need, cần tính
        for (let i = 0; i < processes.length; i++) {
            processes[i].need = processes[i].max.map((max, index) => max - processes[i].allocated[index]);
        }
    }

    console.log(FG_CYAN + "Đề bài: " + RESET);
    console.table(processes, ["number", "allocated", hasMax ? "max" : "", "need"]);

    if (available.length === 0) {
        // Chưa có available, cần tính
        available = total_resources.map((total, index) => total - processes.reduce((sum, process) => sum + process.allocated[index], 0));
    }
    console.log(FG_CYAN + "Available: " + RESET + available);

    const N = processes.length;
    const chuoi_an_toan = [];
    let work = available;


    // Nếu còn process chưa hoàn thành
    while (processes.some(process => !process.finished)) {
        let found = false;
        for (let i = 0; i < N; i++) {
            // Thỏa mãn finish = false và need <= work
            if (!processes[i].finished && processes[i].need.every((need, index) => need <= work[index])) {
                found = true;
                work = work.map((w, index) => w + processes[i].allocated[index]);
                processes[i].finished = true;
                console.log(FG_YELLOW + "Tiến trình " + processes[i].number + " hoàn thành. Work = " + work + RESET);
                chuoi_an_toan.push(processes[i].number);
                break;
            }
        }

        if (!found) {
            console.log(FG_CYAN + "Không tìm thấy tiến trình nào để thực hiện. Hệ thống không an toàn." + RESET);
            return;
        }
    }

    console.log(FG_CYAN + "Hệ thống an toàn. Chuỗi an toàn: " + chuoi_an_toan + RESET);
}

const init = () => {
    const numbers = [0, 1, 2, 3, 4];
    const allocateds = [[0, 3, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
    const maxes = [];
    const total_resources = [];

    // Nếu đề bài cho sẵn need (Chỉnh maxes = [])
    const needs = [[7, 2, 3], [1, 2, 2], [6, 0, 0], [0, 1, 1], [4, 3, 1]];

    // Nếu đề bài cho sẵn available (Chỉnh total_resources = [])
    const available = [3, 1, 2];

    const processes = [];
    for (let i = 0; i < numbers.length; i++) {
        processes.push(new Process(numbers[i], allocateds[i], maxes[i], needs[i]));
    }

    banker_alg(processes, total_resources, available);
}

init();