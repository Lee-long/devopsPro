package com.cherry.devops.devopsconsole.configuration;

import com.cherry.devops.devopsconsole.interceptor.DevopsInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @ClassName DevopsConfigurerAdapter
 * @Description 拦截器配置类
 * @Author lixiaolong
 * @Date Created in 2018/11/23 10:54
 * @Version 1.0
 * @Modified by lixiaolong-2018/11/23 10:54
 */
@SpringBootConfiguration
public class DevopsConfigurerAdapter extends WebMvcConfigurerAdapter {

    @Autowired
    DevopsInterceptor devopsInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(devopsInterceptor).addPathPatterns("/**");
    }
}
