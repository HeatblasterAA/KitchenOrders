package kitchenOrders.backend.controller;

import kitchenOrders.backend.model.JwtUtil;
import kitchenOrders.backend.model.LoginRequest;
import kitchenOrders.backend.model.User;
import kitchenOrders.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository userRepo,
                          JwtUtil jwtUtil,
                          PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return Map.of("token", token);
    }
}

