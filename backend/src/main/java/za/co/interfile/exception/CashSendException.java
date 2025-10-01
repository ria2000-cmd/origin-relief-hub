package za.co.interfile.exception;

public class CashSendException extends RuntimeException {
    public CashSendException(String message) {
        super(message);
    }
}