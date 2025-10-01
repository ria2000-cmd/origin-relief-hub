package za.co.interfile.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkSassaAccountResponse {
    private boolean success;
    private String message;
    private Long sassaAccountId;
    private String accountNumber;
    private String status;
}