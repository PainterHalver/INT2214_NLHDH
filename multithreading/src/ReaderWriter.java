import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.concurrent.Semaphore;

class Reader extends Thread {
    public int number;

    Reader(int number) {
        this.number = number;
    }

    public void run() {
        try {
            do {
                // Nghỉ ngơi 1 lúc
                Thread.sleep((long) (Math.random() * ReaderWriter.WAIT_TIME));

                // Xin mutex để đọc
                ReaderWriter.mutex.acquire();
                // Đã xin được mutex, tăng số lượng reader đang đọc
                // Chỉnh biến `readcount` là Critical Section nên cần mutex
                ReaderWriter.readcount++;

                // Nếu là reader đầu tiên, xin semaphore `wrt` để đảm bảo không có ai đang viết
                // Các reader sau không cần xin semaphore này
                if (ReaderWriter.readcount == 1) {
                    ReaderWriter.wrt.acquire();
                }
                // Nhả mutex ra để cho Reader khác có thể cùng đọc (chỉnh biến `readcount`)
                ReaderWriter.mutex.release();

                // ĐỌC FILE ReaderWriter.txt
                readFile("./ReaderWriter.txt");

                // Xin mutex để giảm số lượng reader đang đọc
                ReaderWriter.mutex.acquire();
                // Đã xin được mutex, giảm số lượng reader đang đọc
                // Chỉnh biến `readcount` là Critical Section nên cần mutex
                ReaderWriter.readcount--;

                // Nếu là reader cuối cùng, nhả semaphore `wrt` để Writer có thể viết
                if (ReaderWriter.readcount == 0) {
                    ReaderWriter.wrt.release();
                }
                // Nhả mutex ra để cho Reader khác có thể vào đọc (chỉnh biến `readcount`)
                ReaderWriter.mutex.release();

            } while (true);

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }

    public void readFile(String fileName) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(fileName).toAbsolutePath()));
            System.out.println(
                    ReaderWriter.ANSI_YELLOW + "Reader " + number + " đọc: " + content + ReaderWriter.ANSI_RESET);
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}

class Writer extends Thread {
    public int number = 0;

    Writer(int number) {
        this.number = number;
    }

    public void run() {
        try {
            do {
                // Nghỉ ngơi 1 lúc
                Thread.sleep((long) (Math.random() * ReaderWriter.WAIT_TIME));

                ReaderWriter.wrt.acquire();

                // Write current time to file
                Date date = new Date();
                DateFormat formatter = new SimpleDateFormat("HH:mm:ss.SSS");
                formatter.setTimeZone(TimeZone.getTimeZone("GMT+7"));
                String dateFormatted = formatter.format(date);
                writeFile("./ReaderWriter.txt", dateFormatted);

                ReaderWriter.wrt.release();

            } while (true);

        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }

    public void writeFile(String fileName, String content) {
        try {
            Files.write(Paths.get(fileName), content.getBytes());
            System.out.println(
                    ReaderWriter.ANSI_CYAN + "Writer " + number + " viết: " + content + ReaderWriter.ANSI_RESET);
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }
}

public class ReaderWriter {
    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_CYAN = "\u001B[36m";

    public static final int WAIT_TIME = 2000;
    public static final int READER_COUNT = 5;
    public static final int WRITER_COUNT = 3;

    public static Semaphore mutex = new Semaphore(1);
    public static Semaphore wrt = new Semaphore(1);
    public static int readcount = 0;

    public static void main(String[] args) {
        for (int i = 0; i < READER_COUNT; i++) {
            new Reader(i + 1).start();
        }

        for (int i = 0; i < WRITER_COUNT; i++) {
            new Writer(i + 1).start();
        }
    }
}

/**
 * Có thể có nhiều Reader đọc file, nhưng khi có Writer đang truy cập file
 * thì không ai khác được truy cập/đọc file dù là Writer hay Reader.
 * 
 * 2 semaphore: mutex và wrt
 * 1 biến: readcount (có bao nhiêu process đang đọc file)
 * 
 * Reader đọc file không phải là Critical Section
 * mà chỉnh biến `readcount` và chỉnh file mới là Critical Section
 * 
 * https://www.youtube.com/watch?v=p2XDhW5INOo
 */