package org.xumin.petcare.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xumin.petcare.domain.UserAccount;
import org.xumin.petcare.repository.UserAccountRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class EmailService {
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public EmailService(JavaMailSender mailSender, @Qualifier("templateEngine") SpringTemplateEngine templateEngine, UserAccountRepository userAccountRepository) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.userAccountRepository = userAccountRepository;
    }

    @Async // (Tùy chọn) Nên dùng @Async để gửi mail không làm chậm user
    public void sendForgotPasswordEmail(String toEmail, String userName, String token) {
        // Nên cấu hình baseUrl trong application.properties thay vì hardcode
        String baseUrl = "http://localhost:3000";
        String resetLink = baseUrl + "/reset-password?token=" + token;
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", userName);
        variables.put("resetLink", resetLink);
        variables.put("expireTime", "15");
        try {
            sendHtmlEmail(toEmail, "Yêu cầu đặt lại mật khẩu", "forgot_password", variables);
        } catch (MessagingException e) {
            // Log lỗi nhưng không ném Exception để tránh làm rollback transaction bên ngoài (tùy nghiệp vụ)
            e.printStackTrace();
        }
    }

    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        Context context = new Context();
        if (variables != null) {
            context.setVariables(variables);
        }
        String htmlBody = templateEngine.process(templateName, context);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }
}
