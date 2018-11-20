package com.cherry.devops.devopsconsole.controller;

import com.cherry.devops.devopsconsole.utils.StrUtils;
import org.springframework.web.bind.annotation.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;

/**
 * @ClassName ConsoleController
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/20 14:18
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/20 14:18
 */
@RestController
@RequestMapping("/console")
public class ConsoleController {

    private static final Logger LOGGER = LogManager.getLogger(ConsoleController.class);
    //LoggerFactory.getLogger(ConsoleController.class);

    /**
     * @return java.lang.String
     * @MethodName consoleLogin
     * @Description 后台登录
     * @Param [userName, password, request]
     * @Author lixiaolong
     * @Date 2018/11/20 14:40
     * @version 1.0
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String consoleLogin(@RequestParam(value = "username") String userName,
                               @RequestParam(value = "password") String password,
                               HttpServletRequest request) {

        LOGGER.debug("{/console/login} - ConsoleController.consoleLogin - debug: params {username" + userName +
                ",password" + password + "}");

        if (StrUtils.isNull(userName)) {
            LOGGER.error("{/console/login} - ConsoleController.consoleLogin - error: params username is null");
        }

        if (StrUtils.isNull(password)) {
            LOGGER.error("{/console/login} - ConsoleController.consoleLogin - error: params password is null");
        }

        LOGGER.info("{/console/login} - ConsoleController.consoleLogin - info: login success");

        return "Hello, " + userName;
    }
}
