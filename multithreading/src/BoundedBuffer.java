import java.util.ArrayDeque;
import java.util.concurrent.Semaphore;

class Producer extends Thread {
    public void run() {
        try {
            do {
                // Randomize add time but make it a bit faster than consumer
                Thread.sleep((long) (Math.random() * BoundedBuffer.WAIT_TIME * 0.7));

                // Generate a random character
                char c = (char) (Math.random() * 26 + 'A');

                BoundedBuffer.empty.acquire();
                BoundedBuffer.mutex.acquire();

                // Add the character to the buffer
                BoundedBuffer.BUFFER.addFirst(c);
                BoundedBuffer.printBuffer();
                // System.out.println("Producer added " + c + " to the buffer.");

                BoundedBuffer.mutex.release();
                BoundedBuffer.full.release();
            } while (true);

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}

class Consumer extends Thread {
    public void run() {
        try {
            do {
                // Randomize Poll time
                Thread.sleep((long) (Math.random() * BoundedBuffer.WAIT_TIME));

                BoundedBuffer.full.acquire();
                BoundedBuffer.mutex.acquire();

                // Remove a character from the buffer
                BoundedBuffer.BUFFER.pollLast();
                BoundedBuffer.printBuffer();
                // System.out.println("Consumer removed " + c + " from the buffer.");

                BoundedBuffer.mutex.release();
                BoundedBuffer.empty.release();
            } while (true);

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}

class BoundedBuffer {
    public static final int WAIT_TIME = 1000;

    public static final int BUFFER_SIZE = 10;

    // Dù Queue có dài cỡ nào thì cũng chỉ
    // có BUFFER_SIZE phần tử do bị khóa semaphore
    public static ArrayDeque<Object> BUFFER = new ArrayDeque<Object>(100000000);

    public static Semaphore mutex = new Semaphore(1);
    public static Semaphore full = new Semaphore(0);
    public static Semaphore empty = new Semaphore(BUFFER_SIZE);

    public static void main(String[] args) {

        Producer producer = new Producer();
        Consumer consumer = new Consumer();
        producer.start();
        consumer.start();
    }

    public static void printBuffer() {
        // System.out.print("\033[H\033[2J");
        // System.out.flush();
        System.out.println("Buffer: " + BUFFER);
    }
}