package com.ifpb.agendapet.exception;

public class ResourceErrorException extends RuntimeException {
    public ResourceErrorException() {
        super("Não foi possível realizar a operação");
    }
}
