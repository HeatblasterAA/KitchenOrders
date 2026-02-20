package kitchenOrders.backend.service;

import kitchenOrders.backend.model.MenuItem;
import kitchenOrders.backend.model.Order;
import kitchenOrders.backend.model.OrderItem;
import kitchenOrders.backend.repository.MenuItemRepository;
import kitchenOrders.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final MenuItemRepository menuRepo;

    public OrderService(OrderRepository orderRepo, MenuItemRepository menuRepo){
        this.orderRepo = orderRepo;
        this.menuRepo = menuRepo;

    }

    // FETCH ALL ORDERS //
    public List<Order> getAllOrders() {

        List<Order> orders  = orderRepo.findAll();
        for(Order order:orders){

            if(!order.isDelivered()){
                refreshFromMenu(order);
            }

        }
        return orders;
    }

    private void refreshFromMenu(Order order){
        for(OrderItem item: order.getItems()){
            menuRepo.findById(item.getMenuItemId()).ifPresent(menuItem -> {
                item.setName(menuItem.getName());
                item.setPrice(menuItem.getPrice());

            });
        }
    }

    // CREATE ORDER //

    public Order createOrder(Order orders) {



        for(OrderItem order: orders.getItems()){

            System.out.println("Checking menuItemId: " + order.getMenuItemId());

            MenuItem menuItem = menuRepo.findById(order.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException(
                            "Item not in Menu: " + order.getMenuItemId()
                    ));

            order.setName(menuItem.getName());
            order.setPrice(menuItem.getPrice());
        }
        orders.setPaid(false);
        orders.setDelivered(false);
        orders.setCreatedAt(LocalDateTime.now());

        return orderRepo.save(orders);
    }
//mark paid
public void markPaid(String id) {

    Order order = orderRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    order.setPaid(true);

    orderRepo.save(order);
}

    public Order updateOrder(String id, Order updatedOrder) {

//        Order exist = orderRepo.findById(id).orElseThrow(()->("Runtime error"));
        // 1. Fetch existing order
        Order existing = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Block updates if already delivered
        if (existing.isDelivered()) {
            throw new RuntimeException("Delivered order cannot be updated");
        }

        // 3. Update allowed fields
        existing.setCustomerName(updatedOrder.getCustomerName());
        existing.setDeliverBy(updatedOrder.getDeliverBy());
        existing.setItems(updatedOrder.getItems());

        // 4. Refresh name + price from menu (important)
        refreshFromMenu(existing);

        // 5. Save
        return orderRepo.save(existing);
    }

    public void deleteOrder(String id) {

        Order order = orderRepo.findById(id).orElseThrow(()-> new RuntimeException("Doesn't Exists"));

        if(order.isDelivered()){
            throw new RuntimeException("Delivered orders cannot be deleted manually");
        }
        orderRepo.deleteById(id);
    }

    public void markDelivered(String id) {

        Order order = orderRepo.findById(id).orElseThrow(()-> new RuntimeException("Doesn't Exist"));
        order.setDelivered(true);
        orderRepo.save(order);
    }
    private double calculateOrderTotal(Order order){

        return order.getItems().stream()
                .mapToDouble(i->i.getPrice()*i.getQuantity())
                .sum();
    }
    public double getDailyEarnings(LocalDate date) {
        return orderRepo.findAll().stream().filter(Order::isPaid)
                .filter(o->o.getCreatedAt().toLocalDate().equals(date))
                .mapToDouble(this::calculateOrderTotal).sum();
    }

    public double getMonthlyEarnings(YearMonth month) {

        return orderRepo.findAll().stream()
                .filter(Order::isPaid)
                .filter(o -> YearMonth.from(o.getCreatedAt()).equals(month))
                .mapToDouble(this::calculateOrderTotal)
                .sum();
    }
}
