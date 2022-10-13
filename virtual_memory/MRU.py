RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def mru(frame_size, reference_pages, should_print=True):
    frame = []
    page_fault_count = 0

    for i, page_number in enumerate(reference_pages):
        if page_number not in frame:
            if len(frame) < frame_size:
                frame.append(page_number)
            else:
                candidates = list(frame)
                for j in range(i - 1, -1, -1):
                    if reference_pages[j] in candidates:
                        frame[frame.index(reference_pages[j])] = page_number
                        break
            if should_print:
                print(FG_YELLOW + f"Đọc {page_number}, page fault --> {frame}" + RESET)
            page_fault_count += 1
        else:
            if should_print:
                print(FG_RED + f"Đọc {page_number}, đã có trong frame, không cần thay thế" + RESET)
    if should_print:
        print(FG_CYAN + f"Tổng số page fault: {page_fault_count}" + RESET)
    return page_fault_count


frame_size = 4
reference_pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]
mru(frame_size, reference_pages)

# for i in range(1, 10 + 1):
#     count = mru(i, reference_pages, should_print=False)
#     print(FG_YELLOW + f"Frame size: {i}, page fault count: {count}" + RESET)
