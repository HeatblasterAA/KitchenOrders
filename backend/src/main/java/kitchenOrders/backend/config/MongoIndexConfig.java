package kitchenOrders.backend.config;

import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;
import kitchenOrders.backend.model.MenuItem;
import org.bson.Document;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoIndexConfig {

    private final MongoTemplate mongoTemplate;

    public MongoIndexConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void createIndexes() {
        mongoTemplate
                .getCollection("menu_items")
                .createIndex(
                        new Document("name", 1),
                        new IndexOptions().unique(true)
                );
    }
}
