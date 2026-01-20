package org.xumin.petcare.web.rest;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.service.dto.MembershipDTO;
import org.xumin.petcare.service.dto.PlanDTO;


@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    @GetMapping("/plans")
    public ResponseEntity<PlanDTO> plans(){
        return ResponseEntity.ok().body(new PlanDTO());
    }

    @PostMapping
    public ResponseEntity<MembershipDTO> create(@RequestBody java.util.Map<String,Object> req){
        return ResponseEntity.ok().body(null);
    }

    @GetMapping
    public ResponseEntity<Page<MembershipDTO>> list(@RequestParam(required=false) String status){
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipDTO> get(@PathVariable java.util.UUID id){
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<MembershipDTO> cancel(@PathVariable java.util.UUID id){
        return ResponseEntity.ok().body(null);
    }

}
