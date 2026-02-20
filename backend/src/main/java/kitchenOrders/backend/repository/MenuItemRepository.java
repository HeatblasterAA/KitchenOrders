package kitchenOrders.backend.repository;
import kitchenOrders.backend.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MenuItemRepository extends MongoRepository<MenuItem,String> {

}
