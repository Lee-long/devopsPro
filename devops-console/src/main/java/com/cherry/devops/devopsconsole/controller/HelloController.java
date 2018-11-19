package com.cherry.devops.devopsconsole.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/hello")
    public String hello() {
        ServiceInstance instance = discoveryClient.getLocalServiceInstance();
        System.out.println("********************************************");
        System.out.println("* request path: " + instance.getUri() + " host: " + instance.getHost() + " serviceid: " + instance.getServiceId());
        System.out.println("********************************************");
        return "Eureka-clientone";
    }
}
