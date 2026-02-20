package kitchenOrders.backend.repository;

import kitchenOrders.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface OrderRepository extends MongoRepository<Order, String> {

    void deleteByDeliveredTrueAndCreatedAtBefore(LocalDateTime cutoff);


}
