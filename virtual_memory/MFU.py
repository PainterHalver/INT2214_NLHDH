RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def lfu(frame_size, reference_pages, should_print=True):
    frame = []
    page_fault_count = 0
    frequency = {}
    for page_number in reference_pages:
        frequency[page_number] = 0
    reference_pages_copy = list(reference_pages)

    for i, page_number in enumerate(reference_pages):
        if page_number not in frame:
            if len(frame) < frame_size:
                frame.append(page_number)
                frequency[page_number] += 1
            else:
                candidates = list(frame)
                # get the most frequency and the candidate from candidates
                most_frequency = max(frequency[c] for c in candidates if frequency[c] > 0)
                candidates = [c for c in candidates if frequency[c] == most_frequency]
                # Nếu có nhiều page có cùng frequency cao nhất
                if len(candidates) > 1:
                    # FIFO
                    for j in range(0, i - 1, 1):
                        if reference_pages_copy[j] in candidates:
                            candidate = reference_pages_copy[j]
                            reference_pages_copy.pop(j)
                            break
                else:
                    candidate = candidates[0]

                frame[frame.index(candidate)] = page_number
                frequency[page_number] += 1
                frequency[candidate] = 0

            if should_print:
                print(
                    FG_YELLOW + f"Đọc {page_number}, page fault --> {frame}" + RESET + f"\t\t\tFrequency: {frequency}"
                )
            page_fault_count += 1
        else:
            frequency[page_number] += 1
            if should_print:
                print(
                    FG_RED
                    + f"Đọc {page_number}, đã có trong frame, không cần thay thế"
                    + RESET
                    + f"\tFrequency: {frequency}"
                )
    if should_print:
        print(FG_CYAN + f"Tổng số page fault: {page_fault_count}" + RESET)
    return page_fault_count


frame_size = 4
reference_pages = [1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6]
lfu(frame_size, reference_pages)

# for i in range(1, 10 + 1):
#     count = lfu(i, reference_pages, should_print=False)
#     print(FG_YELLOW + f"Frame size: {i}, page fault count: {count}" + RESET)
