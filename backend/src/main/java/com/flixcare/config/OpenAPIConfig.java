package com.flixcare.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI flixCareOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FlixCare API")
                        .description("Baby tracking application REST API documentation")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FlixCare Team")
                                .email("support@flixcare.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
