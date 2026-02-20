package kitchenOrders.backend.cleanup;

import kitchenOrders.backend.model.Order;
import kitchenOrders.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderCleanupService {

    private final OrderRepository repo;

    public  OrderCleanupService(OrderRepository repo){
        this.repo = repo;
    }
    public void deleteOldOrders(){
        LocalDateTime cutoff = LocalDateTime.now().minusDays(12);
        repo.deleteByDeliveredTrueAndCreatedAtBefore(cutoff);
    }
}
