const RESET = "\x1b[0m";
const FG_YELLOW = "\x1b[33m";
const FG_CYAN = "\x1b[36m";
const FG_RED = "\x1b[31m";

const fifo = (frame_size, reference_list, should_log = true) => {
    let frame = Array(frame_size).fill(null);
    let second_chance = Array(frame_size).fill(0);
    let index = 0;
    let page_fault_count = 0;

    for (let i of reference_list) {
        if (!frame.includes(i)) {
            while (second_chance[index] === 1) {
                second_chance[index] = 0;
                index = (index + 1) % frame_size;
            }
            frame[index] = i;
            // Second chance mặc định là 0, nên không cần phải gán lại
            // second_chance[index] = 1;
            index = (index + 1) % frame_size;
            page_fault_count++;
            if (should_log) console.log(FG_YELLOW, `Đọc ${i}, page fault --> [${frame}]\t second chance --> [${second_chance}]`, RESET);

        } else {
            // Nếu i có sẵn trong frame thì reset second chance của i về 1
            second_chance[frame.indexOf(i)] = 1;
            if (should_log) console.log(FG_RED, `Đọc ${i}, có trong frame, \t second chance --> [${second_chance}]`, RESET);
        }
    }
    if (should_log) console.log(FG_CYAN, `Tổng số page fault: ${page_fault_count}`, RESET);
    return [frame, page_fault_count];
}

const main = () => {
    const reference_list = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]
    const frame_size = 3;
    fifo(frame_size, reference_list)

    for (let i = 1; i <= 10; i++) {
        const [_, count] = fifo(i, reference_list, false);
        console.log(`Frame size = ${i}, page fault = ${count}`);
    }
}

main()

// Second chance mặc định là 0
// Second chance tối đa là 1
// Second chance chỉ tăng lên khi page đó có sẵn trong frame