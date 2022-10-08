#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

// gcc orphan.c -o orphan; ./orphan

int main()
{
    pid_t pid = fork();

    // A process whose parent process no longer exists i.e. either finished or terminated.

    // WSL chưa hỗ trợ systemd nên init() có thể không có pid là 1, và có nhiều init process
    // Nhưng khi mất cha thì process con sẽ có PPID của 1 init()

    // Cha chết khi con đang ngủ
    // Con được nhận nuôi bởi init()
    if (pid < 0)
    {
        printf("Có lỗi khi fork!\n");
        return -1;
    }
    else if (pid == 0)
    {
        printf("Pid con: %d\n", getpid());
        sleep(20);
    }
    else
    {
        // Process cha
        printf("Pid cha: %d\n", getpid());
    }

    return 0;
}
