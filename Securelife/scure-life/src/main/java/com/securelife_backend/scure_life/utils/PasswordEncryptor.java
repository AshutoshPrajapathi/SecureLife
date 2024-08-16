package com.securelife_backend.scure_life.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.stereotype.Component;

import com.google.crypto.tink.Aead;
import com.google.crypto.tink.KeysetHandle;
import com.google.crypto.tink.aead.AeadConfig;
import com.google.crypto.tink.aead.AeadFactory;
import com.google.crypto.tink.aead.AeadKeyTemplates;

import jakarta.annotation.PostConstruct;


@Component
public class PasswordEncryptor {

    private Aead aead;

    @PostConstruct
    public void init() throws Exception {
        AeadConfig.register();
        KeysetHandle keysetHandle = KeysetHandle.generateNew(AeadKeyTemplates.AES256_EAX);
        aead = AeadFactory.getPrimitive(keysetHandle);
    }

    public String encrypt(String plaintext) throws Exception {
        byte[] plaintextBytes = plaintext.getBytes(StandardCharsets.UTF_8);
        byte[] ciphertextBytes = aead.encrypt(plaintextBytes, null);
        return Base64.getEncoder().encodeToString(ciphertextBytes);
    }

    public String decrypt(String ciphertext) throws Exception {
        byte[] ciphertextBytes = Base64.getDecoder().decode(ciphertext);
        byte[] plaintextBytes = aead.decrypt(ciphertextBytes, null);
        return new String(plaintextBytes, StandardCharsets.UTF_8);
    }
}