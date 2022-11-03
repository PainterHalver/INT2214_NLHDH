RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def c_scan(sequence, head, direction, max_head):
    seek_count = 0
    seek_sequence = [head]

    initial_direction = direction

    # SCAN Disk Scheduling Algorithm
    # Sort left and right of head
    left = [num for num in sequence if num < head]
    left.sort(reverse=True)
    right = [num for num in sequence if num > head]
    right.sort(reverse=True)

    # Code không đúng cách HEAD chạy nhưng ra kết quả đúng
    while len(left) > 0 or len(right) > 0:
        if direction == "left":
            if len(left) > 0:
                cur_track = left.pop()
                seek_count += abs(cur_track - head)
                seek_sequence.append(cur_track)
                head = cur_track
            else:
                seek_count += abs(0 - head)
                seek_sequence.append(0)
                head = 0
                if initial_direction == "left":
                    seek_sequence.append(max_head)
                    seek_count += abs(max_head - 0)
                    head = max_head
                direction = "right"
        elif direction == "right":
            if len(right) > 0:
                cur_track = right.pop()
                seek_count += abs(cur_track - head)
                seek_sequence.append(cur_track)
                head = cur_track
            else:
                seek_count += abs(max_head - head)
                seek_sequence.append(max_head)
                head = max_head
                if initial_direction == "right":
                    seek_sequence.append(0)
                    seek_count += abs(0 - max_head)
                    head = 0
                direction = "left"

    print(FG_YELLOW + f"Seek Sequence: {seek_sequence}" + RESET)
    print(FG_CYAN + f"Total number of seek operations = {seek_count}" + RESET)


if __name__ == "__main__":
    # sequence = [176, 79, 34, 60, 92, 11, 41, 114]
    # head = 50
    sequence = [98, 183, 37, 122, 14, 124, 65, 67]
    head = 53
    direction = "right"
    max_head = 199

    c_scan(sequence, head, direction, max_head)
