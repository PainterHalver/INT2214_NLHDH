const RESET = "\x1b[0m";
const FG_CYAN = "\x1b[36m";
const FG_YELLOW = "\x1b[33m";

class Process {
    constructor(number, tg_chay, tg_den) {
        this.number = number;
        this.tg_chay = tg_chay;
        this.tg_den = tg_den;
        this.tg_cho = 0;
        this.tg_phanhoi = -1;
        this.tg_hoanthanh = -1;
    }
}

const round_robin = (processes, time_quantum) => {
    console.log(FG_CYAN + "Đề bài: " + RESET);
    console.table(processes, ["number", "tg_chay", "tg_den"]);

    processes.sort((a, b) => a.tg_den - b.tg_den);

    let current_time = 0, sum_tg_cho = 0, sum_tg_phanhoi = 0, sum_tg_hoanthanh = 0;
    const N = processes.length;
    const data_table = [];
    const run_table = [{ "Thời điểm": "------", "Tiến trình đang chạy": "------" }];

    let current_process;
    let time_quantum_remaining = time_quantum;
    let queue = [];
    while (processes.length > 0) {
        // Get first process in the queue if there is no process being executed
        if (time_quantum_remaining === time_quantum && queue.length > 0) {
            current_process = queue.shift();
        }

        // If there is no process to execute, skip to the next process
        if (!current_process) {
            queue.push(processes[0]);
            for (let i = current_time; i < processes[0].tg_den; i++) {
                run_table.push({ "Thời điểm": i, "Tiến trình đang chạy": -1 });
            }
            if (run_table[run_table.length - 1] && run_table[run_table.length - 1]["Thời điểm"] !== "------") {
                run_table.push({ "Thời điểm": "------", "Tiến trình đang chạy": "------" });
            }

            current_time = processes[0].tg_den;
            continue;
        }

        for (let i = 0; i < processes.length; i++) {
            // current_time + 1 để cho process sắp vào queue thì vào trước
            // rồi ở dưới nếu hết quantum mà current_process chưa chạy xong
            // thì sẽ push vào queue mới đúng thứ tự
            // TH đặc biệt có nhiều process cùng tg_den = 0
            if ((processes[i].tg_den === current_time + 1 || (processes[i].tg_den === 0 && !queue.includes(processes[i]))) && processes[i] !== current_process) {
                queue.push(processes[i]);
            }
        }


        // Sau 3 cái check trên thì chắc (chắn??) là đã chọn được process để chạy

        // Decrease the remaining time by 1
        current_process.tg_chay--;

        // Decrease the time quantum by 1
        time_quantum_remaining--;

        // If there are other processes in the queue, increase the waiting time of the other processes
        for (let i = 0; i < processes.length; i++) {
            if (processes[i] !== current_process && processes[i].tg_den <= current_time) {
                processes[i].tg_cho++;
            }
        }

        // Calculate the response time when the process is executed for the first time
        if (current_process.tg_phanhoi === -1) {
            current_process.tg_phanhoi = current_time - current_process.tg_den;
            sum_tg_phanhoi += current_process.tg_phanhoi;
        }

        // Add the current process to the run table
        run_table.push({ "Thời điểm": current_time, "Tiến trình đang chạy": current_process.number });

        // If time quantum is 0
        if (time_quantum_remaining === 0) {
            // If the process is not finished, add it to the queue
            if (current_process.tg_chay > 0) {
                queue.push(current_process);
            }

            if (run_table[run_table.length - 1] && run_table[run_table.length - 1]["Thời điểm"] !== "------") {
                run_table.push({ "Thời điểm": "------", "Tiến trình đang chạy": "------" });
            }

            // Reset the time quantum
            time_quantum_remaining = time_quantum;
        }

        // If the process is finished, set the finish time
        if (current_process.tg_chay === 0) {
            current_process.tg_hoanthanh = current_time - current_process.tg_den + 1;
            sum_tg_cho += current_process.tg_cho;
            sum_tg_hoanthanh += current_process.tg_hoanthanh;
            data_table.push(current_process);

            if (run_table[run_table.length - 1] && run_table[run_table.length - 1]["Thời điểm"] !== "------") {
                run_table.push({ "Thời điểm": "------", "Tiến trình đang chạy": "------" });
            }

            processes.splice(processes.indexOf(current_process), 1);
            current_process = null;

            // Reset the time quantum
            time_quantum_remaining = time_quantum;
        }

        // Increase the current time by 1
        current_time++;
    }

    console.log(FG_CYAN + "Biểu đồ Gantt (nhưng theo chiều dọc): " + RESET);
    console.table(run_table)

    console.log(FG_CYAN + "Kết quả: " + RESET);
    console.table(data_table.sort((a, b) => (a.number - b.number)), ["number", "tg_cho", "tg_phanhoi", "tg_hoanthanh"]);

    console.log(FG_CYAN + `Thời gian chờ trung bình = ${sum_tg_cho} / ${N} = ` + sum_tg_cho / N + RESET);
    console.log(FG_CYAN + `Thời gian phản hồi trung bình = ${sum_tg_phanhoi} / ${N} = ` + sum_tg_phanhoi / N + RESET);
    console.log(FG_CYAN + `Thời gian hoàn thành trung bình = ${sum_tg_hoanthanh} / ${N} = ` + sum_tg_hoanthanh / N + RESET);
}


const init = () => {
    const time_quantum = 2;

    const numbers = [1, 2, 3, 4, 5];
    const tg_den = [0, 1, 3, 4, 5];
    const tg_chay = [2, 1, 8, 4, 5];

    const processes = [];
    for (let i = 0; i < numbers.length; i++) {
        processes.push(new Process(numbers[i], tg_chay[i], tg_den[i]));
    }

    round_robin(processes, time_quantum);
}

init()

// Burst time: Thời gian chạy
// Arrival time: Thời gian đến
// Waiting time: Thời gian chờ
// Turn around time: Thời gian hoàn thành
// Response time: Thời gian phản hồi