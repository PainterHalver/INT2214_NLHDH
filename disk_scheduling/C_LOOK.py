RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def look(sequence, head, direction):
    seek_count = 0
    seek_sequence = [head]

    initial_direction = direction

    # Sort left and right of head
    left = [num for num in sequence if num < head]
    left.sort(reverse=True)
    right = [num for num in sequence if num > head]
    right.sort(reverse=True)

    highest = max(sequence)
    lowest = min(sequence)

    # Code không đúng cách HEAD chạy nhưng ra kết quả đúng
    while len(left) > 0 or len(right) > 0:
        if direction == "left":
            if len(left) > 0:
                cur_track = left.pop()
                seek_count += abs(cur_track - head)
                seek_sequence.append(cur_track)
                head = cur_track
            else:
                if initial_direction == "left":
                    seek_sequence.append(highest)
                    seek_count += abs(highest - head)
                    right.pop(right.index(highest))
                    head = highest
                direction = "right"
        elif direction == "right":
            if len(right) > 0:
                cur_track = right.pop()
                seek_count += abs(cur_track - head)
                seek_sequence.append(cur_track)
                head = cur_track
            else:
                if initial_direction == "right":
                    seek_sequence.append(lowest)
                    seek_count += abs(lowest - head)
                    left.pop(left.index(lowest))
                    head = lowest
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

    look(sequence, head, direction)
