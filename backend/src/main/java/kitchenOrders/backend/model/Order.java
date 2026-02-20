package kitchenOrders.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection= "orders")
@Data
public class Order {
    @Id
    private String id;

    private  String customerName;

    private List<OrderItem> items;

    private boolean delivered;
    private boolean paid;

    private LocalDateTime deliverBy;
    private LocalDateTime createdAt;

}
