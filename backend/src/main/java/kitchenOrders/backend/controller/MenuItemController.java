package kitchenOrders.backend.controller;
import jakarta.validation.Valid;
import kitchenOrders.backend.model.MenuItem;
import kitchenOrders.backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class MenuItemController {

//    @Autowired
    private final MenuItemService service;

    public MenuItemController(MenuItemService service){
        this.service = service;
    }



    @GetMapping("/menu")
    public List<MenuItem> getAllItems(){
        List<MenuItem> itemsFromService = service.getAllItems();
        return itemsFromService;
    }

    @PostMapping("/menu")
    public MenuItem createItem(@Valid @RequestBody MenuItem item){
        return service.createItem(item);
    }

    @PutMapping("/menu/{id}")
    public MenuItem updateItem(@PathVariable String id,@Valid @RequestBody MenuItem item){
        return service.updateItem(id,item);
    }
    @DeleteMapping("/menu/{id}")
    public void deleteItem(@PathVariable String id){
         service.deleteItem(id);
    }



}
