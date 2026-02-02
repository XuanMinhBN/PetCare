package org.xumin.petcare.utils;

import org.xumin.petcare.service.dto.PayOSRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;

public class PayOSUtils {
    public static String createSignature(String checksumKey, PayOSRequest req) {
        String signatureString = String.format(
                "amount=%d&cancelUrl=%s&description=%s&orderCode=%d&returnUrl=%s",
                req.getAmount(),
                req.getCancelUrl(),
                req.getDescription(),
                req.getOrderCode(),
                req.getReturnUrl()
        );

        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] bytes = sha256_HMAC.doFinal(signatureString.getBytes(StandardCharsets.UTF_8));

            // Convert to Hex
            Formatter formatter = new Formatter();
            for (byte b : bytes) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký PayOS: " + e.getMessage());
        }
    }
}
