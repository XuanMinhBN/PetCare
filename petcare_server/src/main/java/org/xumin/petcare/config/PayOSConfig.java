package org.xumin.petcare.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
public class PayOSConfig {
    @Bean
    public PayOS payOS(PayOSProperties props) {
        return new PayOS(props.getClientId(), props.getApiKey(), props.getChecksumKey());
    }
}
