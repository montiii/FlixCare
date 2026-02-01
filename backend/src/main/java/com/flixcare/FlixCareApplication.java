package com.flixcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FlixCareApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlixCareApplication.class, args);
    }
}
