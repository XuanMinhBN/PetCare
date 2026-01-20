package org.xumin.petcare.domain;

import jakarta.persistence.*;
import org.xumin.petcare.domain.enumeration.ShipmentStatus;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "shipments")
public class Shipment implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "carrier", length = 80)
    private String carrier;

    @Column(name = "tracking", length = 120)
    private String tracking;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ShipmentStatus status;

    @Column(name = "created_at")
    private Instant createdAt;

    public Shipment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getTracking() {
        return tracking;
    }

    public void setTracking(String tracking) {
        this.tracking = tracking;
    }

    public ShipmentStatus getStatus() {
        return status;
    }

    public void setStatus(ShipmentStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Shipment{" +
                "id=" + id +
                ", carrier='" + carrier + '\'' +
                ", tracking='" + tracking + '\'' +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}
