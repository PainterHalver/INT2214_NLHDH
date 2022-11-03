# https://www.geeksforgeeks.org/fcfs-disk-scheduling-algorithms/

RESET = "\x1b[0m"
FG_YELLOW = "\x1b[33m"
FG_CYAN = "\x1b[36m"
FG_RED = "\x1b[31m"


def fcfs(sequence, head):
    seek_count = 0
    distance, cur_track = 0, 0
    for i in range(len(sequence)):
        cur_track = sequence[i]
        distance = abs(cur_track - head)
        seek_count += distance
        head = cur_track
    print(FG_YELLOW + f"Seek Sequence: {sequence}" + RESET)
    print(FG_CYAN + f"Total number of seek operations = {seek_count}" + RESET)


if __name__ == "__main__":
    sequence = [98, 183, 37, 122, 14, 124, 65, 67]
    head = 53

    fcfs(sequence, head)
