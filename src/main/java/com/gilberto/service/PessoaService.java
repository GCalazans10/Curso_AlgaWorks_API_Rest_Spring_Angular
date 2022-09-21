package com.gilberto.service;

import com.gilberto.domain.Pessoa;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Pessoa}.
 */
public interface PessoaService {
    /**
     * Save a pessoa.
     *
     * @param pessoa the entity to save.
     * @return the persisted entity.
     */
    Pessoa save(Pessoa pessoa);

    /**
     * Updates a pessoa.
     *
     * @param pessoa the entity to update.
     * @return the persisted entity.
     */
    Pessoa update(Pessoa pessoa);

    /**
     * Partially updates a pessoa.
     *
     * @param pessoa the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Pessoa> partialUpdate(Pessoa pessoa);

    /**
     * Get all the pessoas.
     *
     * @return the list of entities.
     */
    List<Pessoa> findAll();

    /**
     * Get the "id" pessoa.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Pessoa> findOne(Long id);

    /**
     * Delete the "id" pessoa.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
