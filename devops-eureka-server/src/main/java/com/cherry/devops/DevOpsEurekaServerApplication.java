package com.cherry.devops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;


@SpringBootApplication
@EnableEurekaServer
public class DevOpsEurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevOpsEurekaServerApplication.class, args);
    }
}
