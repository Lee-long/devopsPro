package com.cherry.devops.devopsconsole.service;

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
     * @Param [userName, passWord, verCode]
     * @Author lixiaolong
     * @Date 2018/11/21 17:39
     * @version 1.0
     */
    public abstract String userLogin(String userName, String passWord, String verCode);

    /**
     * @return java.lang.String
     * @MethodName userLogout
     * @Description user登出
     * @Param [userId]
     * @Author lixiaolong
     * @Date 2018/11/21 17:39
     * @version 1.0
     */
    public abstract String userLogout(String userId);

    public abstract String userUpdatePassWord(String userId, String newPassWord);

    public abstract String userUpdate(String userId);
}
