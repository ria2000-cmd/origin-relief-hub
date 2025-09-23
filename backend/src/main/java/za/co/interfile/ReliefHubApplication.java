package za.co.interfile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = "za.co.interfile"
)
public class ReliefHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReliefHubApplication.class, args);
    }
}