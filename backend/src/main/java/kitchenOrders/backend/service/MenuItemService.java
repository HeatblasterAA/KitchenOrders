package kitchenOrders.backend.service;

import kitchenOrders.backend.model.MenuItem;
import kitchenOrders.backend.repository.MenuItemRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository){
        this.repository = repository;
    }
    public List<MenuItem> getAllItems() {
        return repository.findAll();
    }

    public MenuItem createItem(MenuItem item) {


        return repository.save(item);
    }

    public MenuItem updateItem(String id, MenuItem updatedItem) {
        MenuItem existingItem = repository.findById(id).orElseThrow(()->new RuntimeException("Item not found"));
        existingItem.setName(updatedItem.getName());
        existingItem.setPrice(updatedItem.getPrice());

        return repository.save(existingItem);
    }

    public void deleteItem(String id){
        if (!repository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        repository.deleteById(id);
    }
}
