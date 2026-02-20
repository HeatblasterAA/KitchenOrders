package kitchenOrders.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;


@Document(collection = "menu_items")
@Data
public class MenuItem {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank
    private String name;
    @Positive
    private double price;
}
