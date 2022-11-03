RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def sstf(sequence, head):
    seek_count = 0
    seek_sequence = [head]

    # Github copium
    while len(sequence) > 0:
        diff = [abs(num - head) for num in sequence]
        index = diff.index(min(diff))
        cur_track = sequence.pop(index)
        seek_count += abs(cur_track - head)
        seek_sequence.append(cur_track)
        head = cur_track

    print(FG_YELLOW + f"Seek Sequence: {seek_sequence}" + RESET)
    print(FG_CYAN + f"Total number of seek operations = {seek_count}" + RESET)


if __name__ == "__main__":
    sequence = [98, 183, 37, 122, 14, 124, 65, 67]
    head = 53

    sstf(sequence, head)
