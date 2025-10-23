package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import za.co.interfile.enums.UsersStatus;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateDto {
    private String fullName;
    private String email;
    private String username;
    private String phone;
    private LocalDate dateOfBirth;
    private String address;
    private String role;
    private UsersStatus status;
}
