package com.cherry.devops.devopsconsole.controller;

import com.cherry.devops.devopsconsole.entity.ResponseEntity;
import com.cherry.devops.devopsconsole.service.UserService;
import com.cherry.devops.devopsconsole.utils.StrUtils;
import com.cherry.devops.devopsconsole.utils.Utils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @ClassName UserController
 * @Description 用户Controller
 * @Author lixiaolong
 * @Date Created in 2018/11/20 14:18
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/20 14:18
 */
@Api(tags = "user操作Api")
@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger LOGGER = LogManager.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * @return java.lang.String
     * @MethodName consoleLogin
     * @Description user登录
     * @Param [username, password, request]
     * @Author lixiaolong
     * @Date 2018/11/20 14:40
     * @version 1.0
     */
    @ApiOperation(value = "user登录", notes = "注意***")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity userLogin(@RequestParam(value = "userName") String userName,
                                    @RequestParam(value = "passWord") String passWord,
                                    HttpServletRequest request) throws Exception {

        return userService.userLogin(userName, passWord, null, Utils.getRemoteIpAddress(request));
    }
}
