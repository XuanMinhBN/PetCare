package org.xumin.petcare.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.service.CheckoutService;
import org.xumin.petcare.service.OrderService;
import org.xumin.petcare.service.dto.CartRequest;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import java.util.Collections;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PayOS payOS;
    private final OrderService orderService;
    private final CheckoutService checkoutService;

    @Autowired
    public PaymentController(PayOS payOS, OrderService orderService, CheckoutService checkoutService) {
        this.payOS = payOS;
        this.orderService = orderService;
        this.checkoutService = checkoutService;
    }

    @PostMapping("/create-payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody CartRequest request) {
        try {
            // Gọi hàm createCheckoutUrl mà bạn thắc mắc đây
            // Hàm này sẽ tính toán, lưu đơn hàng PENDING và trả về Link PayOS
            String checkoutUrl = checkoutService.createCheckoutUrl(
                    request.getItems(),
                    request.getShippingFee(),
                    request.getDiscount()
            );
            // Trả về URL cho Frontend (để nó redirect người dùng sang PayOS)
            return ResponseEntity.ok(Collections.singletonMap("checkoutUrl", checkoutUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/payos-webhook")
    public ResponseEntity<String> handlePayOSWebhook(@RequestBody Webhook webhookBody) {
        try {
            orderService.handlePayOSWebhook(webhookBody);
//            System.out.println("Webhook nhận được: " + requestBody); @RequestBody Map<String, Object> requestBody
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Error");
        }
    }
}
