package org.xumin.petcare.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
//    @PostMapping("/orders/{orderId}/qr")
//    public ResponseEntity<ApiResponse<PaymentDTO>> qrForOrder(@PathVariable java.util.UUID orderId){
//        PaymentDTO p = PaymentDTO.builder().id(java.util.UUID.randomUUID()).provider("vietqr").status("pending").amount(new BigDecimal("165000")).qrPayload("QR_BASE64_OR_URL").createdAt(java.time.OffsetDateTime.now()).build();
//        return ResponseEntity.ok(new ApiResponse<>(p));
//    }
//
//    @PostMapping("/subscriptions/{subscriptionId}/qr")
//    public ResponseEntity<ApiResponse<PaymentDTO>> qrForSub(@PathVariable java.util.UUID subscriptionId){
//        PaymentDTO p = PaymentDTO.builder().id(java.util.UUID.randomUUID()).provider("vietqr").status("pending").amount(new BigDecimal("79000")).qrPayload("QR_BASE64_OR_URL").createdAt(java.time.OffsetDateTime.now()).build();
//        return ResponseEntity.ok(new ApiResponse<>(p));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<PaymentDTO>> get(@PathVariable java.util.UUID id){
//        return ResponseEntity.ok(new ApiResponse<>(PaymentDTO.builder().id(id).status("pending").build()));
//    }
//
//    @PostMapping("/webhooks")
//    public ResponseEntity<ApiResponse<Map<String,Object>>> webhook(@RequestBody Map<String,Object> payload){
//        return ResponseEntity.ok(new ApiResponse<>(Map.of("ok", true)));
//    }

}
