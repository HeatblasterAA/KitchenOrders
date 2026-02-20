package kitchenOrders.backend.model;

import lombok.Data;

@Data
public class OrderItem {
    private String menuItemId;
    //snapshot
    private String name;
    private double price;
    private int quantity;

}
