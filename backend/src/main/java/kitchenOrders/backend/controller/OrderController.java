package kitchenOrders.backend.controller;

import jakarta.validation.Valid;
import kitchenOrders.backend.model.Order;
import kitchenOrders.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service){
        this.service = service;
    }

    @GetMapping
    public List<Order> getAllOrders(){
        return service.getAllOrders();
    }

    @PostMapping("/create")
    public Order createOrder(@RequestBody Order order){
        return service.createOrder(order);
    }

    @PutMapping("/update/{id}")
    public Order updateOrder(@PathVariable String id, @RequestBody Order order){
        return service.updateOrder(id, order);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrder(@PathVariable String id){
        service.deleteOrder(id);
    }
    @PostMapping("/{id}/delivered")
    public void markDelivered(@PathVariable String id){
        service.markDelivered(id);
    }
    @GetMapping("/earnings/day")
    public double getDailyEarnings(@RequestParam String date) {
        return service.getDailyEarnings(LocalDate.parse(date));
    }

    @GetMapping("/earnings/month")
    public double getMonthlyEarnings(@RequestParam String month) {
        return service.getMonthlyEarnings(YearMonth.parse(month));
    }
    @PostMapping("/{id}/paid")
    public void markPaid(@PathVariable String id){
        service.markPaid(id);
    }





}
