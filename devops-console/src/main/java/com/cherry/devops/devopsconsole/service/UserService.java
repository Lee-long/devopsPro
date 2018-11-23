package com.cherry.devops.devopsconsole.service;

import com.cherry.devops.devopsconsole.entity.ResponseEntity;

/**
 * @ClassName UserService
 * @Description TODO
 * @Author lixiaolong
 * @Date Created in 2018/11/21 17:33
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/21 17:33
 */
public interface UserService {
    /**
     * @return java.lang.String
     * @MethodName userLogin
     * @Param [userName, passWord, verCode,remoteIp]
     * @Author lixiaolong
     * @Date 2018/11/21 17:39
     * @version 1.0
     */
    public abstract ResponseEntity userLogin(String userName, String passWord, String verCode, String remoteIp) throws Exception;

    /**
     * @return java.lang.String
     * @MethodName userLogout
     * @Description user登出
     * @Param [userId]
     * @Author lixiaolong
     * @Date 2018/11/21 17:39
     * @version 1.0
     */
    public abstract ResponseEntity userLogout(String userId) throws Exception;

    public abstract ResponseEntity userUpdatePassWord(String userId, String newPassWord) throws Exception;

    public abstract ResponseEntity userUpdate(String userId) throws Exception;
}
