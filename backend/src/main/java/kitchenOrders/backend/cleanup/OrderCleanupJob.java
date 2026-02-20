package kitchenOrders.backend.cleanup;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderCleanupJob {
    private final OrderCleanupService cleanupService;

    public OrderCleanupJob(OrderCleanupService cleanupService) {
        this.cleanupService = cleanupService;
    }


    @Scheduled(cron = "0 0 3 * * *")
    public void runCleanup() {
        cleanupService.deleteOldOrders();
    }
}
