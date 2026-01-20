package org.xumin.petcare.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.xumin.petcare.security.jwt.TokenProvider;
import org.xumin.petcare.service.UserAccountService;
import org.xumin.petcare.service.dto.UserAccountDTO;
import org.xumin.petcare.web.vm.LoginVM;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final UserAccountService userAccountService;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, TokenProvider tokenProvider, UserAccountService userAccountService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userAccountService = userAccountService;
    }

    @PostMapping("/login")
    public ResponseEntity<JWTToken> login(@Valid @RequestBody LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginVM.getEmail(),
                loginVM.getPassword()
        );
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<UserAccountDTO> register(@Valid @RequestBody UserAccountDTO userAccountDTO) throws URISyntaxException {
        UserAccountDTO user = userAccountService.registerUser(userAccountDTO, userAccountDTO.getPassword());
        return ResponseEntity.created(new URI("/api/register/" + user.getId())).body(user);
    }

    

    private static class JWTToken {
        private String idToken;
        JWTToken(String idToken) {
            this.idToken = idToken;
        }
        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }
        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
