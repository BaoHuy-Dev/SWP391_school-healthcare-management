package com.fpt.medically_be.base;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public abstract class BaseService<EN> {

    protected EN create(EN entity) {
        return null;
    }


    protected EN update(EN entity) {
        return null;
    }


    protected boolean delete(Long id) {
        return false;
    }

    protected EN findOne(Long id) {
        return null;
    }


    protected List<EN> findAll() {
        return null;
    }
}
