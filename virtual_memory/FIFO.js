const RESET = "\x1b[0m";
const FG_YELLOW = "\x1b[33m";
const FG_CYAN = "\x1b[36m";
const FG_RED = "\x1b[31m";

const fifo = (frame_size, reference_list, should_log = true) => {
    let frame = Array(frame_size).fill(null), index = 0;
    let page_fault_count = 0;

    for (let i of reference_list) {
        if (!frame.includes(i)) {
            frame[index] = i;
            index = (index + 1) % frame_size;
            page_fault_count++;
            if (should_log) console.log(FG_YELLOW, `Đọc ${i}, page fault --> [${frame}]`, RESET);
        } else {
            if (should_log) console.log(FG_RED, `Đọc ${i}, có trong frame, không cần thay thế`, RESET);
        }
    }
    if (should_log) console.log(FG_CYAN, `Tổng số page fault: ${page_fault_count}`, RESET);
    return [frame, page_fault_count];
}

const main = () => {
    const reference_list = [0, 2, 1, 6, 4, 0, 1, 0, 3, 1, 2, 1]
    const frame_size = 4;

    fifo(frame_size, reference_list)

    // for (let i = 1; i <= 10; i++) {
    //     const [_, count] = fifo(i, reference_list, false);
    //     console.log(`Frame size = ${i}, page fault = ${count}`);
    // }
}

main()