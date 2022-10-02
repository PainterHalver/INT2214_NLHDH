import java.util.concurrent.Semaphore;

public class DiningPhilosophers {
    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_BLACK = "\u001B[30m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_PURPLE = "\u001B[35m";
    public static final String ANSI_CYAN = "\u001B[36m";
    public static final String ANSI_WHITE = "\u001B[37m";

    static final int EAT_TIME = 2000;
    static final int PHILOSOPHER_COUNT = 5;
    static Philosopher philosophers[] = new Philosopher[PHILOSOPHER_COUNT];
    static Chopstick chopsticks[] = new Chopstick[PHILOSOPHER_COUNT];

    public static void main(String[] args) {
        // Create chopsticks and philosophers
        for (int i = 0; i < PHILOSOPHER_COUNT; i++) {
            chopsticks[i] = new Chopstick(i);
        }
        for (int i = 0; i < PHILOSOPHER_COUNT - 1; i++) {
            philosophers[i] = new Philosopher(i, chopsticks[i], chopsticks[(i + 1) % PHILOSOPHER_COUNT]);
        }
        // The last philosopher picks up the chopstick to his right instead of his left,
        // goodbye DEADLOCK
        philosophers[PHILOSOPHER_COUNT - 1] = new Philosopher(PHILOSOPHER_COUNT - 1, chopsticks[0],
                chopsticks[PHILOSOPHER_COUNT - 1]);

        // Start the philosophers
        for (int i = 0; i < PHILOSOPHER_COUNT; i++) {
            philosophers[i].start();
        }

        // Print the state of the philosophers every 5 seconds
        while (true) {
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            for (int i = 0; i < PHILOSOPHER_COUNT; i++) {
                System.out.println(ANSI_CYAN + philosophers[i].toString() + ANSI_RESET);
            }
            System.out.println();
        }

        // while (true) {
        // try {
        // Thread.sleep(5000);

        // // check for deadlock condition
        // boolean deadlock = true;
        // for (Chopstick chopstick : chopsticks) {
        // if (chopstick.isFree()) {
        // deadlock = false;
        // break;
        // }
        // }

        // if (deadlock) {
        // System.out.println("DEADLOCK");
        // break;
        // }
        // } catch (Exception e) {
        // e.printStackTrace(System.out);
        // }
        // }
        // System.exit(0);
    }
}

class Philosopher extends Thread {
    public int number;
    public Chopstick left_chopstick;
    public Chopstick right_chopstick;

    public Philosopher(int number, Chopstick left_chopstick, Chopstick right_chopstick) {
        this.number = number;
        this.left_chopstick = left_chopstick;
        this.right_chopstick = right_chopstick;
    }

    public void run() {
        while (true) {
            left_chopstick.grab(number);
            System.out.println("Nhà triết học " + (number) + " lấy đũa " + left_chopstick.number + ".");
            right_chopstick.grab(number);
            System.out.println("Nhà triết học " + (number) + " lấy đũa " + right_chopstick.number + ".");
            // hunger philosopher starts eating
            eat();
            // releases left and right chopsticks when philosopher is not hunger
            right_chopstick.release();
            System.out.println("Nhà triết học " + (number) + " bỏ đũa " + right_chopstick.number + ".");
            left_chopstick.release();
            System.out.println("Nhà triết học " + (number) + " bỏ đũa " + left_chopstick.number + ".");
        }
    }

    public void eat() {
        try {
            System.out.println(DiningPhilosophers.ANSI_YELLOW + "Nhà triết học " + (number) + " đang ăn."
                    + DiningPhilosophers.ANSI_RESET);
            Thread.sleep((long) (DiningPhilosophers.EAT_TIME));
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }

    public String toString() {
        StringBuilder sb = new StringBuilder("Nhà triết học " + number + " ");
        if (left_chopstick.holderNumber == number && right_chopstick.holderNumber == number) {
            sb.append("đang cầm đũa " + left_chopstick.number + " và đũa " + right_chopstick.number + ". => Ăn");
        } else if (left_chopstick.holderNumber == number && right_chopstick.holderNumber != number) {
            sb.append("đang cầm đũa " + left_chopstick.number + " và chờ đũa " + right_chopstick.number + ". => Nghĩ");
        } else if (left_chopstick.holderNumber != number && right_chopstick.holderNumber == number) {
            sb.append("đang cầm đũa " + right_chopstick.number + " và chờ đũa " + left_chopstick.number + ". => Nghĩ");
        } else {
            sb.append("đang chờ đũa " + left_chopstick.number + " và đũa " + right_chopstick.number + ". => Nghĩ");
        }

        return sb.toString();
    }
}

class Chopstick {
    public int number;
    public Semaphore mutex = new Semaphore(1);
    public int holderNumber = -1;

    Chopstick(int number) {
        this.number = number;
    }

    public void grab(int holderNumber) {
        try {
            mutex.acquire(); // this line blocks if the chopstick is not free
            this.holderNumber = holderNumber;
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void release() {
        mutex.release();
    }

    boolean isFree() {
        return mutex.availablePermits() > 0;
    }
}