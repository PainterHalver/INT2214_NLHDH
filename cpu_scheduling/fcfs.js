const RESET = "\x1b[0m";
const FG_CYAN = "\x1b[36m";
const FG_YELLOW = "\x1b[33m";

class Process {
    constructor(number, tg_chay, tg_den) {
        this.number = number;
        this.tg_chay = tg_chay;
        this.tg_den = tg_den;
    }
}

const fcfs = (processes) => {
    console.log(FG_CYAN + "Đề bài: " + RESET);
    console.table(processes);

    processes.sort((a, b) => a.tg_den - b.tg_den);

    let current_time = 0, sum_tg_cho = 0, sum_tg_hoanthanh = 0;
    const data_table = [];
    const run_table = [{ "Thời điểm": "------", "Tiến trình đang chạy": "------" }];

    for (let i = 0; i < processes.length; i++) {
        const process = processes[i];

        if (current_time <= process.tg_den) {
            // In ra khoảng không có Process nào chạy
            for (let i = current_time; i < process.tg_den; i++) {
                run_table.push({ "Thời điểm": i, "Tiến trình đang chạy": -1 });
            }
            if (run_table[run_table.length - 1] && run_table[run_table.length - 1]["Thời điểm"] !== "------") {
                run_table.push({ "Thời điểm": "------", "Tiến trình đang chạy": "------" });
            }
            current_time = process.tg_den;
        }
        const tg_cho = current_time - process.tg_den;
        const tg_hoanthanh = tg_cho + process.tg_chay;

        sum_tg_cho += tg_cho;
        sum_tg_hoanthanh += tg_hoanthanh;

        // In ra khoảng thời gian Process chạy
        for (let i = current_time; i < current_time + process.tg_chay; i++) {
            run_table.push({ "Thời điểm": i, "Tiến trình đang chạy": process.number });
        }
        run_table.push({ "Thời điểm": "------", "Tiến trình đang chạy": "------" });

        current_time += process.tg_chay;

        const process_stats = {
            stt: process.number,
            "TG Chờ": tg_cho,
            "TG Hoàn thành": tg_hoanthanh,
            "Thời điểm hoàn thành": current_time
        }
        data_table.push(process_stats);
    }

    console.log(FG_CYAN + "Biểu đồ Gantt (nhưng theo chiều dọc): " + RESET);
    console.table(run_table)

    console.log(FG_CYAN + "Kết quả: " + RESET);
    console.table(data_table);

    console.log(FG_CYAN + `Thời gian chờ trung bình = ${sum_tg_cho} / ${processes.length} = ` + sum_tg_cho / processes.length + RESET);
    console.log(FG_CYAN + `Thời gian hoàn thành trung bình = ${sum_tg_hoanthanh} / ${processes.length} = ` + sum_tg_hoanthanh / processes.length + RESET);
}


const init = () => {
    const numbers = [1, 2, 3, 4, 5];
    const tg_chay = [6, 2, 8, 3, 4];
    const tg_den = [2, 5, 1, 0, 4];

    const processes = [];
    for (let i = 0; i < numbers.length; i++) {
        processes.push(new Process(numbers[i], tg_chay[i], tg_den[i]));
    }

    fcfs(processes);
}

init()

// Burst time: Thời gian chạy
// Arrival time: Thời gian đến
// Waiting time: Thời gian chờ
// Turn around time: Thời gian hoàn thành
// Response time: Thời gian phản hồi

// Trong FCFS thời gian phản hồi bằng thời gian chờ