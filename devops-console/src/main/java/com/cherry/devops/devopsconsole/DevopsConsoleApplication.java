package com.cherry.devops.devopsconsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class DevopsConsoleApplication {

    public static void main(String[] args) {
        SpringApplication.run(DevopsConsoleApplication.class, args);
    }
}
