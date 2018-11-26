package com.cherry.devops.devopsconsole.interceptor;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @ClassName DevopsInterceptor
 * @Description 自定义拦截器
 * @Author lixiaolong
 * @Date Created in 2018/11/23 10:50
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/23 10:50
 */
@Component
public class DevopsInterceptor implements HandlerInterceptor {

    private static final Logger LOGGER = LogManager.getLogger(DevopsInterceptor.class);

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String Uri = request.getRequestURI();
        System.out.println(Uri);
        LOGGER.info("【DevopsInterceptor.preHandle】 {}", "enter DevopsInterceptor...");
        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
