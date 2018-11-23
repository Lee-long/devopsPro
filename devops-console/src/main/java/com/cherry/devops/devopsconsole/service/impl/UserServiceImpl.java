package com.cherry.devops.devopsconsole.service.impl;

import com.cherry.devops.devopsconsole.controller.UserController;
import com.cherry.devops.devopsconsole.entity.ResponseEntity;
import com.cherry.devops.devopsconsole.exception.DevopsException;
import com.cherry.devops.devopsconsole.exception.ExceptionEnum;
import com.cherry.devops.devopsconsole.service.UserService;
import com.cherry.devops.devopsconsole.utils.StrUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserServiceImpl
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/21 17:33
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/21 17:33
 */
@Service
public class UserServiceImpl implements UserService {

    private static final Logger LOGGER = LogManager.getLogger(UserServiceImpl.class);

    public ResponseEntity userLogin(String userName, String passWord, String verCode, String remoteIp) throws Exception {

        if (StrUtils.isNull(userName) || StrUtils.isNull(passWord)) {
            throw new DevopsException(ExceptionEnum.InvalidUserOrPassword);
        }

        if (userName.contains("=")) {
            throw new Exception();
        }
        ResponseEntity responseEntity = new ResponseEntity(true, "200", "success");

        return responseEntity;
    }

    public ResponseEntity userLogout(String userId) throws Exception {
        return null;
    }

    public ResponseEntity userUpdatePassWord(String userId, String newPassWord) throws Exception {
        return null;
    }

    public ResponseEntity userUpdate(String userId) throws Exception {
        return null;
    }
}
