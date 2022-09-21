package com.gilberto.service;

import com.gilberto.domain.Permicao;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Permicao}.
 */
public interface PermicaoService {
    /**
     * Save a permicao.
     *
     * @param permicao the entity to save.
     * @return the persisted entity.
     */
    Permicao save(Permicao permicao);

    /**
     * Updates a permicao.
     *
     * @param permicao the entity to update.
     * @return the persisted entity.
     */
    Permicao update(Permicao permicao);

    /**
     * Partially updates a permicao.
     *
     * @param permicao the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Permicao> partialUpdate(Permicao permicao);

    /**
     * Get all the permicaos.
     *
     * @return the list of entities.
     */
    List<Permicao> findAll();

    /**
     * Get the "id" permicao.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Permicao> findOne(Long id);

    /**
     * Delete the "id" permicao.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
