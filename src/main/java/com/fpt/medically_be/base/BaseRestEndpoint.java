package com.fpt.medically_be.base;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public abstract class BaseRestEndpoint<REQ, RES> {

    @PostMapping()
    public ResponseEntity<RES> create(@RequestBody REQ request) {
        return null;
    }


    @PutMapping("/{id}")
    public ResponseEntity<RES> update(@PathVariable Long id, @RequestBody REQ request) {
        return null;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        return null;
    }


    @GetMapping("/{id}")
    public ResponseEntity<RES> findOne(@PathVariable Long id) {
        return null;
    }


    @GetMapping
    public ResponseEntity<List<RES>> findAll() {
        return null;
    }
}