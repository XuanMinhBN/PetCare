package org.xumin.petcare.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PayOSResponse {
    private String code;
    private String desc;
    private PayOSData data;

    public PayOSResponse() {
    }

    public PayOSResponse(String code, String desc, PayOSData data) {
        this.code = code;
        this.desc = desc;
        this.data = data;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public PayOSData getData() {
        return data;
    }

    public void setData(PayOSData data) {
        this.data = data;
    }

    public static class PayOSData {
        private String checkoutUrl;
        private String status;

        public PayOSData() {
        }

        public PayOSData(String checkoutUrl, String status) {
            this.checkoutUrl = checkoutUrl;
            this.status = status;
        }

        public String getCheckoutUrl() {
            return checkoutUrl;
        }

        public void setCheckoutUrl(String checkoutUrl) {
            this.checkoutUrl = checkoutUrl;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
